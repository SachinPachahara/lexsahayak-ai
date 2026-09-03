# B.Tech Viva Guide

## 30-second explanation

“LexSahayak AI is a MERN + LangChain legal-document intelligence platform. A user can generate or upload a document, analyze risks and obligations, ask grounded questions through private RAG, edit/version the document, compare revisions, export it and share an expiring read-only link. I designed the AI as a backend service rather than calling an LLM from React, so authentication, document-level authorization, privacy masking, retrieval scoping, rate limits, cost tracking and audit logging all happen before or around the model.”

## What makes the project technically strong

- MERN architecture plus a real AI service boundary
- RAG with authorization at retrieval time
- provider abstraction: deterministic offline demo + production LangChain/OpenAI
- hybrid application/security design instead of relying on model prompts
- versioning/integrity hashes
- PII minimization
- expiring sharing
- structured AI usage and admin observability
- production environment/deployment separation

## Likely viva questions

### Why RAG instead of fine-tuning?
The product needs answers grounded in a changing, permissioned document/knowledge collection. Retrieval can select current authorized context at request time. Fine-tuning is not an access-control mechanism and is harder to update/source-cite. The project therefore uses an existing LLM and RAG rather than training a new foundation model.

### Why not call OpenAI directly from React?
It would expose provider credentials and bypass server-side authorization, quotas, audit logs, retrieval scoping and privacy controls. React calls Express; Express owns AI orchestration.

### How do you prevent one user's data appearing in another user's AI answer?
The retriever receives owner/document filters before context is assembled. Unauthorized chunks never reach the model. This is stronger than asking the model to “ignore” other users' data.

### How do you address hallucination?
Use retrieved context, request grounded responses, return source/citation metadata, make limitations visible, and avoid presenting the assistant as a lawyer. For real deployment, authoritative curated sources and human professional review are mandatory.

### What is the Privacy Shield?
Before external inference, common identifiers can be replaced with placeholders. The original document stays in the application's database while the external provider sees a minimized version where feasible.

### What is content hashing used for?
Each stored version has a SHA-256 hash over its content. It supports integrity checks and gives a concrete version-provenance feature to demonstrate.

### Why keep an AI mock provider?
It makes the complete application reproducible without a paid key and isolates provider-dependent code behind one interface. The same UI/API workflows work with a production provider later.

### What scales first?
For larger retrieval datasets, switch from local cosine scanning to Atlas Vector Search. The API and RAG service are already separated so frontend flows do not change.

## Demo sequence

1. Login as seeded demo user.
2. Dashboard: explain metrics/recent activity.
3. Generate an NDA/freelance document.
4. Open workspace and save an edit as another version.
5. Run AI analysis and point out risks/obligations.
6. Ask a grounded document question and show citations.
7. Compare versions and explain SHA-256 revision integrity.
8. Export PDF/DOCX.
9. Create an expiring share link.
10. Login as admin and show knowledge-base ingestion, audit log and AI usage.
11. Close with security architecture and the limitation that AI output is assistance, not legal advice.
