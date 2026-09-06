# Security Architecture and Threat Model

## Security goals

1. A user must not be able to read or modify another user's private legal documents.
2. Admin functionality must be enforced by the API, not merely hidden in the UI.
3. Secrets, credentials and raw security tokens must not leak into client code or logs.
4. Untrusted document text must not become system/tool instructions for the AI.
5. External AI providers should receive the minimum personal data reasonably necessary.
6. Expensive AI endpoints need abuse/cost controls.

## Implemented controls

### Authentication
- bcrypt password hashing
- short-lived signed access JWT
- random refresh secret represented by an httpOnly cookie and server-side session record
- refresh-session revocation on logout
- verification/reset token hashing
- optional email-verification enforcement

### Authorization
- `requireAuth` verifies identity on protected APIs
- `requireRole('admin')` protects admin APIs
- document service performs owner checks before read/update/analyze/export/version operations
- RAG source filtering scopes chunks to the authenticated owner/document before model context creation

### HTTP / API
- Helmet security headers
- `x-powered-by` disabled
- explicit CORS origin allowlist
- JSON/body size limits
- separate authentication, AI and upload rate limits
- Zod schema validation on core input surfaces
- recursive NoSQL-key guard
- centralized safe errors

### File handling
- maximum upload size
- explicit supported document types
- MIME + signature/magic-byte verification where practical
- sanitized filenames
- in-memory processing
- no execution of uploaded content

### AI
- no frontend AI credentials
- prompt templates mark retrieved/user document text as untrusted data
- no arbitrary shell/tool executor exists
- request quota + input/output limits
- optional PII masking before external calls
- retrieved source citations returned to UI
- usage/failure events recorded for review

### Data/privacy
- `.env` is ignored
- Field-level AES-256-GCM encryption at rest for `LegalDocument.content`, `DocumentVersion.content`, and `VectorChunk.text` using authenticated encryption tags and random 96-bit IVs
- PII masking helper for AI-bound text
- share URLs use random tokens; stored token lookup uses a hash
- version content hashes provide tamper/integrity evidence
- audit logs and AI usage records avoid password/API-key logging and are retained for 12 months through MongoDB TTL indexes

## Basic threat model

| Asset | Threat / attack | Impact | Mitigation in project |
|---|---|---|---|
| User document | IDOR / broken access control | Private document leak | owner checks in service + authenticated routes |
| RAG context | cross-user retrieval | LLM leaks another user's text | owner/document filters before context assembly |
| Password | DB leak | account takeover | bcrypt hash; never store plaintext |
| Refresh token | browser theft/replay | persistent session abuse | httpOnly cookie + server session + revoke/expiry |
| Reset link | DB token theft | password takeover | persisted reset token is hashed and expiring |
| API | credential stuffing | account compromise | auth-specific rate limiting |
| AI endpoint | automated abuse | unbounded cost | AI limiter + daily per-user quota + token limits |
| Uploaded document | disguised/hostile file | parser abuse/server compromise | size/MIME/signature validation; never execute |
| AI prompt | prompt injection in document | unsafe/inaccurate behavior | system prompt treats document instructions as untrusted; no dangerous tools |
| LLM request | personal-data disclosure | privacy loss | Privacy Shield + send only retrieval context when possible |
| Share link | guessed public ID | data disclosure | cryptographically random token + hash + expiry |
| Admin API | role spoofing in React | system compromise | server `requireRole('admin')` |
| Mongo query | NoSQL operator injection | query manipulation | Zod + no-SQL key guard + controlled query construction |
| Server error | stack trace leakage | infrastructure intelligence | centralized safe production response |

## Production hardening still required

No application can become legally/operationally production-ready by code alone. Before public use:

- rotate all JWT/admin/API secrets
- enforce HTTPS and `COOKIE_SECURE=true`
- use least-privilege Atlas user and network rules
- enable `REQUIRE_EMAIL_VERIFICATION=true` with real SMTP
- add a malware-scanning service before retaining raw originals, if raw-file persistence is introduced
- configure centralized log retention/alerting (e.g. hosted observability)
- configure backups and restore drills
- curate an authoritative, licensed, update-managed legal corpus
- conduct dependency/SAST/DAST/security review
- conduct legal/privacy review for the jurisdictions and data processed
- configure CSP according to the actual frontend hosting architecture

## Prompt-injection boundary

RAG content is data, not authority. The model instruction explicitly tells the LLM not to follow commands embedded in uploaded/retrieved text. More importantly, the application does not expose shell execution, arbitrary URL fetches or unrestricted model tools, so a document cannot convert a prompt injection into operating-system command execution through this application.
