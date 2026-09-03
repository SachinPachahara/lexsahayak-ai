import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { dashboard } from '../controllers/dashboardController.js';
const r=Router();r.get('/',requireAuth,asyncHandler(dashboard));export default r;
