import { z } from 'zod';
const email = z.string().email().max(160).transform(v => v.toLowerCase().trim());
const password = z.string().min(10).max(128).regex(/[A-Z]/, 'Password needs an uppercase letter').regex(/[a-z]/, 'Password needs a lowercase letter').regex(/[0-9]/, 'Password needs a digit');
export const registerSchema = z.object({ body: z.object({ name: z.string().trim().min(2).max(80), email, password, locale: z.enum(['en','hi']).optional() }) });
export const loginSchema = z.object({ body: z.object({ email, password: z.string().min(1).max(128) }) });
export const emailOnlySchema = z.object({ body: z.object({ email }) });
export const resetPasswordSchema = z.object({ body: z.object({ token: z.string().min(20).max(500), password }) });
export const verifyEmailSchema = z.object({ body: z.object({ token: z.string().min(20).max(500) }) });

export const preferencesSchema = z.object({ body: z.object({ redactPIIForAI: z.boolean().optional(), theme: z.enum(['light','dark','system']).optional(), locale: z.enum(['en','hi']).optional() }).refine(v => Object.keys(v).length > 0, { message: 'Provide at least one preference.' }) });
