import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'legal_professional', 'admin'], default: 'user', index: true },
  verified: { type: Boolean, default: false },
  verificationTokenHash: { type: String, select: false },
  verificationExpiresAt: { type: Date, select: false },
  resetTokenHash: { type: String, select: false },
  resetExpiresAt: { type: Date, select: false },
  locale: { type: String, enum: ['en', 'hi'], default: 'en' },
  preferences: {
    redactPIIForAI: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' }
  },
  lastLoginAt: Date,
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

schema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};
schema.statics.hashPassword = password => bcrypt.hash(password, 12);

export const User = mongoose.model('User', schema);
