import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export function notFound(req, _res, next) { next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND')); }
export function errorHandler(err, req, res, _next) {
  const known = err instanceof ApiError;
  const uploadTooLarge = err?.name === 'MulterError' && err?.code === 'LIMIT_FILE_SIZE';
  const uploadMalformed = err?.name === 'MulterError' && !uploadTooLarge;
  const status = known ? err.statusCode : (err.code === 11000 ? 409 : uploadTooLarge ? 413 : uploadMalformed ? 400 : 500);
  const message = known ? err.message : (err.code === 11000 ? 'A record with this value already exists.' : uploadTooLarge ? `File exceeds the ${env.MAX_UPLOAD_MB} MB upload limit.` : uploadMalformed ? 'The multipart upload is invalid.' : 'An unexpected server error occurred.');
  const errorCode = known ? err.errorCode : (err.code === 11000 ? 'DUPLICATE_VALUE' : uploadTooLarge ? 'UPLOAD_TOO_LARGE' : uploadMalformed ? 'UPLOAD_INVALID' : 'INTERNAL_ERROR');
  if (status >= 500) logger.error({ err, requestId: req.id }, 'Unhandled request error');
  res.status(status).json({ success: false, message, errorCode, ...(known && err.details ? { details: err.details } : {}), ...(env.NODE_ENV === 'development' && status >= 500 ? { requestId: req.id } : {}) });
}
