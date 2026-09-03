import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Session } from '../models/Session.js';
import { randomToken, sha256 } from '../utils/crypto.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role, type: 'access' }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL, issuer: 'lexsahayak-api', audience: 'lexsahayak-web' });
}
export async function createRefreshSession(user, { ip = '', userAgent = '' } = {}) {
  const rawSessionSecret = randomToken(24);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86400000);
  const session = await Session.create({ userId: user._id, tokenHash: sha256(rawSessionSecret), expiresAt, userAgent: userAgent.slice(0, 300), ipHash: ip ? sha256(ip) : undefined });
  const token = jwt.sign({ sub: String(user._id), sid: String(session._id), sec: rawSessionSecret, type: 'refresh' }, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`, issuer: 'lexsahayak-api', audience: 'lexsahayak-web' });
  return { token, session };
}
export async function verifyRefreshToken(token) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, { issuer: 'lexsahayak-api', audience: 'lexsahayak-web' });
  if (payload.type !== 'refresh') throw new Error('Wrong token type');
  const session = await Session.findById(payload.sid).select('+tokenHash');
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.tokenHash !== sha256(payload.sec)) throw new Error('Session invalid');
  return { payload, session };
}
export async function revokeSession(sessionId) { if (sessionId) await Session.findByIdAndUpdate(sessionId, { revokedAt: new Date() }); }
export async function revokeAllSessions(userId) { await Session.updateMany({ userId, revokedAt: null }, { revokedAt: new Date() }); }
