import { describe, expect, it } from 'vitest';
import { AuditLog } from '../src/models/AuditLog.js';

describe('audit-log retention', () => {
  it('creates a 12-month TTL index on audit timestamps', () => {
    const retentionIndex = AuditLog.schema.indexes().find(([, options]) => options.name === 'audit_log_retention_12_months');
    expect(retentionIndex).toBeDefined();
    expect(retentionIndex[0]).toEqual({ createdAt: 1 });
    expect(retentionIndex[1].expireAfterSeconds).toBe(60 * 60 * 24 * 365);
  });
});
