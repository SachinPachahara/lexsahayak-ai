import crypto from 'crypto';
import { env } from '../config/env.js';

export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
export const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');
export const contentHash = value => `sha256:${sha256(value)}`;

// Derive a deterministic 32-byte key for AES-256-GCM using scrypt
const ENCRYPTION_SECRET = env.DOCUMENT_ENCRYPTION_SECRET || env.JWT_ACCESS_SECRET || 'fallback-secret-lexsahayak-key-32!';
const KEY = crypto.scryptSync(ENCRYPTION_SECRET, 'lexsahayak-doc-salt-v1', 32);

/**
 * Encrypts arbitrary text using AES-256-GCM authenticated encryption.
 * Output format: enc:v1:<iv_hex>:<tag_hex>:<ciphertext_hex>
 */
export function encryptText(plainText) {
  if (plainText === null || plainText === undefined) return plainText;
  const str = String(plainText);
  if (!str || str.startsWith('enc:v1:')) return str;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(str, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `enc:v1:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts text previously encrypted with encryptText.
 * If text does not start with enc:v1:, returns unchanged for seamless backwards compatibility.
 */
export function decryptText(cipherText) {
  if (!cipherText || typeof cipherText !== 'string' || !cipherText.startsWith('enc:v1:')) {
    return cipherText;
  }

  const parts = cipherText.split(':');
  if (parts.length !== 5) return cipherText;

  try {
    const [, , ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return cipherText;
  }
}

