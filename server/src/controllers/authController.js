import { User } from '../models/User.js';
import { env, clientOrigins } from '../config/env.js';
import { randomToken, sha256 } from '../utils/crypto.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/response.js';
import { signAccessToken, createRefreshSession, verifyRefreshToken, revokeSession, revokeAllSessions } from '../services/tokenService.js';
import { sendMail } from '../services/mailService.js';
import { audit } from '../services/auditService.js';

const refreshCookie = token => ({ value: token, options: { httpOnly: true, secure: env.COOKIE_SECURE || env.NODE_ENV === 'production', sameSite: env.COOKIE_SAME_SITE, path: '/api/v1/auth', maxAge: env.REFRESH_TOKEN_TTL_DAYS * 86400000 } });
const publicUser = u => ({ id: u._id, name: u.name, email: u.email, role: u.role, verified: u.verified, locale: u.locale, preferences: u.preferences });

export async function register(req, res) {
  if (await User.exists({ email: req.body.email })) throw new ApiError(409, 'An account with this email already exists.', 'EMAIL_IN_USE');
  const user = new User({ name: req.body.name, email: req.body.email, passwordHash: await User.hashPassword(req.body.password), locale: req.body.locale || 'en', verified: !env.REQUIRE_EMAIL_VERIFICATION });
  let devVerificationLink;
  if (env.REQUIRE_EMAIL_VERIFICATION) {
    const raw = randomToken(); user.verificationTokenHash = sha256(raw); user.verificationExpiresAt = new Date(Date.now() + 24*3600000);
    const link = `${clientOrigins[0]}/verify-email?token=${raw}`; devVerificationLink = link;
    await sendMail({ to: user.email, subject: 'Verify your LexSahayak AI email', text: `Verify your account: ${link}` });
  }
  await user.save();
  await audit({ userId: user._id, action: 'REGISTER', resourceType: 'user', resourceId: user._id, ip: req.ip });
  if (env.REQUIRE_EMAIL_VERIFICATION) {
    return ok(res, { user: publicUser(user), verificationRequired: true, ...(env.NODE_ENV !== 'production' && devVerificationLink ? { devVerificationLink } : {}) }, 'Account created. Verify your email before signing in.', 201);
  }
  const { token: refresh } = await createRefreshSession(user, { ip: req.ip, userAgent: req.headers['user-agent'] || '' });
  const cookie = refreshCookie(refresh); res.cookie('ls_refresh', cookie.value, cookie.options);
  return ok(res, { user: publicUser(user), accessToken: signAccessToken(user), verificationRequired: false }, 'Account created', 201);
}
export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email }).select('+passwordHash');
  if (!user || !(await user.comparePassword(req.body.password))) { await audit({ userId: user?._id, action: 'LOGIN', result: 'failure', ip: req.ip }); throw new ApiError(401, 'Email or password is incorrect.', 'INVALID_CREDENTIALS'); }
  if (!user.isActive) throw new ApiError(403, 'This account is disabled.', 'ACCOUNT_DISABLED');
  if (env.REQUIRE_EMAIL_VERIFICATION && !user.verified) throw new ApiError(403, 'Please verify your email before signing in.', 'EMAIL_NOT_VERIFIED');
  user.lastLoginAt = new Date(); await user.save();
  const { token: refresh } = await createRefreshSession(user, { ip: req.ip, userAgent: req.headers['user-agent'] || '' });
  const cookie = refreshCookie(refresh); res.cookie('ls_refresh', cookie.value, cookie.options);
  await audit({ userId: user._id, action: 'LOGIN', ip: req.ip });
  return ok(res, { user: publicUser(user), accessToken: signAccessToken(user) }, 'Signed in');
}
export async function refresh(req, res) {
  const token = req.cookies?.ls_refresh;
  if (!token) throw new ApiError(401, 'Refresh session is missing.', 'SESSION_REQUIRED');
  let verified;
  try { verified = await verifyRefreshToken(token); } catch { throw new ApiError(401, 'Refresh session is invalid or expired.', 'SESSION_INVALID'); }
  const user = await User.findById(verified.payload.sub);
  if (!user || !user.isActive) throw new ApiError(401, 'Account is unavailable.', 'ACCOUNT_UNAVAILABLE');
  if (env.REQUIRE_EMAIL_VERIFICATION && !user.verified) throw new ApiError(403, 'Please verify your email before continuing.', 'EMAIL_NOT_VERIFIED');
  await revokeSession(verified.session._id);
  const { token: rotatedRefresh } = await createRefreshSession(user, { ip: req.ip, userAgent: req.headers['user-agent'] || '' });
  const cookie = refreshCookie(rotatedRefresh); res.cookie('ls_refresh', cookie.value, cookie.options);
  return ok(res, { user: publicUser(user), accessToken: signAccessToken(user) }, 'Session refreshed');
}
export async function logout(req, res) {
  const token = req.cookies?.ls_refresh;
  let logoutUserId;
  if (token) { try { const { session, payload } = await verifyRefreshToken(token); logoutUserId = payload.sub; await revokeSession(session._id); } catch { /* already invalid */ } }
  res.clearCookie('ls_refresh', { path: '/api/v1/auth', httpOnly: true, secure: env.COOKIE_SECURE || env.NODE_ENV === 'production', sameSite: env.COOKIE_SAME_SITE });
  if (logoutUserId) await audit({ userId: logoutUserId, action: 'LOGOUT', ip: req.ip });
  return ok(res, {}, 'Signed out');
}
export async function me(req, res) { return ok(res, { user: publicUser(req.user) }); }
export async function verifyEmail(req, res) {
  const user = await User.findOne({ verificationTokenHash: sha256(req.body.token), verificationExpiresAt: { $gt: new Date() } }).select('+verificationTokenHash +verificationExpiresAt');
  if (!user) throw new ApiError(400, 'Verification token is invalid or expired.', 'VERIFY_TOKEN_INVALID');
  user.verified = true; user.verificationTokenHash = undefined; user.verificationExpiresAt = undefined; await user.save();
  await audit({ userId: user._id, action: 'EMAIL_VERIFIED', ip: req.ip }); return ok(res, {}, 'Email verified');
}
export async function forgotPassword(req, res) {
  const user = await User.findOne({ email: req.body.email }).select('+resetTokenHash +resetExpiresAt');
  let devResetLink;
  if (user) {
    const raw = randomToken(); user.resetTokenHash = sha256(raw); user.resetExpiresAt = new Date(Date.now() + 30*60000); await user.save();
    const link = `${clientOrigins[0]}/reset-password?token=${raw}`; devResetLink = link;
    await sendMail({ to: user.email, subject: 'Reset your LexSahayak AI password', text: `Reset your password within 30 minutes: ${link}` });
  }
  return ok(res, { ...(env.NODE_ENV !== 'production' && devResetLink ? { devResetLink } : {}) }, 'If an account exists, password-reset instructions have been sent.');
}
export async function resetPassword(req, res) {
  const user = await User.findOne({ resetTokenHash: sha256(req.body.token), resetExpiresAt: { $gt: new Date() } }).select('+resetTokenHash +resetExpiresAt');
  if (!user) throw new ApiError(400, 'Reset token is invalid or expired.', 'RESET_TOKEN_INVALID');
  user.passwordHash = await User.hashPassword(req.body.password); user.resetTokenHash = undefined; user.resetExpiresAt = undefined; await user.save();
  await revokeAllSessions(user._id); await audit({ userId: user._id, action: 'PASSWORD_RESET', ip: req.ip });
  return ok(res, {}, 'Password reset successfully. Please sign in again.');
}
export async function updatePreferences(req, res) {
  const allowed = {};
  if (typeof req.body.redactPIIForAI === 'boolean') allowed['preferences.redactPIIForAI'] = req.body.redactPIIForAI;
  if (['light','dark','system'].includes(req.body.theme)) allowed['preferences.theme'] = req.body.theme;
  if (['en','hi'].includes(req.body.locale)) allowed.locale = req.body.locale;
  const user = await User.findByIdAndUpdate(req.user._id, { $set: allowed }, { new: true });
  return ok(res, { user: publicUser(user) }, 'Preferences updated');
}
