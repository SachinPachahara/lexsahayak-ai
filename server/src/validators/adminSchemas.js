import { z } from 'zod';
import { objectId } from './documentSchemas.js';

export const adminUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    q: z.string().trim().max(100).optional()
  })
});

export const adminUserUpdateSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    role: z.enum(['user','legal_professional','admin']).optional(),
    isActive: z.boolean().optional()
  }).refine(v => v.role !== undefined || v.isActive !== undefined, { message: 'Provide role or isActive.' })
});

export const adminIdSchema = z.object({ params: z.object({ id: objectId }) });

export const auditQuerySchema = z.object({ query: z.object({ limit: z.coerce.number().int().min(1).max(100).default(50) }) });
