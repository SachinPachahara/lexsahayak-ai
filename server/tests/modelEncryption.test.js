import { describe, expect, it } from 'vitest';
import { LegalDocument } from '../src/models/LegalDocument.js';
import { DocumentVersion } from '../src/models/DocumentVersion.js';
import { VectorChunk } from '../src/models/VectorChunk.js';
import { encryptText, decryptText } from '../src/utils/crypto.js';

describe('Document models encryption at rest', () => {
  it('encrypts content on LegalDocument schema set', () => {
    const raw = 'CONFIDENTIAL CONTRACT: Non-Disclosure Agreement for Project Phoenix.';
    const doc = new LegalDocument({
      ownerId: '507f1f77bcf86cd799439011',
      title: 'NDA Project Phoenix',
      documentType: 'nda',
      content: raw
    });

    // Directly in the schema/document object before getter transform
    const rawInDb = doc.get('content', null, { getters: false });
    expect(rawInDb).toMatch(/^enc:v1:/);
    expect(rawInDb).not.toBe(raw);

    // Through standard getter access
    expect(doc.content).toBe(raw);

    // JSON serialization includes decrypted content via { getters: true }
    const json = doc.toJSON();
    expect(json.content).toBe(raw);
  });

  it('encrypts content on DocumentVersion schema set', () => {
    const raw = 'AMENDMENT: Clause 4 - Termination with 30-day written notice.';
    const version = new DocumentVersion({
      documentId: '507f1f77bcf86cd799439011',
      ownerId: '507f1f77bcf86cd799439012',
      version: 2,
      content: raw,
      contentHash: 'sha256:dummy'
    });

    const rawInDb = version.get('content', null, { getters: false });
    expect(rawInDb).toMatch(/^enc:v1:/);
    expect(version.content).toBe(raw);
  });

  it('encrypts text chunks on VectorChunk schema set', () => {
    const chunkText = 'Excerpt: The lessee agrees to maintain the premises in good condition.';
    const chunk = new VectorChunk({
      scope: 'document',
      chunkIndex: 0,
      text: chunkText
    });

    const rawInDb = chunk.get('text', null, { getters: false });
    expect(rawInDb).toMatch(/^enc:v1:/);
    expect(chunk.text).toBe(chunkText);
  });
});
