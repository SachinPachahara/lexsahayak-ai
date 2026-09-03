import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalDocument', required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  version: { type: Number, required: true },
  content: { type: String, required: true, maxlength: 250000 },
  structuredData: { type: mongoose.Schema.Types.Mixed, default: {} },
  contentHash: { type: String, required: true },
  changeNote: { type: String, maxlength: 240, default: 'Saved version' }
}, { timestamps: true });
schema.index({ documentId: 1, version: 1 }, { unique: true });
export const DocumentVersion = mongoose.model('DocumentVersion', schema);
