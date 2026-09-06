import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { redactIndianPII } from '../utils/piiRedactor.js';
import { invokeLLM, providerInfo } from './aiProvider.js';
import { assertDailyAIQuota, recordAIUsage } from './aiUsageService.js';
import { generationPrompt, analysisPrompt, clausePrompt, chatPrompt, generalLegalPrompt, legalAssistantPrompt, answerCompletionPrompt } from '../ai/prompts.js';
import { mockGenerate, mockAnalyze, mockExplainClause, mockImproveClause, mockChat, mockGeneralLegalAnswer } from './mockLegalAI.js';
import { retrieve, formatContext, citationsFromChunks } from './ragService.js';

function limitInput(text) {
  const value = String(text || '');
  if (value.length > env.AI_MAX_INPUT_CHARS) throw new ApiError(413, `AI input exceeds the ${env.AI_MAX_INPUT_CHARS.toLocaleString()} character safety limit.`, 'AI_INPUT_TOO_LARGE');
  return value;
}
function safeJson(text) {
  const match = String(text).match(/\{[\s\S]*\}/);
  if (!match) throw new ApiError(502, 'AI returned an invalid structured response.', 'AI_INVALID_RESPONSE');
  try { return JSON.parse(match[0]); } catch { throw new ApiError(502, 'AI returned malformed JSON.', 'AI_INVALID_RESPONSE'); }
}
async function run({ userId, operation, input, execute }) {
  await assertDailyAIQuota(userId);
  const started = Date.now(); const info = providerInfo();
  try {
    const result = await execute();
    await recordAIUsage({ userId, operation, ...info, inputChars: String(input).length, outputText: typeof result === 'string' ? result : JSON.stringify(result), latencyMs: Date.now()-started });
    return result;
  } catch (error) {
    await recordAIUsage({ userId, operation, ...info, inputChars: String(input).length, latencyMs: Date.now()-started, status: 'failure' });
    throw error;
  }
}
function maybeRedact(text, enabled) { return enabled ? redactIndianPII(text).text : text; }
function sourceTaggedAnswer(answer, defaultSource) {
  const value = String(answer || '').trim();
  if (value.startsWith('[[KNOWLEDGE_BASE]]')) return { answer: value.replace('[[KNOWLEDGE_BASE]]', '').trim(), answerSource: 'knowledge_base' };
  if (value.startsWith('[[GENERAL_AI]]')) return { answer: value.replace('[[GENERAL_AI]]', '').trim(), answerSource: 'general_ai' };
  return { answer: value, answerSource: defaultSource };
}
function isDisclaimerOnly(answer) {
  const value = String(answer || '').replace(/\[\[(?:GENERAL_AI|KNOWLEDGE_BASE)\]\]/g, '').trim();
  return value.length < 240 && /(not found in (?:the )?(?:workspace )?knowledge base|information (?:is )?(?:unavailable|insufficient)|cannot (?:answer|provide)|could not find|not enough information)/i.test(value);
}

export async function generateLegalDocument({ userId, template, fields, language='en', redactPII=true }) {
  const raw = limitInput(JSON.stringify(fields));
  return run({ userId, operation: 'document_generation', input: raw, execute: async () => {
    if (env.AI_PROVIDER === 'mock') return mockGenerate(template, fields);
    const query = `${template.name} ${Object.keys(fields).join(' ')}`;
    const chunks = await retrieve({ query, userId, includeGlobal: true, k: 4 });
    return invokeLLM(generationPrompt({ templateName: template.name, fields: JSON.parse(maybeRedact(raw, redactPII)), context: formatContext(chunks), language }));
  }});
}
export async function analyzeLegalDocument({ userId, documentId, content, language='en', redactPII=true }) {
  const safeContent = limitInput(content);
  return run({ userId, operation: 'document_analysis', input: safeContent, execute: async () => {
    if (env.AI_PROVIDER === 'mock') return mockAnalyze(safeContent);
    const chunks = await retrieve({ query: `analyze risks obligations clauses ${safeContent.slice(0,1000)}`, userId, documentId, includeGlobal: true, k: 5 });
    const response = await invokeLLM(analysisPrompt({ content: maybeRedact(safeContent, redactPII), context: formatContext(chunks), language }));
    return safeJson(response);
  }});
}
export async function transformClause({ userId, clause, mode='explain', language='en', redactPII=true }) {
  const safe = limitInput(clause);
  return run({ userId, operation: `clause_${mode}`, input: safe, execute: async () => {
    if (env.AI_PROVIDER === 'mock') return mode === 'improve' ? mockImproveClause(safe) : mockExplainClause(safe);
    const prompt = clausePrompt({ clause: maybeRedact(safe, redactPII), mode, language });
    const answer = await invokeLLM(prompt);
    return isDisclaimerOnly(answer) ? invokeLLM(answerCompletionPrompt({ question: `${mode === 'improve' ? 'Improve' : 'Explain'} this clause: ${maybeRedact(safe, redactPII)}`, language })) : answer;
  }});
}
export async function askGrounded({ userId, question, documentId, history='', language='en', redactPII=true }) {
  const safe = limitInput(question);
  return run({ userId, operation: documentId ? 'document_chat' : 'legal_chat', input: safe, execute: async () => {
    const chunks = await retrieve({ query: safe, userId, documentId, includeGlobal: !documentId, k: 5 });
    const relevantChunks = documentId ? chunks : chunks.filter(chunk => (chunk.score || 0) >= env.KB_MIN_RELEVANCE_SCORE);
    const citations = citationsFromChunks(relevantChunks);
    if (!relevantChunks.length) {
      if (documentId) return { answer: 'I could not find supporting information in this document.', citations: [], confidence: 0, answerSource: 'document' };
      const fallbackQuestion = maybeRedact(safe, redactPII);
      const fallbackHistory = maybeRedact(history.slice(-4000), redactPII);
      let rawAnswer = env.AI_PROVIDER === 'mock' ? mockGeneralLegalAnswer(fallbackQuestion) : await invokeLLM(generalLegalPrompt({ question: fallbackQuestion, history: fallbackHistory, language }));
      if (env.AI_PROVIDER !== 'mock' && isDisclaimerOnly(rawAnswer)) rawAnswer = await invokeLLM(answerCompletionPrompt({ question: fallbackQuestion, language }));
      const { answer, answerSource } = sourceTaggedAnswer(rawAnswer, 'general_ai');
      return { answer, citations: [], confidence: 0, answerSource };
    }
    if (!documentId) {
      let rawAnswer = env.AI_PROVIDER === 'mock' ? mockChat(safe, relevantChunks) : await invokeLLM(legalAssistantPrompt({ question: maybeRedact(safe, redactPII), context: maybeRedact(formatContext(relevantChunks), redactPII), history: maybeRedact(history.slice(-4000), redactPII), language }));
      if (env.AI_PROVIDER !== 'mock' && isDisclaimerOnly(rawAnswer)) rawAnswer = await invokeLLM(answerCompletionPrompt({ question: maybeRedact(safe, redactPII), language }));
      const { answer, answerSource } = sourceTaggedAnswer(rawAnswer, env.AI_PROVIDER === 'mock' ? 'knowledge_base' : 'general_ai');
      return { answer, citations: answerSource === 'knowledge_base' ? citations : [], confidence: answerSource === 'knowledge_base' ? Math.max(0, Math.min(1, relevantChunks[0]?.score || 0)) : 0, answerSource };
    }
    let answer = env.AI_PROVIDER === 'mock' ? mockChat(safe, relevantChunks) : await invokeLLM(chatPrompt({ question: maybeRedact(safe, redactPII), context: maybeRedact(formatContext(relevantChunks), redactPII), history: maybeRedact(history.slice(-4000), redactPII), language }));
    if (env.AI_PROVIDER !== 'mock' && isDisclaimerOnly(answer)) answer = await invokeLLM(answerCompletionPrompt({ question: maybeRedact(safe, redactPII), context: maybeRedact(formatContext(relevantChunks), redactPII), language, sourceBound: true }));
    const confidence = Math.max(0, Math.min(1, relevantChunks[0]?.score || 0));
    return { answer, citations, confidence, answerSource: documentId ? 'document' : 'knowledge_base' };
  }});
}
