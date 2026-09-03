import mongoose from 'mongoose';
const msgSchema = new mongoose.Schema({
  role: { type: String, enum: ['user','assistant'], required: true },
  content: { type: String, required: true, maxlength: 20000 },
  citations: [{ label: String, sourceId: String, chunkId: String }],
  createdAt: { type: Date, default: Date.now }
}, { _id: true });
const schema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalDocument', index: true },
  title: { type: String, default: 'Legal assistant conversation', maxlength: 120 },
  messages: [msgSchema]
}, { timestamps: true });
export const Conversation = mongoose.model('Conversation', schema);
