import { AIUsage } from '../models/AIUsage.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export async function assertDailyAIQuota(userId) {
  const since = new Date(); since.setHours(0,0,0,0);
  const count = await AIUsage.countDocuments({ userId, createdAt: { $gte: since }, status: 'success' });
  if (count >= env.AI_DAILY_USER_REQUEST_LIMIT) throw new ApiError(429, 'Daily AI request quota reached. Try again tomorrow or ask an administrator to raise the limit.', 'AI_QUOTA_EXCEEDED');
}
export async function recordAIUsage({ userId, operation, provider, model, inputChars, outputText = '', latencyMs, status = 'success', cached = false }) {
  try {
    await AIUsage.create({ userId, operation, provider, model, inputChars, estimatedInputTokens: Math.ceil(inputChars / 4), estimatedOutputTokens: Math.ceil(String(outputText).length / 4), latencyMs, status, cached });
  } catch { /* usage logging is non-blocking */ }
}
