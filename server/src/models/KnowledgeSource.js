import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  sourceType: { type: String, enum: ['official', 'uploaded', 'internal'], default: 'uploaded' },
  jurisdiction: { type: String, default: 'India' },
  citation: String,
  sourceUrl: String,
  fileName: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chunkCount: { type: Number, default: 0 },
  status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing', index: true },
  isActive: { type: Boolean, default: true, index: true },
  error: String
}, { timestamps: true });
export const KnowledgeSource = mongoose.model('KnowledgeSource', schema);
