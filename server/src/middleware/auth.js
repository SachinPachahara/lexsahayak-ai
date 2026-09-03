import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const [scheme, token] = String(req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED');
  let payload;
  try { payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { issuer: 'lexsahayak-api', audience: 'lexsahayak-web' }); }
  catch { throw new ApiError(401, 'Access token is invalid or expired', 'TOKEN_INVALID'); }
  if (payload.type !== 'access') throw new ApiError(401, 'Invalid token type', 'TOKEN_INVALID');
  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new ApiError(401, 'Account is unavailable', 'ACCOUNT_UNAVAILABLE');
  if (env.REQUIRE_EMAIL_VERIFICATION && !user.verified) throw new ApiError(403, 'Please verify your email before continuing.', 'EMAIL_NOT_VERIFIED');
  req.user = user;
  next();
});
export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new ApiError(403, 'You do not have permission to perform this action', 'FORBIDDEN'));
  next();
};
