import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, MailWarning, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import Logo from '../components/Logo';

export default function VerifyEmailPage(){
  const [params]=useSearchParams();
  const [state,setState]=useState({loading:true,ok:false,message:'Verifying your email…'});
  useEffect(()=>{
    const token=params.get('token');
    if(!token){setState({loading:false,ok:false,message:'This verification link is missing its token.'});return;}
    api('/auth/verify-email',{method:'POST',body:{token}})
      .then((r)=>setState({loading:false,ok:true,message:r.message||'Email verified successfully.'}))
      .catch((e)=>setState({loading:false,ok:false,message:e.message||'Verification failed.'}));
  },[params]);
  return <div className="min-h-screen grid place-items-center px-4 bg-slate-50 dark:bg-slate-950">
    <div className="panel max-w-lg w-full text-center p-8">
      <div className="flex justify-center mb-6"><Logo/></div>
      {state.loading?<Loader2 className="w-12 h-12 mx-auto animate-spin text-indigo-600"/>:state.ok?<CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600"/>:<MailWarning className="w-12 h-12 mx-auto text-amber-600"/>}
      <h1 className="text-2xl font-semibold mt-5">{state.loading?'Email verification':state.ok?'Verification complete':'Unable to verify'}</h1>
      <p className="text-slate-600 dark:text-slate-300 mt-3">{state.message}</p>
      <div className="legal-notice mt-6 text-left"><ShieldCheck className="w-5 h-5 shrink-0"/><span>LexSahayak provides legal document information and does not replace advice from a qualified legal professional.</span></div>
      <Link to="/login" className="btn-primary inline-flex mt-6">Continue to sign in</Link>
    </div>
  </div>;
}
