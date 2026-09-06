import { describe, expect, it } from 'vitest';
import { encryptText, decryptText } from '../src/utils/crypto.js';

describe('AES-256-GCM field-level encryption', () => {
  it('encrypts plain text and decrypts back to original', () => {
    const sample = 'CONFIDENTIAL: Rental Agreement between Landlord and Tenant for Sector 62 Noida.';
    const encrypted = encryptText(sample);

    expect(encrypted).not.toBe(sample);
    expect(encrypted).toMatch(/^enc:v1:[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/);

    const decrypted = decryptText(encrypted);
    expect(decrypted).toBe(sample);
  });

  it('prevents double encryption if string already encrypted', () => {
    const sample = 'Arbitration clause under Indian Arbitration Act';
    const encrypted1 = encryptText(sample);
    const encrypted2 = encryptText(encrypted1);

    expect(encrypted2).toBe(encrypted1);
  });

  it('returns unencrypted text unchanged for backward compatibility', () => {
    const legacyPlain = 'Legacy plain document stored before encryption was enabled.';
    const decrypted = decryptText(legacyPlain);

    expect(decrypted).toBe(legacyPlain);
  });

  it('handles empty, null, or undefined values gracefully', () => {
    expect(encryptText('')).toBe('');
    expect(encryptText(null)).toBe(null);
    expect(encryptText(undefined)).toBe(undefined);

    expect(decryptText('')).toBe('');
    expect(decryptText(null)).toBe(null);
    expect(decryptText(undefined)).toBe(undefined);
  });

  it('fails gracefully if ciphertext auth tag or data is tampered with', () => {
    const sample = 'Security deposit of INR 50,000 payable upon handover.';
    const encrypted = encryptText(sample);
    const parts = encrypted.split(':');
    // Tamper with encrypted bytes
    parts[4] = '00' + parts[4].slice(2);
    const tampered = parts.join(':');

    // Should return unchanged or fail safely rather than crashing
    expect(decryptText(tampered)).toBe(tampered);
  });
});
