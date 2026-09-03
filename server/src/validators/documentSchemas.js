import { z } from 'zod';
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
export const generateSchema = z.object({ body: z.object({ templateId: z.string().min(2).max(80), fields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}), title: z.string().trim().max(180).optional(), language: z.enum(['en','hi']).default('en'), save: z.boolean().default(true) }) });
export const updateDocumentSchema = z.object({ body: z.object({ content: z.string().min(1).max(250000), structuredData: z.record(z.string(), z.any()).default({}), changeNote: z.string().trim().max(240).optional(), title: z.string().trim().min(1).max(180).optional(), status: z.enum(['draft','completed','archived']).optional() }), params: z.object({ id: objectId }) });
export const updateStatusSchema = z.object({ params: z.object({ id: objectId }), body: z.object({ status: z.enum(['draft','completed','archived']) }) });
export const idParamSchema = z.object({ params: z.object({ id: objectId }) });
export const listDocumentsSchema = z.object({ query: z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(20), status: z.enum(['draft','completed','archived']).optional(), q: z.string().trim().max(100).optional(), sort: z.enum(['updated','created','title']).default('updated') }) });
export const clauseSchema = z.object({ body: z.object({ clause: z.string().min(3).max(12000), mode: z.enum(['explain','improve']).default('explain') }) });
export const analyzeSchema = z.object({ params: z.object({ id: objectId }) });
export const chatSchema = z.object({ body: z.object({ question: z.string().min(2).max(6000), documentId: objectId.optional(), conversationId: objectId.optional() }) });
export const compareSchema = z.object({ params: z.object({ id: objectId }), query: z.object({ from: z.coerce.number().int().min(1), to: z.coerce.number().int().min(1) }) });

export const exportSchema = z.object({ params: z.object({ id: objectId, format: z.enum(['pdf','docx']) }) });
export const shareSchema = z.object({ params: z.object({ id: objectId }), body: z.object({ expiresDays: z.coerce.number().int().min(1).max(30).default(7) }) });
export const publicShareSchema = z.object({ params: z.object({ token: z.string().min(20).max(300) }) });
export const conversationListSchema = z.object({ query: z.object({ documentId: objectId.optional() }) });
