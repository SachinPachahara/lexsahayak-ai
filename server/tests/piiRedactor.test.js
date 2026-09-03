import { describe,it,expect } from 'vitest';
import { redactIndianPII } from '../src/utils/piiRedactor.js';
describe('PII redactor',()=>{it('redacts common Indian identifiers',()=>{const r=redactIndianPII('Mail govind@example.com, phone +91 9876543210, PAN ABCDE1234F, Aadhaar 1234 5678 9012');expect(r.text).not.toContain('govind@example.com');expect(r.text).not.toContain('9876543210');expect(r.text).not.toContain('ABCDE1234F');expect(r.text).toContain('[REDACTED_AADHAAR_1]');});});
