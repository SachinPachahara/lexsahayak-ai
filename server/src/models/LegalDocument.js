import mongoose from 'mongoose';
import { encryptText, decryptText } from '../utils/crypto.js';

const schema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  documentType: { type: String, required: true, index: true },
  source: { type: String, enum: ['generated', 'uploaded', 'manual'], default: 'generated' },
  status: { type: String, enum: ['draft', 'completed', 'archived'], default: 'draft', index: true },
  content: {
    type: String,
    required: true,
    maxlength: 600000,
    set: encryptText,
    get: decryptText
  },
  structuredData: { type: mongoose.Schema.Types.Mixed, default: {} },
  currentVersion: { type: Number, default: 1 },
  sourceFileName: String,
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  analysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnalysisResult' },
  lastAccessedAt: Date,
  signatures: [{
    partyName: { type: String, required: true, trim: true },
    partyRole: { type: String, default: 'Signatory' },
    signatureData: { type: String, required: true },
    signedAt: { type: Date, default: Date.now },
    ipHash: String,
    verificationCode: String
  }],
  comments: [{
    id: { type: String, required: true },
    authorName: { type: String, default: 'Reviewer' },
    text: { type: String, required: true, maxlength: 1000 },
    clauseReference: String,
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    createdAt: { type: Date, default: Date.now }
  }],
  milestones: [{
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    date: { type: Date, required: true },
    type: { type: String, enum: ['expiry', 'renewal_notice', 'lock_in', 'payment', 'milestone', 'other'], default: 'expiry' },
    status: { type: String, enum: ['upcoming', 'completed', 'overdue'], default: 'upcoming' },
    notes: { type: String, default: '', maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toObject: { getters: true },
  toJSON: { getters: true }
});
schema.index({ ownerId: 1, updatedAt: -1 });
schema.index({ ownerId: 1, title: 'text' });
export const LegalDocument = mongoose.model('LegalDocument', schema);
