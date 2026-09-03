# Natural Git Commit Plan

If you need to rebuild a clean academic commit history from the completed project, do **not** create fake dates or claim work you did not perform. Commit the implementation in a natural dependency order using the existing files.

1. `chore: initialize MERN workspace and environment templates`
   - root package/config, client/server package files, `.gitignore`, Docker Mongo
2. `feat: add Express configuration database logging and health endpoint`
   - server config, app/server, core error utilities
3. `feat: implement user authentication and refresh sessions`
   - User/Session models, token/mail/auth services, auth middleware/controller/routes/validators
4. `feat: add authorization validation and API security middleware`
   - role checks, rate limits, no-SQL guard, upload middleware, central error handling
5. `feat: implement legal document models templates and versioning`
   - LegalDocument/DocumentVersion/models, templates, document service
6. `feat: add secure document upload extraction and exports`
   - file validation/parser, PDF/DOCX export, document endpoints
7. `feat: integrate LangChain provider and AI usage controls`
   - AI provider/prompts/usage service/mock provider
8. `feat: implement private RAG indexing and grounded chat`
   - vector/chunk utils, VectorChunk/KnowledgeSource/Conversation, RAG/chat
9. `feat: add document analysis clause lab and secure sharing`
   - analysis/share models/controllers, PII shield, version compare
10. `feat: build responsive authentication and application shell`
    - React context/API/router/layout/auth pages/styles
11. `feat: build dashboard templates generation and document library`
    - primary user pages
12. `feat: add document intelligence workspace and legal chat UI`
    - workspace/chat/version/export/share UI
13. `feat: add admin knowledge audit and AI usage dashboard`
    - admin frontend/backend
14. `test: add core service and frontend unit tests`
    - tests
15. `ci: add GitHub Actions quality pipeline`
    - workflow
16. `docs: add architecture security deployment API and viva guides`
    - README/docs

Create a branch for large future work such as `feature/authoritative-legal-corpus` or `feature/atlas-vector-search`, then merge through pull requests when collaborating with a team.
