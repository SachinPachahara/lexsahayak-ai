export const openapi = {
  openapi: '3.1.0',
  info: {
    title: 'LexSahayak AI API',
    version: '1.0.0',
    description: 'MERN + LangChain legal document lifecycle API. AI output is assistance, not legal advice.'
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      ApiSuccess: { type: 'object', properties: { success: { const: true }, message: { type: 'string' }, data: { type: 'object' } } },
      ApiError: { type: 'object', properties: { success: { const: false }, message: { type: 'string' }, errorCode: { type: 'string' } } }
    }
  },
  paths: {
    '/health': { get: { summary: 'Health check', responses: { 200: { description: 'Healthy' }, 503: { description: 'Dependency unavailable' } } } },
    '/auth/register': { post: { summary: 'Register account', responses: { 201: { description: 'Created' }, 422: { description: 'Validation error' } } } },
    '/auth/login': { post: { summary: 'Sign in', responses: { 200: { description: 'Signed in' }, 401: { description: 'Invalid credentials' } } } },
    '/auth/refresh': { post: { summary: 'Rotate refresh session and issue access token', responses: { 200: { description: 'Refreshed' }, 401: { description: 'Invalid session' } } } },
    '/auth/logout': { post: { summary: 'Revoke refresh session', responses: { 200: { description: 'Signed out' } } } },
    '/auth/me': { get: { summary: 'Current user', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Current user' }, 401: { description: 'Unauthorized' } } } },
    '/documents/templates': { get: { summary: 'Legal template catalog', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Templates' } } } },
    '/documents/generate': { post: { summary: 'Generate and optionally save a legal document', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Generated' }, 429: { description: 'Rate/quota limited' } } } },
    '/documents/upload': { post: { summary: 'Securely parse PDF/DOCX/TXT into a document', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Uploaded' }, 415: { description: 'Unsupported/signature mismatch' } } } },
    '/documents': { get: { summary: 'Search/filter/paginate owned documents', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Document page' } } } },
    '/documents/{id}': {
      get: { summary: 'Read owned document', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Document' }, 404: { description: 'Not found/not owned' } } },
      patch: { summary: 'Save edited document as a new version', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Saved' } } },
      delete: { summary: 'Permanently delete an owned document and its related data', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found/not owned' } } }
    },
    '/documents/{id}/analyze': { post: { summary: 'Run structured AI review', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Analysis' } } } },
    '/documents/clause': { post: { summary: 'Explain or improve a clause', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Clause result' } } } },
    '/documents/{id}/versions': { get: { summary: 'List revision metadata and hashes', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Versions' } } } },
    '/documents/{id}/compare': { get: { summary: 'Compare two revisions', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, { name: 'from', in: 'query', required: true, schema: { type: 'integer' } }, { name: 'to', in: 'query', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Diff' } } } },
    '/documents/{id}/export/{format}': { get: { summary: 'Export PDF or DOCX', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, { name: 'format', in: 'path', required: true, schema: { enum: ['pdf','docx'] } }], responses: { 200: { description: 'Binary export' } } } },
    '/documents/{id}/share': { post: { summary: 'Create expiring read-only link', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'Share token' } } } },
    '/chat': { post: { summary: 'Grounded authorized RAG chat', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Answer + citations' } } } },
    '/dashboard': { get: { summary: 'User dashboard metrics', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Dashboard' } } } },
    '/admin/metrics': { get: { summary: 'Admin metrics', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Metrics' }, 403: { description: 'Admin required' } } } },
    '/admin/knowledge': {
      get: { summary: 'List knowledge sources', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Sources' } } },
      post: { summary: 'Upload and index global knowledge', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Indexed' } } }
    },
    '/admin/audits': { get: { summary: 'Read audit trail', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Audits' } } } },
    '/admin/ai-usage': { get: { summary: 'AI usage aggregation', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Usage' } } } },
    '/public/share/{token}': { get: { summary: 'Read a non-expired public share', parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Read-only document' }, 404: { description: 'Invalid/expired' } } } }
  }
};
