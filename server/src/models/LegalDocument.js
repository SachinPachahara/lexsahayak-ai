import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  documentType: { type: String, required: true, index: true },
  source: { type: String, enum: ['generated', 'uploaded', 'manual'], default: 'generated' },
  status: { type: String, enum: ['draft', 'completed', 'archived'], default: 'draft', index: true },
  content: { type: String, required: true, maxlength: 250000 },
  structuredData: { type: mongoose.Schema.Types.Mixed, default: {} },
  currentVersion: { type: Number, default: 1 },
  sourceFileName: String,
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  analysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnalysisResult' },
  lastAccessedAt: Date
}, { timestamps: true });
schema.index({ ownerId: 1, updatedAt: -1 });
schema.index({ ownerId: 1, title: 'text', content: 'text' });
export const LegalDocument = mongoose.model('LegalDocument', schema);
