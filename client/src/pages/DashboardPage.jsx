import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Files, Gauge, Plus, ScanSearch, Sparkles, UploadCloud } from 'lucide-react';
import { api } from '../lib/api';
import EmptyState from '../components/EmptyState';
import LegalNotice from '../components/LegalNotice';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

function greetingForCurrentTime() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => { api('/dashboard').then(setData).catch(() => setData({ metrics: {}, recent: [] })); }, []);
  if (!data) return <div className="panel p-8"><div className="spinner" /></div>;
  const metrics = data.metrics;
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-sm font-bold text-indigo-500">{greetingForCurrentTime().toUpperCase()}</div><h1 className="mt-1 text-3xl font-black tracking-tight">{user?.name?.split(' ')[0]}'s legal workspace</h1><p className="mt-2 text-sm text-slate-500">Create, review, organise and share your legal documents in one place.</p></div><div className="flex gap-2"><Link className="btn btn-secondary" to="/app/upload"><UploadCloud size={16} /> Upload</Link><Link className="btn btn-primary" to="/app/templates"><Plus size={16} /> New document</Link></div></div>
    <LegalNotice />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Active documents" value={metrics.documents ?? 0} icon={Files} /><StatCard label="Documents reviewed" value={metrics.analyzed ?? 0} icon={ScanSearch} /><StatCard label="Workspace activity today" value={metrics.aiRequestsToday ?? 0} icon={Sparkles} /><StatCard label="Avg. review attention" value={`${metrics.averageRisk ?? 0}/100`} icon={Gauge} /></div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]"><section><div className="mb-3 flex items-center justify-between"><h2 className="font-black">Recent documents</h2><Link className="text-xs font-bold text-indigo-500" to="/app/documents">View all</Link></div>{data.recent?.length ? <div className="panel overflow-hidden">{data.recent.map((document, index) => <Link to={`/app/documents/${document._id}`} key={document._id} className={`flex items-center gap-3 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/40 ${index ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}><div className="stat-icon"><Files size={18} /></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{document.title}</div><div className="mt-1 flex items-center gap-2 text-xs text-slate-400"><span className="capitalize">{document.documentType.replace(/-/g, ' ')}</span><span>-</span><span>v{document.currentVersion}</span><span>-</span><Clock3 size={12} />{new Date(document.updatedAt).toLocaleDateString()}</div></div><span className={`badge ${document.status === 'completed' ? 'badge-green' : 'badge-indigo'}`}>{document.status}</span><ArrowUpRight size={16} className="text-slate-300" /></Link>)}</div> : <EmptyState action={<Link className="btn btn-primary" to="/app/templates">Create first document</Link>} />}</section>
      <section><h2 className="mb-3 font-black">Review profile</h2><div className="panel p-5"><div className="flex items-center gap-5"><div className="risk-ring shrink-0" style={{ '--score': metrics.averageRisk ?? 0 }}><div>{metrics.averageRisk ?? 0}</div></div><div><div className="font-black">Average review attention</div><p className="mt-1 text-xs leading-5 text-slate-500">Higher values indicate more document points that may need a closer review.</p></div></div><div className="mt-5"><div className="mb-1 flex justify-between text-xs"><span className="font-bold">Readability</span><span>{metrics.averageReadability ?? 0}/100</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500" style={{ width: `${metrics.averageReadability ?? 0}%` }} /></div></div></div></section>
    </div>
  </div>;
}
