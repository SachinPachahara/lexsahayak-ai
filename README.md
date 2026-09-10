# LexSahayak AI

**AI-Powered Legal Documentation Assistant based on Large Language Models and Retrieval-Augmented Generation**

LexSahayak AI is a production-style B.Tech major project built with the **MERN stack + LangChain.js**. It treats legal-document work as a complete lifecycle: create or upload a document, inspect and explain it, retrieve grounded context, chat with the document, identify risks/obligations, edit and version it, compare revisions, export it, and share a time-limited read-only copy.

> **Important:** LexSahayak AI provides AI-assisted drafting and document information. It is not a law firm, does not provide legal representation, and should not be treated as a substitute for a qualified legal professional or authoritative legal sources.

## Why this is more than a CRUD + chatbot project

- Full MERN product architecture with React Router, reusable layouts/components, API layer, protected routes and responsive SaaS UI.
- Layered Express backend with routes, controllers, services, models, middleware, validators and centralized errors.
- **Indian State-wise Stamp Duty & Registration Engine (`/app/stamp-duty`)**: Accurate statutory rates across 25 Indian States & UTs (A-to-Z) for 13 document types with direct links to official IGRS/SHCIL portals.
- **Digital E-Signature Pad & Verification Audit Trail**: Draw, type, or upload signatures with tamper-evident code (`LX-SIGN-XXXX`), IST timestamp, and dedicated PDF execution box.
- **Smart Curated Indian Clause Library**: 1-click insertion of 8 battle-tested clauses (Arbitration 1996, Force Majeure, IP Assignment, Indemnity Cap, etc.).
- **Contract Milestones & Expiry Tracker**: Proactive tracking of renewal notices, lock-ins, payment milestones, and expiration alerts.
- **Document Review Notes & Team Comments**: Clause-specific revision comments with 1-click Resolve/Reopen tracking.
- **Bilingual Hindi Legal Summary**: 1-click toggle translating complex legal clauses into plain Hindi for non-lawyer Indian clients.
- **Custom Export Watermarks**: Add `DRAFT`, `CONFIDENTIAL`, or `EXECUTED` watermarks to generated PDF and DOCX downloads with zero blank-page overflow.
- LangChain.js provider layer configured for real Hugging Face Inference Providers, with OpenAI and mock-mode fallbacks.
- Private RAG: access control is enforced before document chunks can be retrieved for the model.
- Structured document generation, document analysis, clause lab and source-aware document chat.
- Version history, SHA-256 content integrity hashes and text comparison.
- Privacy Shield masks common email, Indian mobile-number, PAN and Aadhaar-like patterns before external AI calls.
- Expiring, random-token, read-only document share links.
- AI quotas, token/usage records, audit trails, rate limiting and prompt-injection-aware system prompts.
- Admin knowledge-base ingestion and AI usage/security observability.
- Secure PDF/DOCX upload parsing and PDF/DOCX export.
- CI workflow, tests, seed data, health checks and deployment documentation.

## Core capabilities

### Document lifecycle & SaaS features
1. **Draft or Upload**: Select from 10+ standard legal templates or upload PDF/DOCX/TXT files with client-side preview.
2. **Private RAG Ingestion**: Automatically index private chunks for vector retrieval without cross-tenant exposure.
3. **Deep AI Legal Analysis**: Extract executive summary, critical clauses, liability risks, statutory obligations, and tactical recommendations.
4. **Bilingual Hindi Summary**: 1-click toggle translating and explaining complex legal jargon in plain Hindi for Indian clients.
5. **Context-Aware Grounded Chat**: Ask natural language questions grounded exclusively in your uploaded document text with citation references.
6. **Clause Lab & Smart Clause Library**: Explain, simplify, or rewrite clauses, or insert 8 battle-tested standard Indian clauses with 1 click.
7. **Document Review Notes**: Collaborate with inline paragraph-level comments and resolution tracking (`Resolve / Reopen`).
8. **Digital E-Signature Pad**: Sign directly on an HTML5 canvas, type with cursive font, or upload an image seal with tamper-evident audit badge (`LX-SIGN-XXXX`).
9. **Contract Expiry & Milestones Tracker**: Track renewal deadlines, lock-in periods, notice periods, and payment milestones proactively.
10. **State-wise Stamp Duty Estimator (`/app/stamp-duty`)**: Compute exact stamp duty and registration fees across 25 Indian states for 13 legal instruments with direct links to official government e-Stamping portals.
11. **Export & Watermarks**: Download clean PDF/Word documents with customizable watermarks (`DRAFT`, `CONFIDENTIAL`, `EXECUTED`) and complete digital execution audit seals.
12. **Expiring Secure Links**: Generate time-limited, random-token read-only public share links for external stakeholders.

### Included legal templates
- Rent / lease agreement
- Non-disclosure agreement
- Employment agreement
- Freelance agreement
- Service agreement
- Partnership agreement
- Affidavit
- Consumer complaint
- Internship agreement
- Legal notice

### Indian Stamp Duty & Registration Categories (`/app/stamp-duty`)
Covers **25 Indian States and UTs** (arranged A-to-Z) across **13 statutory instruments**:
- Property Sale Deed / Conveyance
- Residential Tenancy (Up to 11 Months)
- Residential Lease (> 11 Months)
- Commercial Lease Agreement
- Gift Deed (Family Transfer with blood-relation concessions)
- General Power of Attorney (GPA)
- Promissory Note (On Demand)
- Affidavit / Sworn Declaration
- Partnership Deed / LLP Agreement
- NDA & Commercial Service Agreement
- Mortgage Deed / Loan Agreement
- Relinquishment / Release Deed
- Will / Testamentary Instrument

Templates and calculators are starting points for educational and assistive workflows, backed by direct links to official State Registration (IGRS / SHCIL) portals.

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS, Vite, Lucide |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI orchestration | LangChain.js |
| LLM providers | Hugging Face Inference Providers (configured), or OpenAI via LangChain.js |
| Development fallback | deterministic mock provider included in repo |
| Retrieval | Mongo vector records + local cosine search; optional MongoDB Atlas Vector Search |
| Auth | JWT access token + rotating server-side refresh sessions in httpOnly cookie |
| Validation | Zod |
| Security | Helmet, CORS allowlist, rate limiting, NoSQL guard, upload signature checks |
| Logging | Pino / pino-http + Mongo audit events |
| Files | PDF parser, Mammoth (DOCX), PDFKit, docx |
| Testing | Vitest, React Testing Library |
| CI | GitHub Actions |

## Repository structure

```text
LexSahayak_AI/
├── client/                    # React/Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── lib/
│       └── pages/
├── server/                    # Express API
│   ├── src/
│   │   ├── ai/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   └── validators/
│   └── tests/
├── docs/
├── .github/workflows/ci.yml
├── docker-compose.yml
└── README.md
```

## Run locally — easiest path

### Prerequisites
- Node.js 20.19+ (Node 22 LTS also suitable)
- npm
- MongoDB 8 locally, **or** Docker Desktop, **or** MongoDB Atlas

### 1. Clone and open the project

```bash
git clone https://github.com/YOUR_USERNAME/lexsahayak-ai.git
cd lexsahayak-ai
```

### 2. Install dependencies

```bash
npm install
npm run install:all
```

### 3. Create environment files

Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

macOS/Linux:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

For real LLM features, configure Hugging Face in your private `server/.env` as shown below. Change the JWT secrets in `server/.env` even for a shared college demo.

Generate strong random secrets, for example:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 4. Start MongoDB

With Docker:

```bash
docker compose up -d
```

Or set `MONGODB_URI` in `server/.env` to your local/Atlas database.

### 5. Seed the demo

```bash
npm run seed
```

### Local development seed accounts

After running `npm run seed` with `NODE_ENV=development`:

- Admin: values of `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in your private `server/.env`

> The seed script may create local demo data during development. Do not use, document, or retain demo credentials in a public deployment. Configure a strong unique admin password in your private `server/.env`.

### 6. Start frontend + API

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:3000`
- API health: `http://localhost:5000/api/v1/health`

## AI modes

### Recommended configuration — real Hugging Face Inference Providers

```env
AI_PROVIDER=huggingface
HF_TOKEN=hf_your_fine_grained_token
HF_CHAT_MODEL=Qwen/Qwen3-4B-Instruct-2507
HF_EMBEDDING_MODEL=thenlper/gte-large
VECTOR_SEARCH_MODE=local
```

Create a Hugging Face fine-grained token with the **Make calls to Inference Providers** permission. The default `Qwen/Qwen3-4B-Instruct-2507` is a low-cost model suitable for a college/demo deployment. `thenlper/gte-large` supplies retrieval embeddings for RAG. Keep `HF_TOKEN` only in your private `server/.env`; never commit it.

### Alternative — real LangChain + OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-key
OPENAI_CHAT_MODEL=gpt-5.6-terra
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
VECTOR_SEARCH_MODE=local
```

### Optional development fallback — mock AI

```env
AI_PROVIDER=mock
VECTOR_SEARCH_MODE=local
```

Mock mode is only a deterministic fallback for offline development; it does not call a real LLM.

Restart the server after changing environment variables.

**Important:** vectors generated by different embedding providers are not compatible. After switching providers or embedding models, re-seed or re-upload/re-index knowledge and documents so every vector uses the same embedding model.

### Optional Atlas Vector Search

Set:

```env
VECTOR_SEARCH_MODE=atlas
ATLAS_VECTOR_INDEX=legal_vector_index
```

Create an Atlas Vector Search index over `vectorchunks.embedding` using the dimensions produced by your selected embedding model. Keep local search for the simplest college/demo deployment.

## Security architecture highlights

- Access tokens are short-lived and kept in frontend memory; refresh sessions are represented by an httpOnly cookie and a server-side session record.
- Passwords are bcrypt-hashed; raw passwords/tokens are not stored.
- Refresh/verification/reset tokens are stored as hashes where persistence is needed.
- CORS uses an explicit `CLIENT_ORIGINS` allowlist.
- Helmet hardens HTTP headers; Express hides `x-powered-by`.
- Login/reset/AI/upload routes use separate rate limiters.
- Zod validates request bodies/params/queries on important routes.
- A recursive NoSQL guard rejects object keys beginning with `$` or containing `.`.
- Uploads are held in memory, size-limited, checked by MIME + magic bytes where supported, sanitized and never executed.
- RAG queries include owner/source scopes before retrieved content is sent to the LLM.
- External AI calls can receive redacted PII while the original document remains in MongoDB.
- Prompt templates tell the LLM to treat document text as untrusted content, not tool/system instructions.
- AI usage is quota-controlled and logged without storing secrets.
- Important user/admin/document actions produce audit events.
- Client-facing errors are centralized and do not expose stack traces in production.

See [`docs/SECURITY.md`](docs/SECURITY.md) for the threat model.

## Main REST API

Base URL: `/api/v1`

| Area | Examples |
|---|---|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` |
| Account | `GET /auth/me`, `PATCH /auth/preferences`, verify/reset flows |
| Documents | `GET /documents`, `POST /documents/generate`, `POST /documents/upload` |
| Intelligence | `POST /documents/:id/analyze`, `POST /documents/clause` |
| Execution & Signing | `POST /documents/:id/signatures`, `DELETE /documents/:id/signatures/:sigId` |
| Collaboration | `POST /documents/:id/comments`, `PATCH /documents/:id/comments/:cId/resolve` |
| Versions | `GET /documents/:id/versions`, `GET /documents/:id/compare` |
| Export & Watermark | `GET /documents/:id/export/:format?watermark=CONFIDENTIAL`, `POST /documents/:id/share` |
| Chat | `POST /chat`, `GET /chat` |
| Dashboard | `GET /dashboard` |
| Admin | users, metrics, knowledge base, audits, AI usage under `/admin/*` |
| Public | `GET /public/share/:token` |
| Health | `GET /health` |

See [`docs/API.md`](docs/API.md). A machine-readable OpenAPI 3.1 document is also served at `GET /api/v1/openapi.json`.

## Testing and quality

```bash
npm run test
npm run lint
npm run build
```

Current test coverage includes core privacy redaction, chunking, vector similarity, template catalog and a frontend legal-notice rendering test. The architecture leaves database/API integration tests isolated from service-unit tests so a CI MongoDB service can be added later without rewriting production code.

## Production deployment

A straightforward deployment is:

- React frontend → Vercel/Netlify/static host
- Express API → Render/Railway/Fly.io/container host
- MongoDB → MongoDB Atlas
- AI → Hugging Face Inference Providers (or OpenAI API)
- Email → SMTP provider
- HTTPS → hosting platform TLS

Read [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) before deployment. You mainly need to create production secrets, database/network access, frontend/backend URLs, an email provider if verification is enabled, and the AI key/provider.

## Admin demo capabilities

Admin accounts can:
- inspect product metrics
- search/manage users and roles
- ingest/delete knowledge-base sources
- view audit logs
- inspect AI usage summaries

Admin authorization is enforced in Express middleware; hiding the frontend menu is not considered authorization.

## Differentiators for viva/interviews

1. **State-Specific Statutory Stamp Duty Engine:** Solves the real-world Indian problem of multi-state stamp duty variations (25 states, 13 instruments) with direct official e-Stamping portal verification.
2. **End-to-End Execution with Digital E-Signatures:** In-browser canvas/cursive signature capture with tamper-evident audit trail codes (`LX-SIGN-XXXX`), IST timestamps, and dedicated PDF signature execution blocks.
3. **Smart Curated Indian Clause Library:** Provides battle-tested clauses (Arbitration Act 1996, Indian Contract Act provisions) with 1-click preview and contextual insertion.
4. **Bilingual Hindi Summarizer:** Breaks the language barrier for Indian citizens by summarizing complex legal jargon into plain, non-lawyer Hindi.
5. **Contract Lifecycle & Milestone Tracking:** Proactively detects and manages contract renewal windows, lock-ins, notice periods, and payment milestones.
6. **Private RAG rather than generic chat:** Retrieval scopes are enforced before LLM context assembly.
7. **Privacy Shield:** Recognizable PII (PAN, Aadhaar, phone, email) can be redacted before external inference.
8. **Version integrity:** SHA-256 hashes make saved revision integrity demonstrable.
9. **Grounding transparency:** Chat returns retrieval citations and confidence/limitations rather than presenting unsupported output as certain.
10. **Cost governance & Operational design:** Per-user quotas, rate limiting, health checks, structured audit logs, CI and deployment configuration are included.

## Limitations you should state in the viva

- The bundled knowledge seed is intentionally demonstrative and **not** a complete Indian-law corpus.
- AI-generated legal text may be wrong, outdated or inappropriate for a jurisdiction/fact pattern.
- Production legal deployment requires curated authoritative sources, source update governance and professional review.
- Local cosine retrieval is intended for demos/smaller collections; Atlas Vector Search is the scalable option included in the architecture.
- Malware scanning is not bundled because no external scanner is guaranteed in the local environment; upload type/signature/size controls are implemented and a production scanner should be inserted before persistent file storage if raw originals are retained.

## Documentation

- [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md) — problem, requirements, roles, scope
- [`docs/DIAGRAMS.md`](docs/DIAGRAMS.md) — UML-style, ER, DFD, auth/activity/RAG/security diagrams
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system, data and RAG flows
- [`docs/SECURITY.md`](docs/SECURITY.md) — security controls + threat model
- [`docs/API.md`](docs/API.md) — endpoint reference
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deployment checklist
- [`docs/TESTING.md`](docs/TESTING.md) — test/security test strategy
- [`docs/VIVA_GUIDE.md`](docs/VIVA_GUIDE.md) — how to present the project
- [`docs/GIT_COMMIT_PLAN.md`](docs/GIT_COMMIT_PLAN.md) — natural commit history if you want to reconstruct development commits

## License / academic use

This project is shared for educational and portfolio purposes. Review third-party licences and your institution's academic-integrity rules before reuse, submission, or commercial use.
