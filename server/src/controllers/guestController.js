import { getTemplate, legalTemplates } from '../templates/legalTemplates.js';
import { mockGenerate } from '../services/mockLegalAI.js';
import { validateUpload } from '../utils/fileMagic.js';
import { extractText } from '../services/fileParserService.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/response.js';

export async function guestTemplates(_req, res) {
  return ok(res, { templates: legalTemplates });
}

export async function guestDraftPreview(req, res) {
  const template = getTemplate(req.body.templateId);
  if (!template) throw new ApiError(404, 'Template not found', 'TEMPLATE_NOT_FOUND');
  const fields = req.body.fields && typeof req.body.fields === 'object' ? req.body.fields : {};
  const missing = template.fields.filter(field => field.required && !String(fields[field.name] ?? '').trim()).map(field => field.label);
  if (missing.length) throw new ApiError(422, 'Required template fields are missing.', 'TEMPLATE_FIELDS_MISSING', missing);
  // Guest drafts are generated in memory and are never persisted to the workspace.
  return ok(res, { content: mockGenerate(template, fields), title: fields.documentTitle || template.name, language: req.body.language === 'hi' ? 'hi' : 'en' }, 'Temporary guest draft created');
}

export async function guestUploadPreview(req, res) {
  if (!req.file) throw new ApiError(400, 'Choose a PDF, DOCX, TXT, JPG, or PNG document.', 'FILE_REQUIRED');
  const check = validateUpload(req.file);
  if (!check.valid) throw new ApiError(415, 'File signature does not match an allowed PDF, DOCX, TXT, JPG, or PNG format.', 'FILE_SIGNATURE_INVALID');
  const text = (await extractText(req.file, check.extension)).trim();
  if (text.length < 20) throw new ApiError(422, 'The document contains too little readable text, even after OCR. Use a clearer scan or image.', 'INSUFFICIENT_TEXT');
  // The parsed upload exists only for this response; it is not written to MongoDB.
  return ok(res, { title: check.safeName.replace(/\.[^.]+$/, ''), content: text.slice(0, 250000), sourceFileName: check.safeName }, 'Temporary guest upload parsed');
}
