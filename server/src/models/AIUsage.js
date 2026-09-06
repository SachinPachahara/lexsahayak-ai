import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  operation: { type: String, required: true, index: true },
  provider: String,
  model: String,
  inputChars: Number,
  estimatedInputTokens: Number,
  estimatedOutputTokens: Number,
  latencyMs: Number,
  status: { type: String, enum: ['success','failure'], default: 'success' },
  cached: { type: Boolean, default: false }
}, { timestamps: true });
schema.index({ userId: 1, createdAt: -1 });
// Retain operational AI usage metrics for 12 months, then let MongoDB remove them.
schema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365, name: 'ai_usage_retention_12_months' });
export const AIUsage = mongoose.model('AIUsage', schema);
