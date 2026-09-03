import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { InferenceClient } from '@huggingface/inference';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { env } from '../config/env.js';
import { mockEmbedding } from '../utils/vector.js';
import { SYSTEM_LEGAL_SAFETY } from '../ai/prompts.js';

let chatModel;
let embeddings;
let hfClient;
function getChat() {
  if (!chatModel) chatModel = new ChatOpenAI({ apiKey: env.OPENAI_API_KEY, model: env.OPENAI_CHAT_MODEL, temperature: 0.15, maxTokens: env.AI_MAX_OUTPUT_TOKENS, timeout: 30000, maxRetries: 2 });
  return chatModel;
}
function getEmbeddings() {
  if (!embeddings) embeddings = new OpenAIEmbeddings({ apiKey: env.OPENAI_API_KEY, model: env.OPENAI_EMBEDDING_MODEL });
  return embeddings;
}
function getHfClient() {
  if (!hfClient) hfClient = new InferenceClient(env.HF_TOKEN);
  return hfClient;
}
export async function invokeLLM(prompt) {
  if (env.AI_PROVIDER === 'openai') {
    if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai');
    const chain = ChatPromptTemplate.fromMessages([['system', SYSTEM_LEGAL_SAFETY], ['human', '{input}']]).pipe(getChat()).pipe(new StringOutputParser());
    return chain.invoke({ input: prompt });
  }
  if (env.AI_PROVIDER === 'huggingface') {
    if (!env.HF_TOKEN) throw new Error('HF_TOKEN is required when AI_PROVIDER=huggingface. Create a fine-grained token with “Make calls to Inference Providers” permission.');
    const completion = await getHfClient().chatCompletion({ model: env.HF_CHAT_MODEL, messages: [{ role: 'system', content: SYSTEM_LEGAL_SAFETY }, { role: 'user', content: prompt }], temperature: 0.15, max_tokens: env.AI_MAX_OUTPUT_TOKENS });
    const content = completion?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error('Hugging Face returned an empty chat response.');
    return content;
  }
  return null;
}
export async function embedText(text) {
  if (env.AI_PROVIDER === 'openai') {
    if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai');
    return getEmbeddings().embedQuery(text);
  }
  if (env.AI_PROVIDER === 'huggingface') {
    if (!env.HF_TOKEN) throw new Error('HF_TOKEN is required when AI_PROVIDER=huggingface.');
    const vector = await getHfClient().featureExtraction({ model: env.HF_EMBEDDING_MODEL, inputs: text, normalize: true });
    if (!Array.isArray(vector) || !vector.length || !vector.every(Number.isFinite)) throw new Error('Hugging Face returned an invalid embedding vector.');
    return vector;
  }
  return mockEmbedding(text);
}
export function embeddingModelName() {
  if (env.AI_PROVIDER === 'openai') return env.OPENAI_EMBEDDING_MODEL;
  if (env.AI_PROVIDER === 'huggingface') return env.HF_EMBEDDING_MODEL;
  return 'mock-256';
}
export function providerInfo() { return { provider: env.AI_PROVIDER, model: env.AI_PROVIDER === 'openai' ? env.OPENAI_CHAT_MODEL : env.AI_PROVIDER === 'huggingface' ? env.HF_CHAT_MODEL : 'deterministic-demo' }; }
