import { LegalDocument } from '../models/LegalDocument.js';
import { AnalysisResult } from '../models/AnalysisResult.js';
import { AIUsage } from '../models/AIUsage.js';
import { ok } from '../utils/response.js';

export async function dashboard(req,res) {
  const ownerId=req.user._id;
  const [documents, analyzed, recent, riskAgg, aiToday] = await Promise.all([
    LegalDocument.countDocuments({ownerId,status:{$ne:'archived'}}),
    AnalysisResult.countDocuments({ownerId}),
    LegalDocument.find({ownerId}).select('title documentType status currentVersion updatedAt analysisId').sort({updatedAt:-1}).limit(6).lean(),
    AnalysisResult.aggregate([{ $match:{ownerId} },{$group:{_id:null,avgRisk:{$avg:'$riskScore'},avgReadability:{$avg:'$readabilityScore'}}}]),
    AIUsage.countDocuments({userId:ownerId,createdAt:{$gte:new Date(new Date().setHours(0,0,0,0))},status:'success'})
  ]);
  return ok(res,{metrics:{documents,analyzed,aiRequestsToday:aiToday,averageRisk:Math.round(riskAgg[0]?.avgRisk||0),averageReadability:Math.round(riskAgg[0]?.avgReadability||0)},recent});
}
