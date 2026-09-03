import mongoose from 'mongoose';
import { VectorChunk } from '../models/VectorChunk.js';
import { KnowledgeSource } from '../models/KnowledgeSource.js';
import { env } from '../config/env.js';
import { chunkText } from '../utils/chunkText.js';
import { cosineSimilarity } from '../utils/vector.js';
import { embedText, embeddingModelName } from './aiProvider.js';
import { ApiError } from '../utils/ApiError.js';

export async function indexText({ scope, text, ownerId, documentId, sourceId, citation }) {
  const chunks = chunkText(text);
  if (!chunks.length) return 0;
  if (documentId) await VectorChunk.deleteMany({ documentId });
  if (sourceId) await VectorChunk.deleteMany({ sourceId });
  const docs = [];
  for (let i = 0; i < chunks.length; i += 1) {
    const embedding = await embedText(chunks[i]);
    docs.push({ scope, ownerId: scope === 'document' ? ownerId : undefined, documentId, sourceId, chunkIndex: i, text: chunks[i], embedding, embeddingModel: embeddingModelName(), citation });
  }
  await VectorChunk.insertMany(docs);
  return docs.length;
}

async function localRetrieve({ queryEmbedding, filter, k }) {
  const candidates = await VectorChunk.find(filter).select('+embedding').limit(500).lean();
  return candidates.map(c => ({ ...c, score: cosineSimilarity(queryEmbedding, c.embedding || []) })).sort((a,b) => b.score - a.score).slice(0,k);
}
async function atlasRetrieve({ queryEmbedding, filter, k }) {
  const mongoFilter = {};
  if (filter.scope) mongoFilter.scope = filter.scope;
  if (filter.ownerId) mongoFilter.ownerId = new mongoose.Types.ObjectId(filter.ownerId);
  if (filter.documentId) mongoFilter.documentId = new mongoose.Types.ObjectId(filter.documentId);
  const pipeline = [
    { $vectorSearch: { index: env.ATLAS_VECTOR_INDEX, path: 'embedding', queryVector: queryEmbedding, numCandidates: Math.max(50, k * 15), limit: k, filter: mongoFilter } },
    { $project: { text: 1, citation: 1, sourceId: 1, documentId: 1, metadata: 1, score: { $meta: 'vectorSearchScore' } } }
  ];
  return VectorChunk.aggregate(pipeline);
}
export async function retrieve({ query, userId, documentId, includeGlobal = true, k = 5 }) {
  const queryEmbedding = await embedText(query);
  let results = [];
  const getter = env.VECTOR_SEARCH_MODE === 'atlas' ? atlasRetrieve : localRetrieve;
  if (documentId) results.push(...await getter({ queryEmbedding, filter: { scope: 'document', ownerId: userId, documentId }, k }));
  if (includeGlobal) results.push(...await getter({ queryEmbedding, filter: { scope: 'global' }, k }));
  return results.sort((a,b) => b.score - a.score).slice(0,k);
}
export function formatContext(chunks = []) {
  return chunks.map((c, i) => `[S${i+1}] ${c.citation || c.metadata?.title || 'Retrieved source'}\n${c.text}`).join('\n\n');
}
export function citationsFromChunks(chunks = []) {
  return chunks.map((c, i) => ({ label: `S${i+1}`, sourceId: c.sourceId ? String(c.sourceId) : undefined, chunkId: String(c._id), citation: c.citation, excerpt: c.text.slice(0, 320), score: Number((c.score || 0).toFixed(3)) }));
}
export async function removeKnowledgeSource(sourceId) {
  await VectorChunk.deleteMany({ sourceId });
  await KnowledgeSource.findByIdAndDelete(sourceId);
}
export function ensureGrounded(chunks) {
  if (!chunks?.length) throw new ApiError(422, 'No relevant authorized source context was found for this question.', 'NO_RETRIEVAL_CONTEXT');
}
