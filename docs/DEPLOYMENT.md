# Deployment Guide

This repository is ready to configure for deployment; infrastructure accounts and secrets are intentionally not embedded.

## Recommended simple architecture

```text
Browser
  -> Vercel (React build)
  -> Render/Railway/Fly.io (Express API)
      -> MongoDB Atlas
      -> OpenAI API
      -> SMTP provider
```

## 1. MongoDB Atlas

1. Create a production cluster.
2. Create a least-privilege database user with a long random password.
3. Configure network access for your API host rather than unrestricted access where your host supports stable egress.
4. Copy the SRV URI to the API host as `MONGODB_URI`.
5. Configure backups appropriate for your deployment tier.
6. If using Atlas Vector Search, create the index expected by `ATLAS_VECTOR_INDEX` over `vectorchunks.embedding` with dimensions matching your embedding model.

Do not commit the URI to Git.

## 2. Backend host

Use repository root `server` as the service directory or configure commands explicitly:

```text
Build: npm install
Start: npm start
```

Required production variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=...
CLIENT_ORIGINS=https://your-frontend.example
JWT_ACCESS_SECRET=<long random secret>
JWT_REFRESH_SECRET=<different long random secret>
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
AI_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_CHAT_MODEL=gpt-5.6-terra
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
VECTOR_SEARCH_MODE=local
MAIL_MODE=smtp
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=...
REQUIRE_EMAIL_VERIFICATION=true
SEED_ADMIN_EMAIL=<your admin email>
SEED_ADMIN_PASSWORD=<do not keep default>
```

Set `CLIENT_ORIGINS` to a comma-separated allowlist if you have preview/admin origins. Do not use `*` for credentialed production requests.

Run the seed only when intentionally creating/updating your demo/admin seed records. Do not expose default seed credentials.

Health probe:

```text
GET /api/v1/health
```

## 3. Frontend host

Set project root to `client`.

```text
Build: npm install && npm run build
Output: dist
```

Set:

```env
VITE_API_URL=https://your-api.example/api/v1
```

For SPA hosting, route unknown frontend paths back to `index.html` so `/app/documents/...`, reset and share UI routes work on direct refresh.

## 4. CORS/cookies

- API must be HTTPS in production.
- `COOKIE_SECURE=true`.
- Frontend origin must exactly appear in `CLIENT_ORIGINS`.
- Frontend fetches include credentials for refresh-cookie operations (already implemented in the API client).
- Prefer same-site custom subdomains such as `app.example.com` + `api.example.com` and keep `COOKIE_SAME_SITE=lax`. If your frontend/API are truly cross-site (for example unrelated provider domains), set `COOKIE_SAME_SITE=none` with HTTPS/`COOKIE_SECURE=true`; the server still rejects untrusted Origin values through the CORS allowlist. Re-run your CSRF/security tests for that topology.

## 5. Switch from demo AI to production AI

1. Set `AI_PROVIDER=openai` and the API/model variables.
2. Restart the API.
3. **Re-index all knowledge/document chunks created in mock mode.** Demo embeddings and OpenAI embeddings must not be mixed in one similarity index.
4. Test generation, analysis and chat with non-sensitive test documents first.
5. Review AI usage limits/cost telemetry.

## 6. Production smoke test

- health endpoint is 200
- registration/email verification works
- login + refresh after page reload works
- a second test account cannot fetch account 1's document ID
- generate document succeeds
- PDF/DOCX upload succeeds; unsupported file fails
- analysis succeeds and creates an audit/AI usage record
- document chat cites only allowed chunks
- version save/compare succeeds
- PDF/DOCX export downloads
- short-lived share link expires as expected
- non-admin receives 403 on `/admin/*`
- password reset link expires/rejects reuse as expected

## 7. Operational checklist

Before opening to real users:

- change every example secret/password
- curate authoritative legal sources and update ownership/governance
- configure log/error monitoring alerts
- implement backup/restore runbook
- set dependency update policy
- run SAST/dependency audit and DAST against staging
- add external malware scanner if original binary files will be retained
- define privacy/retention/deletion policy
- obtain legal review of product claims/disclaimers
