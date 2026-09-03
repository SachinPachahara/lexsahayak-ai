import { ApiError } from '../utils/ApiError.js';
export const validate = schema => (req, _res, next) => {
  const parsed = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!parsed.success) {
    return next(new ApiError(422, 'Validation failed', 'VALIDATION_ERROR', parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))));
  }
  if (parsed.data.body) req.body = parsed.data.body;
  if (parsed.data.params) Object.assign(req.params, parsed.data.params);
  if (parsed.data.query) Object.defineProperty(req, 'query', { value: parsed.data.query, writable: true, configurable: true, enumerable: true });
  next();
};
