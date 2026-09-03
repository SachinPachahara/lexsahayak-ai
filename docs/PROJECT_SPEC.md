# Project Specification

## Problem statement

Legal documents are difficult for non-specialists to draft, understand, compare and organize. Generic LLM chat interfaces can produce fluent text but do not by themselves provide document ownership controls, source-grounded retrieval, version evidence, structured workflows, auditability or cost/privacy controls. LexSahayak AI addresses this as a secure document-lifecycle product rather than a standalone chatbot.

## Objectives

1. Provide guided legal-document drafting through structured templates.
2. Securely ingest PDF/DOCX/TXT and normalize extractable text.
3. Provide AI-assisted summaries, clause review, risks, obligations, dates and monetary terms.
4. Answer document questions using owner-scoped RAG with source snippets/citations.
5. Preserve revision history and integrity hashes.
6. Export usable PDF/DOCX outputs and support safe temporary sharing.
7. Demonstrate production-oriented authentication, authorization, privacy, logging, testing and deployment practices.
8. Keep the AI provider replaceable so the product can run in an offline/demo configuration and a real external-LLM configuration.

## Functional requirements

- user registration/login/logout/refresh
- optional email verification and password reset
- user/admin/legal-professional roles
- legal template browser and structured form generation
- upload + text extraction
- document list/search/filter/pagination
- editor + version saving
- version comparison
- structured AI analysis
- clause explanation/improvement
- private document chat
- global legal-knowledge chat
- citations/grounding confidence
- PDF/DOCX export
- expiring read-only share links
- preferences including AI PII masking
- admin users/roles/status
- admin knowledge source ingestion/removal
- admin audit and AI usage visibility
- health/OpenAPI endpoints

## Non-functional requirements

### Security
Backend-enforced authorization, bcrypt passwords, short access tokens, rotating refresh sessions, allowlisted CORS, secure headers, validation, rate limits, safe errors, upload controls, prompt-injection boundaries and secret isolation.

### Reliability
Centralized errors, deterministic demo provider, explicit health status, database indexes, bounded file/request size, retries/timeouts at the external AI provider, and graceful process shutdown.

### Performance
Pagination, query indexes, frontend route/component decomposition, bounded retrieval candidates, compact RAG context and optional Atlas Vector Search for larger deployments.

### Accessibility and UX
Semantic controls/labels, keyboard-reachable actions, visible focus styling through browser/Tailwind behavior, responsive navigation, mobile tables/overflow handling, loading states, empty states and actionable errors.

### Maintainability
Separate controllers/services/models/middleware/validators, provider abstraction, environment configuration, tests, CI and modular React pages/components.

## Roles

### User
Owns documents, drafts/uploads/analyzes/chats/versions/exports/shares and controls privacy preferences.

### Legal professional
Currently receives the same document workspace capabilities as a user, with the role available for future review/approval workflows. It is intentionally not granted implicit access to other users' documents.

### Admin
Manages users, shared knowledge sources, system metrics, audit logs and AI usage. Admin APIs are protected by backend role middleware.

## Differentiating product features

- Privacy Shield for external inference
- private RAG retrieval authorization
- version SHA-256 integrity evidence
- retrieved citations + confidence/limitations
- expiring hashed share tokens
- deterministic zero-key demo provider
- real LangChain provider behind the same service interface
- AI quotas/telemetry
- source governance through the admin knowledge base

## Out of scope for this build

- lawyer-client relationship or legal representation
- autonomous filing in courts/government systems
- authoritative case-law database bundled in the repository
- payment/subscription billing
- OCR for scanned image-only PDFs
- digital signatures/e-stamping
- arbitrary LLM tool execution
- production malware scanning service

These are explicit scope decisions, not hidden missing features.
