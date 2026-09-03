import { User } from '../models/User.js';
import { LegalDocument } from '../models/LegalDocument.js';
import { KnowledgeSource } from '../models/KnowledgeSource.js';
import { AuditLog } from '../models/AuditLog.js';
import { AIUsage } from '../models/AIUsage.js';
import { validateUpload } from '../utils/fileMagic.js';
import { extractText } from '../services/fileParserService.js';
import { indexText, removeKnowledgeSource } from '../services/ragService.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/response.js';
import { audit } from '../services/auditService.js';

export async function metrics(_req,res) {
  const since=new Date(Date.now()-30*86400000);
  const [users,documents,sources,aiRequests,aiFailures,roles] = await Promise.all([
    User.countDocuments(), LegalDocument.countDocuments(), KnowledgeSource.countDocuments({isActive:true}),
    AIUsage.countDocuments({createdAt:{$gte:since}}), AIUsage.countDocuments({createdAt:{$gte:since},status:'failure'}),
    User.aggregate([{$group:{_id:'$role',count:{$sum:1}}}])
  ]);
  return ok(res,{users,documents,sources,aiRequests,aiFailureRate:aiRequests?Number((aiFailures/aiRequests*100).toFixed(1)):0,roles});
}
export async function users(req,res) {
  const page=Math.max(1,Number(req.query.page||1)),limit=Math.min(50,Math.max(1,Number(req.query.limit||20)));
  const filter=req.query.q?{$or:[{name:new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i')},{email:new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i')}]}:{};
  const [items,total]=await Promise.all([User.find(filter).select('name email role verified isActive createdAt lastLoginAt').sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean(),User.countDocuments(filter)]);
  return ok(res,{items,page,limit,total,totalPages:Math.ceil(total/limit)});
}
export async function updateUser(req,res) {
  if(String(req.params.id)===String(req.user._id)&&req.body.isActive===false) throw new ApiError(400,'You cannot disable your own active admin account.','SELF_DISABLE_BLOCKED');
  if(String(req.params.id)===String(req.user._id)&&req.body.role&&req.body.role!=='admin') throw new ApiError(400,'You cannot remove your own admin role.','SELF_DEMOTION_BLOCKED');
  const allowed={}; if(['user','legal_professional','admin'].includes(req.body.role)) allowed.role=req.body.role; if(typeof req.body.isActive==='boolean') allowed.isActive=req.body.isActive;
  const user=await User.findByIdAndUpdate(req.params.id,{$set:allowed},{new:true}).select('name email role verified isActive'); if(!user) throw new ApiError(404,'User not found','USER_NOT_FOUND');
  await audit({userId:req.user._id,action:'ADMIN_USER_UPDATE',resourceType:'user',resourceId:user._id,metadata:allowed,ip:req.ip}); return ok(res,{user},'User updated');
}
export async function uploadKnowledge(req,res) {
  if(!req.file) throw new ApiError(400,'Choose a knowledge-base PDF, DOCX, or TXT file.','FILE_REQUIRED');
  const check=validateUpload(req.file); if(!check.valid) throw new ApiError(415,'Invalid file signature.','FILE_SIGNATURE_INVALID');
  const text=(await extractText(req.file,check.extension)).trim(); if(text.length<50) throw new ApiError(422,'Source has insufficient extractable text.','INSUFFICIENT_TEXT');
  const source=await KnowledgeSource.create({title:req.body.title?.trim()||check.safeName.replace(/\.[^.]+$/,''),sourceType:req.body.sourceType==='official'?'official':'uploaded',jurisdiction:req.body.jurisdiction||'India',citation:req.body.citation||'',sourceUrl:req.body.sourceUrl||'',fileName:check.safeName,uploadedBy:req.user._id,status:'processing'});
  try { source.chunkCount=await indexText({scope:'global',text,sourceId:source._id,citation:source.citation||source.title}); source.status='ready'; await source.save(); }
  catch(error){ source.status='failed';source.error='Indexing failed';await source.save(); throw error; }
  await audit({userId:req.user._id,action:'KNOWLEDGE_UPLOAD',resourceType:'knowledge_source',resourceId:source._id,metadata:{chunks:source.chunkCount},ip:req.ip});
  return ok(res,{source},'Knowledge source indexed',201);
}
export async function listKnowledge(_req,res){return ok(res,{items:await KnowledgeSource.find().sort({updatedAt:-1}).lean()});}
export async function deleteKnowledge(req,res){const source=await KnowledgeSource.findById(req.params.id);if(!source) throw new ApiError(404,'Knowledge source not found','SOURCE_NOT_FOUND');await removeKnowledgeSource(source._id);await audit({userId:req.user._id,action:'KNOWLEDGE_DELETE',resourceType:'knowledge_source',resourceId:source._id,ip:req.ip});return ok(res,{},'Knowledge source deleted');}
export async function audits(req,res){const limit=Math.min(100,Math.max(1,Number(req.query.limit||50)));return ok(res,{items:await AuditLog.find().sort({createdAt:-1}).limit(limit).populate('userId','name email').lean()});}
export async function aiUsage(req,res){const since=new Date(Date.now()-30*86400000);const byOperation=await AIUsage.aggregate([{$match:{createdAt:{$gte:since}}},{$group:{_id:'$operation',requests:{$sum:1},avgLatencyMs:{$avg:'$latencyMs'},estimatedTokens:{$sum:{$add:['$estimatedInputTokens','$estimatedOutputTokens']}}}},{$sort:{requests:-1}}]);return ok(res,{byOperation});}
