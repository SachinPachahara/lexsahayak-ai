import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { publicShareSchema } from '../validators/documentSchemas.js';
import { publicShared } from '../controllers/documentController.js';
const r=Router();r.get('/share/:token',validate(publicShareSchema),asyncHandler(publicShared));export default r;
