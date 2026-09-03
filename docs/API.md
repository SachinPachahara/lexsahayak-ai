# API Reference

Base prefix: `/api/v1`

All normal success payloads follow the shape:

```json
{ "success": true, "message": "...", "data": {} }
```

Errors use a safe shape such as:

```json
{ "success": false, "message": "Invalid request", "errorCode": "INVALID_INPUT" }
```

## Authentication

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | No | Register |
| POST | `/auth/login` | No | Login; returns access token + refresh cookie |
| POST | `/auth/refresh` | Refresh cookie | Rotate/obtain access token |
| POST | `/auth/logout` | Cookie optional | Revoke refresh session |
| GET | `/auth/me` | Bearer | Current user |
| POST | `/auth/verify-email` | No | Verify token |
| POST | `/auth/forgot-password` | No | Start reset flow |
| POST | `/auth/reset-password` | No | Finish reset flow |
| PATCH | `/auth/preferences` | Bearer | Theme/AI privacy preferences |

## Documents

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/documents/templates` | List generation templates |
| POST | `/documents/generate` | Generate and persist a document |
| POST | `/documents/upload` | Upload + extract supported document |
| GET | `/documents` | Search/filter/paginate user's documents |
| GET | `/documents/:id` | Read owned document |
| PATCH | `/documents/:id` | Save document edit/new version |
| POST | `/documents/:id/analyze` | Structured AI analysis |
| POST | `/documents/clause` | Explain/rewrite a clause |
| GET | `/documents/:id/versions` | Revision history |
| GET | `/documents/:id/compare?from=1&to=2` | Text comparison |
| GET | `/documents/:id/export/pdf` | PDF export |
| GET | `/documents/:id/export/docx` | DOCX export |
| POST | `/documents/:id/archive` | Archive document |
| POST | `/documents/:id/share` | Create expiring read-only share link |

Document routes require bearer authentication. Resource ownership is enforced server-side.

## Chat

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/chat` | Grounded RAG chat, optionally scoped to document |
| GET | `/chat` | User conversation list |
| GET | `/chat/:id` | User-owned conversation |

## Dashboard

`GET /dashboard` returns user-centric counts/recent activity/usage for the product dashboard.

## Admin

All endpoints below require authentication **and** role `admin`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/metrics` | Operational/product metrics |
| GET | `/admin/users` | Search/list users |
| PATCH | `/admin/users/:id` | Change permitted user status/role fields |
| GET | `/admin/knowledge` | Knowledge-source list |
| POST | `/admin/knowledge` | Upload/index global knowledge source |
| DELETE | `/admin/knowledge/:id` | Remove source and its chunks |
| GET | `/admin/audits` | Audit log view |
| GET | `/admin/ai-usage` | AI usage aggregation |

## Public

`GET /public/share/:token` returns a non-expired, read-only shared document. The endpoint does not accept a document database ID as public authorization.

## Health

`GET /health` reports a minimal API/database/provider status without returning credentials or connection strings.

## Authentication transport

Normal authenticated API calls send:

```http
Authorization: Bearer <short-lived-access-token>
```

The refresh credential is handled by an httpOnly cookie, not by application JavaScript/localStorage.
