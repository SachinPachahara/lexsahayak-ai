import { ApiError } from '../utils/ApiError.js';
function bad(value){
  if(!value||typeof value!=='object') return false;
  if(Array.isArray(value)) return value.some(bad);
  return Object.entries(value).some(([k,v])=>k.startsWith('$')||k.includes('.')||bad(v));
}
export function noSqlGuard(req,_res,next){ if(bad(req.body)||bad(req.query)||bad(req.params)) return next(new ApiError(400,'Request contains disallowed object keys.','UNSAFE_INPUT')); next(); }
