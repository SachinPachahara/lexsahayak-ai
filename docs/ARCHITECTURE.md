# Architecture

## 1. System overview

```mermaid
flowchart LR
  U[Browser / React] -->|HTTPS REST| API[Express API]
  API --> AUTH[Auth + Authorization]
  API --> DOC[Document Service]
  API --> AI[AI Service]
  API --> ADM[Admin Service]
  AUTH --> MDB[(MongoDB)]
  DOC --> MDB
  ADM --> MDB
  AI --> RAG[RAG Service]
  RAG --> MDB
  AI --> LC[LangChain.js Provider]
  LC --> MOCK[Mock provider]
  LC --> OAI[OpenAI]
  API --> MAIL[Console/SMTP email]
```

The frontend never calls the external LLM directly. Every AI request passes through authentication, authorization, rate limiting, quota checks, retrieval scoping and the AI service.

## 2. Backend layering

```text
Route
  -> authentication/authorization/rate-limit/validation middleware
  -> controller
  -> domain service
  -> model/repository operation
  -> safe response

Errors from all layers
  -> centralized error middleware
  -> safe client message + structured server log
```

Controllers coordinate HTTP behavior; reusable logic lives in services. This keeps AI, document, audit, token, mail, export and retrieval logic testable without bloated route files.

## 3. Data model

Principal collections:

- `users` — identity, role, verification and preferences
- `sessions` — refresh-session state/revocation
- `legaldocuments` — document metadata/current content
- `documentversions` — immutable saved revisions + SHA-256 hash
- `analysisresults` — structured AI analysis snapshots
- `vectorchunks` — chunk text, embedding and owner/source metadata
- `knowledgesources` — admin-managed shared knowledge metadata
- `conversations` — scoped chat history
- `auditlogs` — important security/product events
- `aiusages` — request/token/latency/success telemetry
- `sharelinks` — hashed random public-link tokens and expiry

## 4. Generation flow

```mermaid
sequenceDiagram
  participant U as User
  participant R as React
  participant E as Express
  participant A as AI Service
  participant L as LangChain Provider
  participant D as MongoDB
  U->>R: Fill template fields
  R->>E: POST /documents/generate
  E->>E: Auth + validate + rate limit
  E->>A: Generate request
  A->>A: quota + optional PII masking
  A->>L: prompt + grounded global context
  L-->>A: draft
  A-->>E: validated result
  E->>D: document + version + chunks
  E-->>R: created document
```

## 5. Upload/analyze flow

```mermaid
flowchart TD
  F[PDF/DOCX/TXT upload] --> V[Size + MIME + signature validation]
  V --> X[Safe text extraction]
  X --> D[Create owner-scoped document]
  D --> H[Save hash-backed version]
  D --> C[Chunk text]
  C --> E[Embed chunks]
  E --> M[(MongoDB vector chunks)]
  D --> A[Analyze]
  A --> Q[Owner-scoped retrieval]
  Q --> P[Privacy Shield + prompt]
  P --> L[LLM]
  L --> S[Structured analysis]
```

Raw uploaded executable content is never run. The implementation extracts supported document text and persists the normalized document content rather than trusting filenames.

## 6. Private RAG flow

```mermaid
flowchart LR
  Q[User question] --> AU[Authenticated user]
  AU --> FIL[Build owner/document filters]
  FIL --> RET[Vector retrieval]
  RET --> CTX[Authorized chunks only]
  CTX --> P[Grounded prompt]
  P --> L[LLM]
  L --> V[Validated answer]
  V --> C[Citations + limitations]
```

Security boundary: **authorization happens during retrieval, before context reaches the model**. The system does not retrieve every user's documents and ask the model to hide unauthorized data.

## 7. Frontend architecture

- `AuthContext` owns bootstrap/session state and theme preference.
- `lib/api.js` owns authenticated HTTP calls, in-memory access token and one-time refresh/retry behavior.
- `ProtectedRoute` gates authenticated/admin navigation as a UX control; backend authorization remains authoritative.
- `AppLayout` provides responsive dashboard navigation.
- Page components focus on workflow and call the API layer rather than embedding transport logic everywhere.

## 8. Scalability path

The included local vector mode is deliberately simple for demonstrations. The API contract and vector service also support MongoDB Atlas Vector Search so the retrieval implementation can scale without changing React or controller flows. Horizontal API scaling requires shared MongoDB session/audit state and normal stateless web hosting; access JWTs are self-contained while refresh state lives in MongoDB.
