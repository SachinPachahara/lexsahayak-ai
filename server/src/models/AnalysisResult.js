import mongoose from 'mongoose';
const riskSchema = new mongoose.Schema({ severity: { type: String, enum: ['low','medium','high'] }, type: String, clause: String, message: String }, { _id: false });
const schema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalDocument', required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  summary: String,
  parties: [{ name: String, role: String }],
  importantDates: [{ label: String, value: String }],
  financialTerms: [{ label: String, value: String }],
  obligations: [{ party: String, obligation: String, due: String }],
  risks: [riskSchema],
  missingClauses: [{ name: String, reason: String, severity: String }],
  contradictions: [{ left: String, right: String, explanation: String }],
  suggestions: [{ title: String, text: String, rationale: String }],
  riskScore: { type: Number, min: 0, max: 100, default: 0 },
  readabilityScore: { type: Number, min: 0, max: 100, default: 0 },
  confidence: { type: Number, min: 0, max: 1, default: 0.5 },
  aiGenerated: { type: Boolean, default: true }
}, { timestamps: true });
export const AnalysisResult = mongoose.model('AnalysisResult', schema);
