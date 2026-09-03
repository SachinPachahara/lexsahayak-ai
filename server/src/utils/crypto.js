import crypto from 'crypto';
export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
export const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');
export const contentHash = value => `sha256:${sha256(value)}`;
