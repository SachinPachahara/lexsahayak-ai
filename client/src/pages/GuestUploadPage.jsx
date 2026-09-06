import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FileText, LockKeyhole, ScanSearch, UploadCloud } from 'lucide-react';
import { api } from '../lib/api';
import LegalNotice from '../components/LegalNotice';

export default function GuestUploadPage() {
  const fileInput = useRef(); const navigate = useNavigate();
  const [file, setFile] = useState(null); const [preview, setPreview] = useState(null); const [loading, setLoading] = useState(false);
  async function parse() {
    if (!file) return toast.error('Choose a document first');
    const body = new FormData(); body.append('file', file); setLoading(true);
    try { setPreview(await api('/public/guest/upload-preview', { method: 'POST', body, auth: false })); toast.success('Temporary preview ready'); } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  }
  const signInGate = action => { toast('Sign in or create an account to save and analyze.'); navigate('/register', { state: { guestAction: action } }); };
  return <main className="min-h-screen bg-app p-5"><div className="mx-auto max-w-5xl space-y-6 py-4"><Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-indigo-500"><ArrowLeft size={15}/> Back to home</Link><div><div className="text-sm font-black text-indigo-500">DOCUMENT PREVIEW</div><h1 className="mt-1 text-3xl font-black">Upload a document</h1><p className="mt-2 text-sm text-slate-500">Extract and inspect text from contracts, agreements, and legal notices.</p></div><LegalNotice/><div className="grid gap-6 lg:grid-cols-2"><section className="panel p-6"><input ref={fileInput} className="hidden" type="file" accept=".pdf,.docx,.txt,.jpg,.jpeg,.png" onChange={event => setFile(event.target.files?.[0] || null)}/><button type="button" onClick={() => fileInput.current?.click()} className="grid min-h-60 w-full place-items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900"><div><UploadCloud className="mx-auto text-indigo-500" size={30}/><b className="mt-3 block">Choose PDF, DOCX, TXT, JPG or PNG</b><span className="mt-1 block text-xs text-slate-500">Fast text extraction</span></div></button>{file && <div className="mt-4 flex items-center gap-2 text-sm"><FileText size={16} className="text-indigo-500"/><span className="truncate">{file.name}</span></div>}<button className="btn btn-primary mt-5 w-full" onClick={parse} disabled={!file || loading}><ScanSearch size={16}/>{loading ? 'Preparing preview…' : 'Preview document'}</button></section><section className="panel p-6"><div className="font-black">Extracted document preview</div>{preview ? <><div className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{preview.content}</div><button className="btn btn-primary mt-5 w-full" onClick={() => signInGate('AI review')}><LockKeyhole size={16}/> Continue to AI review & save</button></> : <p className="mt-4 text-sm text-slate-500">Your extracted text will appear here. Proceed to run AI analysis and save to your workspace.</p>}</section></div></div></main>;
}
