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
// MongoDB's TTL monitor automatically removes records after 12 months.
// Deletion is asynchronous (typically within about a minute of expiry).
schema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365, name: 'audit_log_retention_12_months' });
export const AuditLog = mongoose.model('AuditLog', schema);
