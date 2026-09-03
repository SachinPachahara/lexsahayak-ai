import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  action: { type: String, required: true, index: true },
  resourceType: String,
  resourceId: String,
  result: { type: String, enum: ['success','failure'], default: 'success' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipHash: String
}, { timestamps: true });
schema.index({ createdAt: -1 });
export const AuditLog = mongoose.model('AuditLog', schema);
