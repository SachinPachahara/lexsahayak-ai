import { diffLines } from 'diff';
import { LegalDocument } from '../models/LegalDocument.js';
import { DocumentVersion } from '../models/DocumentVersion.js';
import { AnalysisResult } from '../models/AnalysisResult.js';
import { ShareLink } from '../models/ShareLink.js';
import { VectorChunk } from '../models/VectorChunk.js';
import { Conversation } from '../models/Conversation.js';
import { contentHash, decryptText } from '../utils/crypto.js';
import { ApiError } from '../utils/ApiError.js';
import { indexText } from './ragService.js';
import { normalizeAnalysis } from '../utils/normalizeAnalysis.js';

export async function getOwnedDocument(documentId, userId) {
  const doc = await LegalDocument.findOne({ _id: documentId, ownerId: userId });
  if (!doc) throw new ApiError(404, 'Document not found', 'DOCUMENT_NOT_FOUND');
  return doc;
}
export async function createDocument({ ownerId, title, documentType, source, content, structuredData={}, sourceFileName, language='en' }) {
  const doc = await LegalDocument.create({ ownerId, title, documentType, source, content, structuredData, sourceFileName, language });
  await DocumentVersion.create({ documentId: doc._id, ownerId, version: 1, content, structuredData, contentHash: contentHash(content), changeNote: 'Initial version' });
  await indexText({ scope: 'document', text: content, ownerId, documentId: doc._id, citation: `${title} (user document)` });
  return doc;
}
export async function saveVersion({ documentId, ownerId, content, structuredData={}, changeNote='Edited document' }) {
  const doc = await getOwnedDocument(documentId, ownerId);
  if (content === doc.content) return doc;
  const version = doc.currentVersion + 1;
  await DocumentVersion.create({ documentId, ownerId, version, content, structuredData, contentHash: contentHash(content), changeNote });
  doc.content = content; doc.structuredData = structuredData; doc.currentVersion = version; await doc.save();
  await indexText({ scope: 'document', text: content, ownerId, documentId, citation: `${doc.title} (version ${version})` });
  return doc;
}
export async function compareVersions({ documentId, ownerId, fromVersion, toVersion }) {
  await getOwnedDocument(documentId, ownerId);
  const versions = await DocumentVersion.find({ documentId, version: { $in: [fromVersion, toVersion] } }).lean();
  const a = versions.find(v => v.version === fromVersion), b = versions.find(v => v.version === toVersion);
  if (!a || !b) throw new ApiError(404, 'One or both versions were not found', 'VERSION_NOT_FOUND');
  const contentA = decryptText(a.content);
  const contentB = decryptText(b.content);
  return { from: { ...a, content: contentA }, to: { ...b, content: contentB }, changes: diffLines(contentA, contentB).map(p => ({ added: !!p.added, removed: !!p.removed, value: p.value })) };
}
export async function attachAnalysis(documentId, ownerId, analysisData) {
  const doc = await getOwnedDocument(documentId, ownerId);
  const normalizedAnalysis = normalizeAnalysis(analysisData);
  const analysis = await AnalysisResult.findOneAndUpdate(
    { documentId },
    { $set: { ...normalizedAnalysis, ownerId, documentId } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  doc.analysisId = analysis._id; await doc.save();
  return analysis;
}

export async function deleteOwnedDocument(documentId, ownerId) {
  const doc = await getOwnedDocument(documentId, ownerId);
  const filter = { documentId: doc._id };
  const [versions, analyses, vectors, shareLinks, conversations] = await Promise.all([
    DocumentVersion.deleteMany(filter),
    AnalysisResult.deleteMany(filter),
    VectorChunk.deleteMany({ ...filter, scope: 'document' }),
    ShareLink.deleteMany(filter),
    Conversation.deleteMany({ ...filter, ownerId })
  ]);
  await LegalDocument.deleteOne({ _id: doc._id, ownerId });
  return {
    document: doc,
    cleanup: {
      versions: versions.deletedCount,
      analyses: analyses.deletedCount,
      vectorChunks: vectors.deletedCount,
      shareLinks: shareLinks.deletedCount,
      conversations: conversations.deletedCount
    }
  };
}
