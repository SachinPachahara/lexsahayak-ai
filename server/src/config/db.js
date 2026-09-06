import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';
import { AuditLog } from '../models/AuditLog.js';
import { AIUsage } from '../models/AIUsage.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  await AuditLog.createIndexes();
  await AIUsage.createIndexes();
  logger.info('MongoDB connected');
}

export function isDbReady() {
  return mongoose.connection.readyState === 1;
}
