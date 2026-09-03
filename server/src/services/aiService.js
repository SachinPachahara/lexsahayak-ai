import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { redactIndianPII } from '../utils/piiRedactor.js';
import { invokeLLM, providerInfo } from './aiProvider.js';
import { assertDailyAIQuota, recordAIUsage } from './aiUsageService.js';
import { generationPrompt, analysisPrompt, clausePrompt, chatPrompt } from '../ai/prompts.js';
import { mockGenerate, mockAnalyze, mockExplainClause, mockImproveClause, mockChat } from './mockLegalAI.js';
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

export async function generateLegalDocument({ userId, template, fields, language='en', redactPII=true }) {
  const raw = limitInput(JSON.stringify(fields));
  return run({ userId, operation: 'document_generation', input: raw, execute: async () => {
    if (env.AI_PROVIDER === 'mock') return mockGenerate(template, fields);
    const query = `${template.name} ${Object.keys(fields).join(' ')}`;
    const chunks = await retrieve({ query, userId, includeGlobal: true, k: 4 });
    return invokeLLM(generationPrompt({ templateName: template.name, fields: JSON.parse(maybeRedact(raw, redactPII)), context: formatContext(chunks), language }));
  }});
}
export async function analyzeLegalDocument({ userId, documentId, content, redactPII=true }) {
  const safeContent = limitInput(content);
  return run({ userId, operation: 'document_analysis', input: safeContent, execute: async () => {
    if (env.AI_PROVIDER === 'mock') return mockAnalyze(safeContent);
    const chunks = await retrieve({ query: `analyze risks obligations clauses ${safeContent.slice(0,1000)}`, userId, documentId, includeGlobal: true, k: 5 });
    const response = await invokeLLM(analysisPrompt({ content: maybeRedact(safeContent, redactPII), context: formatContext(chunks) }));
    return safeJson(response);
  }});
}
export async function transformClause({ userId, clause, mode='explain', redactPII=true }) {
  const safe = limitInput(clause);
  return run({ userId, operation: `clause_${mode}`, input: safe, execute: async () => {
    if (env.AI_PROVIDER === 'mock') return mode === 'improve' ? mockImproveClause(safe) : mockExplainClause(safe);
    return invokeLLM(clausePrompt({ clause: maybeRedact(safe, redactPII), mode }));
  }});
}
export async function askGrounded({ userId, question, documentId, history='', redactPII=true }) {
  const safe = limitInput(question);
  return run({ userId, operation: documentId ? 'document_chat' : 'legal_chat', input: safe, execute: async () => {
    const chunks = await retrieve({ query: safe, userId, documentId, includeGlobal: !documentId, k: 5 });
    const citations = citationsFromChunks(chunks);
    if (!chunks.length) return { answer: 'I could not find supporting information in the authorized document or knowledge base. I will not invent a legal answer.', citations: [], confidence: 0 };
    const answer = env.AI_PROVIDER === 'mock' ? mockChat(safe, chunks) : await invokeLLM(chatPrompt({ question: maybeRedact(safe, redactPII), context: maybeRedact(formatContext(chunks), redactPII), history: maybeRedact(history.slice(-4000), redactPII) }));
    const confidence = Math.max(0, Math.min(1, chunks[0]?.score || 0));
    return { answer, citations, confidence };
  }});
}
