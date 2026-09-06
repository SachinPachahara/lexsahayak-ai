import { describe, expect, it } from 'vitest';
import { AIUsage } from '../src/models/AIUsage.js';

describe('AI-usage retention', () => {
  it('creates a 12-month TTL index on usage timestamps', () => {
    const retentionIndex = AIUsage.schema.indexes().find(([, options]) => options.name === 'ai_usage_retention_12_months');
    expect(retentionIndex).toBeDefined();
    expect(retentionIndex[0]).toEqual({ createdAt: 1 });
    expect(retentionIndex[1].expireAfterSeconds).toBe(60 * 60 * 24 * 365);
  });
});
