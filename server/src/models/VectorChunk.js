import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  scope: { type: String, enum: ['global', 'document'], required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalDocument', index: true },
  sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeSource', index: true },
  chunkIndex: { type: Number, required: true },
  text: { type: String, required: true, maxlength: 10000 },
  embedding: { type: [Number], select: false },
  embeddingModel: String,
  citation: String,
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
schema.index({ documentId: 1, chunkIndex: 1 });
schema.index({ sourceId: 1, chunkIndex: 1 });
export const VectorChunk = mongoose.model('VectorChunk', schema);
