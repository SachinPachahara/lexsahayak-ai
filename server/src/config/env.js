import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/lexsahayak'),
  CLIENT_ORIGINS: z.string().default('http://localhost:5173'),
  JWT_ACCESS_SECRET: z.string().min(16).default('development-access-secret-change-me-123456'),
  JWT_REFRESH_SECRET: z.string().min(16).default('development-refresh-secret-change-me-12345'),
  DOCUMENT_ENCRYPTION_SECRET: z.string().min(16).default('lexsahayak-doc-enc-secret-change-me-32b!'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  COOKIE_SECURE: z.string().default(process.env.NODE_ENV === 'production' ? 'true' : 'false').transform(v => v === 'true'),
  COOKIE_SAME_SITE: z.enum(['lax','strict','none']).default(process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
  AI_PROVIDER: z.enum(['mock', 'openai', 'huggingface']).default('mock'),
  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_CHAT_MODEL: z.string().default('gpt-5.6-terra'),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  HF_TOKEN: z.string().optional().default(''),
  HF_CHAT_MODEL: z.string().default('Qwen/Qwen3-4B-Instruct-2507'),
  HF_EMBEDDING_MODEL: z.string().default('thenlper/gte-large'),
  AI_MAX_INPUT_CHARS: z.coerce.number().int().default(45000),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().int().default(1800),
  AI_DAILY_USER_REQUEST_LIMIT: z.coerce.number().int().default(80),
  KB_MIN_RELEVANCE_SCORE: z.coerce.number().min(0).max(1).default(0.25),
  VECTOR_SEARCH_MODE: z.enum(['local', 'atlas']).default('local'),
  ATLAS_VECTOR_INDEX: z.string().default('legal_vector_index'),
  MAIL_MODE: z.enum(['console', 'smtp']).default('console'),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().default('LexSahayak AI <no-reply@example.com>'),
  REQUIRE_EMAIL_VERIFICATION: z.string().default('false').transform(v => v === 'true'),
  MAX_UPLOAD_MB: z.coerce.number().int().min(1).max(20).default(8),
  OCR_MAX_PAGES: z.coerce.number().int().min(1).max(20).default(5),
  OCR_LANGUAGE: z.string().trim().min(2).max(20).default('eng'),
  SEED_ADMIN_EMAIL: z.string().email().default('admin@lexsahayak.local'),
  SEED_ADMIN_PASSWORD: z.string().min(12).default('Admin123!ChangeMe')
});

export const env = schema.parse(process.env);
export const clientOrigins = env.CLIENT_ORIGINS.split(',').map(v => v.trim().replace(/\/+$/, '')).filter(Boolean);
