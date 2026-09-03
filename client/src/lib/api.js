const API_URL=import.meta.env.VITE_API_URL||'http://localhost:5000/api/v1';
let accessToken='';
let refreshPromise=null;
export const authToken={set:v=>{accessToken=v||'';},get:()=>accessToken};
async function refreshAccess(){
  if(!refreshPromise) refreshPromise=fetch(`${API_URL}/auth/refresh`,{method:'POST',credentials:'include'}).then(async r=>{const body=await r.json().catch(()=>({}));if(!r.ok) throw new Error(body.message||'Session expired');accessToken=body.data.accessToken;return body.data;}).finally(()=>{refreshPromise=null;});
  return refreshPromise;
}
export async function api(path,{method='GET',body,headers={},auth=true,retry=true}={}){
  const options={method,credentials:'include',headers:{...headers}};
  if(auth&&accessToken) options.headers.Authorization=`Bearer ${accessToken}`;
  if(body instanceof FormData) options.body=body; else if(body!==undefined){options.headers['Content-Type']='application/json';options.body=JSON.stringify(body);}
  let res=await fetch(`${API_URL}${path}`,options);
  if(res.status===401&&auth&&retry){try{await refreshAccess();return api(path,{method,body,headers,auth,retry:false});}catch{/* handled below */}}
  const contentType=res.headers.get('content-type')||'';
  const data=contentType.includes('application/json')?await res.json():await res.blob();
  if(!res.ok){const error=new Error(data?.message||`Request failed (${res.status})`);error.code=data?.errorCode;error.details=data?.details;error.status=res.status;throw error;}
  return data?.data??data;
}
export async function bootstrapSession(){try{return await refreshAccess();}catch{return null;}}
export async function downloadDocument(id,format,title='document'){
  if(!accessToken) await refreshAccess();
  let res=await fetch(`${API_URL}/documents/${id}/export/${format}`,{credentials:'include',headers:{Authorization:`Bearer ${accessToken}`}});
  if(res.status===401){await refreshAccess();res=await fetch(`${API_URL}/documents/${id}/export/${format}`,{credentials:'include',headers:{Authorization:`Bearer ${accessToken}`}});}
  if(!res.ok) throw new Error('Export failed');
  const blob=await res.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${title.replace(/[^a-z0-9_-]/gi,'_')}.${format}`;a.click();URL.revokeObjectURL(url);
}
