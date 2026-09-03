import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalDocument', required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true, select: false },
  expiresAt: Date,
  revokedAt: Date,
  permissions: { type: [String], enum: ['view'], default: ['view'] }
}, { timestamps: true });
export const ShareLink = mongoose.model('ShareLink', schema);
