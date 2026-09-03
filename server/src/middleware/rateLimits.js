import { rateLimit } from 'express-rate-limit';
const base = { standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many requests. Please try again later.', errorCode: 'RATE_LIMITED' } };
export const authLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, limit: 30 });
export const sensitiveAuthLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, limit: 10 });
export const aiLimiter = rateLimit({ ...base, windowMs: 60 * 1000, limit: 12 });
export const uploadLimiter = rateLimit({ ...base, windowMs: 10 * 60 * 1000, limit: 20 });
