import { LegalDocument } from '../models/LegalDocument.js';
import { DocumentVersion } from '../models/DocumentVersion.js';
import { AnalysisResult } from '../models/AnalysisResult.js';
import { ShareLink } from '../models/ShareLink.js';
import { legalTemplates, getTemplate } from '../templates/legalTemplates.js';
import { generateLegalDocument, analyzeLegalDocument, transformClause } from '../services/aiService.js';
import { createDocument, getOwnedDocument, saveVersion, compareVersions, attachAnalysis, deleteOwnedDocument } from '../services/documentService.js';
import { validateUpload } from '../utils/fileMagic.js';
import { extractText } from '../services/fileParserService.js';
import { toPdfBuffer, toDocxBuffer } from '../services/exportService.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/response.js';
import { randomToken, sha256, decryptText } from '../utils/crypto.js';
import { audit } from '../services/auditService.js';

export async function templates(_req, res) { return ok(res, { templates: legalTemplates }); }
export async function generate(req, res) {
  const template = getTemplate(req.body.templateId); if (!template) throw new ApiError(404, 'Template not found', 'TEMPLATE_NOT_FOUND');
  const missing = template.fields.filter(f => f.required && (req.body.fields[f.name] === undefined || req.body.fields[f.name] === '')).map(f => f.label);
  if (missing.length) throw new ApiError(422, 'Required template fields are missing.', 'TEMPLATE_FIELDS_MISSING', missing);
  const content = await generateLegalDocument({ userId: req.user._id, template, fields: req.body.fields, language: req.body.language, redactPII: req.user.preferences?.redactPIIForAI !== false });
  let document;
  const defaultTitle = template.id === 'custom-document' ? req.body.fields.documentTitle : template.name;
  if (req.body.save) document = await createDocument({ ownerId: req.user._id, title: req.body.title || defaultTitle, documentType: template.id, source: 'generated', content, structuredData: req.body.fields, language: req.body.language });
  await audit({ userId: req.user._id, action: 'DOCUMENT_GENERATE', resourceType: 'document', resourceId: document?._id, ip: req.ip });
  return ok(res, { content, document }, 'Document generated', 201);
}
export async function uploadAndCreate(req, res) {
  if (!req.file) throw new ApiError(400, 'Choose a PDF, DOCX, TXT, JPG, or PNG document.', 'FILE_REQUIRED');
  const check = validateUpload(req.file); if (!check.valid) throw new ApiError(415, 'File signature does not match an allowed PDF, DOCX, TXT, JPG, or PNG format.', 'FILE_SIGNATURE_INVALID');
  const text = (await extractText(req.file, check.extension)).trim(); if (text.length < 20) throw new ApiError(422, 'The document contains too little readable text, even after OCR. Use a clearer scan or image.', 'INSUFFICIENT_TEXT');
  const doc = await createDocument({ ownerId: req.user._id, title: req.body.title?.trim() || check.safeName.replace(/\.[^.]+$/, ''), documentType: req.body.documentType || 'uploaded-legal-document', source: 'uploaded', content: text.slice(0,250000), sourceFileName: check.safeName, language: req.body.language === 'hi' ? 'hi' : 'en' });
  await audit({ userId: req.user._id, action: 'DOCUMENT_UPLOAD', resourceType: 'document', resourceId: doc._id, metadata: { extension: check.extension }, ip: req.ip });
  return ok(res, { document: doc }, 'Document uploaded and securely parsed', 201);
}
export async function list(req, res) {
  const { page, limit, status, q, sort } = req.query;
  const filter = { ownerId: req.user._id, ...(status ? { status } : {}) };
  if (q) filter.$or = [{ title: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'i') }, { tags: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'i') }];
  const sortMap = { updated: { updatedAt: -1 }, created: { createdAt: -1 }, title: { title: 1 } };
  const [items,total] = await Promise.all([LegalDocument.find(filter).select('-content').sort(sortMap[sort]).skip((page-1)*limit).limit(limit).lean(), LegalDocument.countDocuments(filter)]);
  return ok(res, { items, page, limit, total, totalPages: Math.ceil(total/limit) });
}
export async function getOne(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id); doc.lastAccessedAt = new Date(); await doc.save();
  const [analysis, versions] = await Promise.all([AnalysisResult.findOne({ documentId: doc._id }).lean(), DocumentVersion.find({ documentId: doc._id }).select('version contentHash changeNote createdAt').sort({ version: -1 }).lean()]);
  return ok(res, { document: doc, analysis, versions });
}
export async function update(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  if (req.body.title) doc.title = req.body.title; if (req.body.status) doc.status = req.body.status; await doc.save();
  const saved = await saveVersion({ documentId: doc._id, ownerId: req.user._id, content: req.body.content, structuredData: req.body.structuredData, changeNote: req.body.changeNote });
  await audit({ userId: req.user._id, action: 'DOCUMENT_UPDATE', resourceType: 'document', resourceId: doc._id, ip: req.ip });
  return ok(res, { document: saved }, 'Document saved as a new version');
}
export async function updateStatus(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  doc.status = req.body.status;
  await doc.save();
  await audit({ userId: req.user._id, action: 'DOCUMENT_STATUS_UPDATE', resourceType: 'document', resourceId: doc._id, metadata: { status: doc.status }, ip: req.ip });
  return ok(res, { document: doc }, `Document marked ${doc.status}`);
}
export async function analyze(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  const analysis = await analyzeLegalDocument({ userId: req.user._id, documentId: doc._id, content: doc.content, language: req.user.locale, redactPII: req.user.preferences?.redactPIIForAI !== false });
  const saved = await attachAnalysis(doc._id, req.user._id, analysis);
  await audit({ userId: req.user._id, action: 'DOCUMENT_ANALYZE', resourceType: 'document', resourceId: doc._id, ip: req.ip });
  return ok(res, { analysis: saved }, 'AI-assisted analysis completed');
}
export async function clause(req, res) { return ok(res, { result: await transformClause({ userId: req.user._id, clause: req.body.clause, mode: req.body.mode, language: req.user.locale, redactPII: req.user.preferences?.redactPIIForAI !== false }) }, `Clause ${req.body.mode} completed`); }
export async function versions(req, res) { await getOwnedDocument(req.params.id, req.user._id); return ok(res, { versions: await DocumentVersion.find({ documentId: req.params.id }).select('-content').sort({ version: -1 }).lean() }); }
export async function compare(req, res) { return ok(res, await compareVersions({ documentId: req.params.id, ownerId: req.user._id, fromVersion: req.query.from, toVersion: req.query.to })); }
export async function exportDocument(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id); const format = req.params.format;
  const watermark = req.query.watermark || null;
  let buffer, mime, ext;
  if (format === 'pdf') { buffer = await toPdfBuffer({ title: doc.title, content: doc.content, signatures: doc.signatures, watermark }); mime = 'application/pdf'; ext = 'pdf'; }
  else if (format === 'docx') { buffer = await toDocxBuffer({ title: doc.title, content: doc.content, watermark }); mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; ext = 'docx'; }
  else throw new ApiError(400, 'Export format must be pdf or docx', 'EXPORT_FORMAT_INVALID');
  await audit({ userId: req.user._id, action: 'DOCUMENT_EXPORT', resourceType: 'document', resourceId: doc._id, metadata: { format, watermark }, ip: req.ip });
  res.setHeader('Content-Type', mime); res.setHeader('Content-Disposition', `attachment; filename="${doc.title.replace(/[^a-z0-9_-]/gi,'_').slice(0,80)}.${ext}"`); res.send(buffer);
}
export async function archive(req, res) { const doc = await getOwnedDocument(req.params.id, req.user._id); doc.status='archived'; await doc.save(); await audit({ userId:req.user._id,action:'DOCUMENT_ARCHIVE',resourceType:'document',resourceId:doc._id,ip:req.ip }); return ok(res,{document:doc},'Document archived'); }
export async function remove(req, res) {
  const { document, cleanup } = await deleteOwnedDocument(req.params.id, req.user._id);
  await audit({ userId: req.user._id, action: 'DOCUMENT_DELETE', resourceType: 'document', resourceId: document._id, metadata: cleanup, ip: req.ip });
  return ok(res, { cleanup }, 'Document and all related data permanently deleted');
}
export async function createShareLink(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id); const raw = randomToken(24);
  const expiresDays = Math.min(30, Math.max(1, Number(req.body.expiresDays || 7)));
  await ShareLink.create({ documentId: doc._id, ownerId: req.user._id, tokenHash: sha256(raw), expiresAt: new Date(Date.now()+expiresDays*86400000) });
  await audit({ userId:req.user._id,action:'DOCUMENT_SHARE_LINK',resourceType:'document',resourceId:doc._id,ip:req.ip });
  return ok(res,{ token: raw, expiresAt: new Date(Date.now()+expiresDays*86400000) },'Read-only share link created',201);
}
export async function publicShared(req, res) {
  const link = await ShareLink.findOne({ tokenHash: sha256(req.params.token), revokedAt: null, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] }).select('+tokenHash').lean();
  if (!link) throw new ApiError(404, 'Share link is invalid or expired.', 'SHARE_LINK_INVALID');
  const doc = await LegalDocument.findById(link.documentId).select('title documentType content currentVersion updatedAt').lean(); if (!doc) throw new ApiError(404,'Document not found','DOCUMENT_NOT_FOUND');
  doc.content = decryptText(doc.content);
  return ok(res,{ document: doc });
}

export async function addSignature(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  const { partyName, partyRole, signatureData } = req.body;
  if (!partyName || !signatureData) throw new ApiError(400, 'Party name and signature data are required.', 'SIGNATURE_INVALID');
  const verificationCode = `LX-SIGN-${randomToken(4).toUpperCase()}`;
  const ipHash = sha256(req.ip || '127.0.0.1').slice(0, 16);
  const newSign = { partyName: partyName.trim(), partyRole: partyRole?.trim() || 'Signatory', signatureData, signedAt: new Date(), ipHash, verificationCode };
  if (!doc.signatures) doc.signatures = [];
  doc.signatures.push(newSign);
  await doc.save();
  await audit({ userId: req.user._id, action: 'DOCUMENT_SIGN', resourceType: 'document', resourceId: doc._id, metadata: { partyName, verificationCode }, ip: req.ip });
  return ok(res, { signatures: doc.signatures, signature: newSign }, 'Document digitally signed', 201);
}

export async function removeSignature(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  doc.signatures = (doc.signatures || []).filter(s => String(s._id) !== String(req.params.signatureId));
  await doc.save();
  return ok(res, { signatures: doc.signatures }, 'Signature removed');
}

export async function addComment(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  const { text, clauseReference } = req.body;
  if (!text || text.trim().length === 0) throw new ApiError(400, 'Comment text is required.', 'COMMENT_EMPTY');
  const comment = {
    id: randomToken(8),
    authorName: req.user.name || 'Reviewer',
    text: text.trim().slice(0, 1000),
    clauseReference: clauseReference?.trim() || '',
    status: 'open',
    createdAt: new Date()
  };
  if (!doc.comments) doc.comments = [];
  doc.comments.push(comment);
  await doc.save();
  return ok(res, { comments: doc.comments, comment }, 'Review note added', 201);
}

export async function updateComment(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  const comment = (doc.comments || []).find(c => c.id === req.params.commentId);
  if (!comment) throw new ApiError(404, 'Review note not found', 'COMMENT_NOT_FOUND');
  if (req.body.status) comment.status = req.body.status;
  await doc.save();
  return ok(res, { comments: doc.comments }, `Review note marked ${comment.status}`);
}

export async function removeComment(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  doc.comments = (doc.comments || []).filter(c => c.id !== req.params.commentId);
  await doc.save();
  return ok(res, { comments: doc.comments }, 'Review note removed');
}

export async function addMilestone(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  const { title, date, type, notes } = req.body;
  if (!title || !date) throw new ApiError(400, 'Milestone title and date are required.', 'MILESTONE_INVALID');
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) throw new ApiError(400, 'Invalid milestone date.', 'MILESTONE_DATE_INVALID');
  const milestone = {
    id: randomToken(8),
    title: title.trim().slice(0, 180),
    date: parsedDate,
    type: type || 'expiry',
    status: parsedDate < new Date() ? 'overdue' : 'upcoming',
    notes: notes?.trim()?.slice(0, 500) || '',
    createdAt: new Date()
  };
  if (!doc.milestones) doc.milestones = [];
  doc.milestones.push(milestone);
  await doc.save();
  await audit({ userId: req.user._id, action: 'DOCUMENT_MILESTONE_ADD', resourceType: 'document', resourceId: doc._id, metadata: { title, date: parsedDate }, ip: req.ip });
  return ok(res, { milestones: doc.milestones, milestone }, 'Milestone deadline added', 201);
}

export async function updateMilestone(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  const milestone = (doc.milestones || []).find(m => m.id === req.params.milestoneId);
  if (!milestone) throw new ApiError(404, 'Milestone not found', 'MILESTONE_NOT_FOUND');
  if (req.body.status) milestone.status = req.body.status;
  if (req.body.title) milestone.title = req.body.title.trim().slice(0, 180);
  if (req.body.date) {
    const parsedDate = new Date(req.body.date);
    if (!isNaN(parsedDate.getTime())) {
      milestone.date = parsedDate;
      if (milestone.status !== 'completed') {
        milestone.status = parsedDate < new Date() ? 'overdue' : 'upcoming';
      }
    }
  }
  if (req.body.notes !== undefined) milestone.notes = req.body.notes.trim().slice(0, 500);
  await doc.save();
  return ok(res, { milestones: doc.milestones }, 'Milestone updated');
}

export async function removeMilestone(req, res) {
  const doc = await getOwnedDocument(req.params.id, req.user._id);
  doc.milestones = (doc.milestones || []).filter(m => m.id !== req.params.milestoneId);
  await doc.save();
  return ok(res, { milestones: doc.milestones }, 'Milestone removed');
}
