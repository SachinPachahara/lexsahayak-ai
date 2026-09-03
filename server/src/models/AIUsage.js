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
export const AIUsage = mongoose.model('AIUsage', schema);
