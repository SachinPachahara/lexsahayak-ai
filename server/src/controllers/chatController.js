import { Conversation } from '../models/Conversation.js';
import { askGrounded } from '../services/aiService.js';
import { getOwnedDocument } from '../services/documentService.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/response.js';
import { audit } from '../services/auditService.js';

export async function chat(req, res) {
  const { question, documentId, conversationId } = req.body;
  if (documentId) await getOwnedDocument(documentId, req.user._id);
  let conversation;
  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, ownerId: req.user._id });
    if (!conversation) throw new ApiError(404, 'Conversation not found', 'CONVERSATION_NOT_FOUND');
    if (String(conversation.documentId || '') !== String(documentId || '')) throw new ApiError(409, 'Conversation context does not match the requested document.', 'CONVERSATION_CONTEXT_MISMATCH');
  } else conversation = await Conversation.create({ ownerId: req.user._id, documentId, title: question.slice(0,80) });
  const history = conversation.messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
  const result = await askGrounded({ userId: req.user._id, question, documentId, history, language: req.user.locale, redactPII: req.user.preferences?.redactPIIForAI !== false });
  conversation.messages.push({ role:'user', content: question }, { role:'assistant', content: result.answer, answerSource: result.answerSource, citations: result.citations.map(c => ({ label:c.label, sourceId:c.sourceId, chunkId:c.chunkId })) });
  if (conversation.messages.length > 60) conversation.messages = conversation.messages.slice(-60);
  await conversation.save();
  await audit({ userId:req.user._id, action:'AI_CHAT', resourceType: documentId ? 'document' : 'knowledge_base', resourceId: documentId, metadata:{ grounded: result.citations.length > 0, answerSource: result.answerSource }, ip:req.ip });
  return ok(res, { conversationId: conversation._id, ...result }, result.answerSource === 'general_ai' ? 'General informational answer generated' : 'Answer generated from authorized retrieved context');
}
export async function listConversations(req,res) {
  const filter={ownerId:req.user._id}; if(req.query.documentId) filter.documentId=req.query.documentId;
  return ok(res,{items:await Conversation.find(filter).select('-messages').sort({updatedAt:-1}).limit(30).lean()});
}
export async function getConversation(req,res) {
  const item=await Conversation.findOne({_id:req.params.id,ownerId:req.user._id}).lean(); if(!item) throw new ApiError(404,'Conversation not found','CONVERSATION_NOT_FOUND');
  return ok(res,{conversation:item});
}
