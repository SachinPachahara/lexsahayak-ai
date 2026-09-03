# B.Tech Project Diagrams

The diagrams use Mermaid so GitHub can render them directly and they can be recreated in draw.io/PlantUML for the final report.

## Use case diagram

```mermaid
flowchart LR
  U([User])
  LP([Legal Professional])
  A([Admin])
  U --> G[Generate legal document]
  U --> UP[Upload document]
  U --> AN[Analyze document]
  U --> C[Grounded document chat]
  U --> V[Edit/version/compare]
  U --> E[Export/share]
  U --> P[Privacy/preferences]
  LP --> G
  LP --> AN
  LP --> C
  A --> UM[Manage users]
  A --> KB[Manage knowledge base]
  A --> AU[Review audits]
  A --> US[Review AI usage]
```

## Component/class-level diagram

```mermaid
classDiagram
  class User { +name +email +role +preferences }
  class Session { +tokenHash +expiresAt +revokedAt }
  class LegalDocument { +title +content +currentVersion +status }
  class DocumentVersion { +version +contentHash +changeNote }
  class AnalysisResult { +riskScore +readabilityScore +confidence }
  class VectorChunk { +scope +text +embeddingModel +citation }
  class KnowledgeSource { +title +citation +status +chunkCount }
  class Conversation { +title +messages }
  class AuditLog { +action +resourceType +result }
  class AIUsage { +operation +provider +latencyMs +status }
  class ShareLink { +tokenHash +expiresAt +revokedAt }
  User "1" --> "many" Session
  User "1" --> "many" LegalDocument
  LegalDocument "1" --> "many" DocumentVersion
  LegalDocument "1" --> "0..1" AnalysisResult
  LegalDocument "1" --> "many" VectorChunk
  User "1" --> "many" Conversation
  KnowledgeSource "1" --> "many" VectorChunk
  LegalDocument "1" --> "many" ShareLink
  User "1" --> "many" AuditLog
  User "1" --> "many" AIUsage
```

## ER diagram

```mermaid
erDiagram
  USER ||--o{ SESSION : has
  USER ||--o{ LEGAL_DOCUMENT : owns
  USER ||--o{ DOCUMENT_VERSION : creates
  USER ||--o{ CONVERSATION : owns
  USER ||--o{ AI_USAGE : generates
  USER ||--o{ AUDIT_LOG : performs
  USER ||--o{ SHARE_LINK : creates
  LEGAL_DOCUMENT ||--o{ DOCUMENT_VERSION : versions
  LEGAL_DOCUMENT ||--o| ANALYSIS_RESULT : analyzed_as
  LEGAL_DOCUMENT ||--o{ VECTOR_CHUNK : indexed_as
  LEGAL_DOCUMENT ||--o{ SHARE_LINK : shared_by
  KNOWLEDGE_SOURCE ||--o{ VECTOR_CHUNK : indexed_as
```

## Authentication sequence

```mermaid
sequenceDiagram
  participant B as Browser
  participant API as Express API
  participant DB as MongoDB
  B->>API: POST /auth/login
  API->>DB: find user + bcrypt compare
  API->>DB: create refresh Session(hash)
  API-->>B: access JWT + httpOnly refresh cookie
  B->>API: API call + Bearer access JWT
  API->>DB: resolve active user
  API-->>B: protected data
  B->>API: POST /auth/refresh (cookie)
  API->>DB: validate + revoke old session
  API->>DB: create rotated session
  API-->>B: new access JWT + rotated cookie
```

## Document activity flow

```mermaid
flowchart TD
  S([Start]) --> M{Create or upload?}
  M -->|Create| T[Choose template]
  T --> F[Enter validated facts]
  F --> G[Generate draft]
  M -->|Upload| U[Validate + extract text]
  G --> D[Create document + v1 hash]
  U --> D
  D --> I[Index owner-scoped chunks]
  I --> W[Workspace]
  W --> A[AI review]
  W --> C[Document chat]
  W --> E[Edit]
  E --> NV[New version + reindex]
  NV --> W
  W --> X[Export/share]
  X --> END([End])
```

## Level-1 data flow diagram

```mermaid
flowchart LR
  USER[User] -->|credentials, documents, questions| WEB[React UI]
  WEB -->|REST requests| API[Express API]
  API -->|identity/documents/versions/audits| DB[(MongoDB)]
  API -->|authorized query| RAG[RAG Service]
  RAG -->|scoped chunks| DB
  API -->|minimized prompt/context| LC[LangChain]
  LC -->|external mode| LLM[LLM Provider]
  LLM -->|draft/analysis/answer| API
  API -->|safe response/citations| WEB
  ADMIN[Admin] -->|knowledge sources| WEB
```

## RAG / embedding pipeline

```mermaid
flowchart TD
  DOC[Document or approved KB source] --> SPLIT[Text chunker]
  SPLIT --> EMB[Embedding provider]
  EMB --> VC[(VectorChunk)]
  Q[Question] --> QE[Query embedding]
  AUTH[Owner / scope authorization] --> FILTER[Retrieval filter]
  QE --> RET[Similarity retrieval]
  VC --> RET
  FILTER --> RET
  RET --> CTX[Top authorized contexts]
  CTX --> REDACT[PII minimization]
  REDACT --> PROMPT[System + grounded prompt]
  PROMPT --> MODEL[LLM]
  MODEL --> ANSWER[Answer + citations + confidence]
```

## Security control flow

```mermaid
flowchart LR
  REQ[Request] --> CORS[CORS allowlist]
  CORS --> LIMIT[Rate/body limits]
  LIMIT --> VAL[Validation + NoSQL guard]
  VAL --> AUTH[Authentication]
  AUTH --> AUTHZ[Role/ownership authorization]
  AUTHZ --> SVC[Domain service]
  SVC --> AIQ[AI quota when applicable]
  AIQ --> RAG[Authorized retrieval]
  RAG --> PII[PII minimization]
  PII --> LLM[LLM]
  SVC --> AUDIT[Audit/usage log]
  SVC --> SAFE[Central safe response/error]
```
