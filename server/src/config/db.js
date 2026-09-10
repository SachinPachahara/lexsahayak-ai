import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';
import { AuditLog } from '../models/AuditLog.js';
import { AIUsage } from '../models/AIUsage.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  logger.info('MongoDB connected');
  AuditLog.createIndexes().catch(err => logger.warn({ err: err.message }, 'AuditLog index sync notice'));
  AIUsage.createIndexes().catch(err => logger.warn({ err: err.message }, 'AIUsage index sync notice'));
}

export function isDbReady() {
  return mongoose.connection.readyState === 1;
}
