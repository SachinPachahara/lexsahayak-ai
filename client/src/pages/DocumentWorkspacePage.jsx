import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Save, Sparkles, Download, FileType2, MessageSquareText, 
  History, ScanSearch, ShieldAlert, CheckCircle2, GitCompareArrows, 
  Share2, RefreshCw, WandSparkles, PenTool, MessageSquare, BookOpen, 
  Trash2, Plus, Check, ShieldCheck, Clock, CalendarClock, Languages 
} from 'lucide-react';
import { api, downloadDocument } from '../lib/api';
import LegalNotice from '../components/LegalNotice';
import SignaturePadModal from '../components/SignaturePadModal';
import ClauseLibraryModal from '../components/ClauseLibraryModal';
import ExportModal from '../components/ExportModal';
import MilestonesTab from '../components/MilestonesTab';

const tabs = [
  ['editor', 'Editor', FileType2],
  ['signatures', 'E-Signatures', PenTool],
  ['comments', 'Review Notes', MessageSquare],
  ['milestones', 'Deadlines & Expiry', CalendarClock],
  ['analysis', 'AI Review', ScanSearch],
  ['chat', 'Document Chat', MessageSquareText],
  ['versions', 'Versions', History]
];

export default function DocumentWorkspacePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('editor');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isClauseModalOpen, setIsClauseModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  async function load() {
    const d = await api(`/documents/${id}`);
    setData(d);
    setContent(d.document.content);
  }

  useEffect(() => {
    load().catch(e => toast.error(e.message));
  }, [id]);

  async function save() {
    setSaving(true);
    try {
      await api(`/documents/${id}`, {
        method: 'PATCH',
        body: { content, structuredData: data.document.structuredData || {}, changeNote: 'Workspace edit' }
      });
      toast.success('Saved as a new version');
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function share() {
    try {
      const d = await api(`/documents/${id}/share`, { method: 'POST', body: { expiresDays: 7 } });
      const url = `${location.origin}/share/${d.token}`;
      await navigator.clipboard.writeText(url);
      toast.success('7-day read-only link copied');
    } catch (e) {
      toast.error(e.message);
    }
  }

  function handleInsertClause(clauseText) {
    setContent(prev => `${prev.trim()}\n\n${clauseText.trim()}\n`);
  }

  if (!data) return <div className="panel p-8"><div className="spinner" /></div>;
  const doc = data.document;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/app/documents" className="icon-btn" aria-label="Back to Documents">
          <ArrowLeft size={19} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl font-black tracking-tight">{doc.title}</h1>
            <span className="badge badge-indigo">v{doc.currentVersion}</span>
            {doc.signatures?.length > 0 && (
              <span className="badge badge-green text-[11px] flex items-center gap-1">
                <ShieldCheck size={12} /> {doc.signatures.length} Signed
              </span>
            )}
          </div>
          <div className="mt-1 text-xs capitalize text-slate-500">
            {doc.documentType.replace(/-/g, ' ')} · {doc.source} · updated {new Date(doc.updatedAt).toLocaleString()}
          </div>
        </div>

        <button type="button" className="btn btn-secondary" onClick={share}>
          <Share2 size={16} /> Share
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIsExportModalOpen(true)}
        >
          <Download size={16} /> Export Document
        </button>
        <button type="button" className="btn btn-primary" onClick={save} disabled={saving || content === doc.content}>
          <Save size={16} /> {saving ? 'Saving…' : 'Save version'}
        </button>
      </div>

      <LegalNotice />

      {/* Tabs Navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900">
        {tabs.map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`btn shrink-0 py-2 text-xs font-bold ${
              tab === key ? 'btn-primary' : 'bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon size={15} />
            {label}
            {key === 'signatures' && doc.signatures?.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px]">
                {doc.signatures.length}
              </span>
            )}
            {key === 'comments' && doc.comments?.filter(c => c.status === 'open').length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px]">
                {doc.comments.filter(c => c.status === 'open').length}
              </span>
            )}
            {key === 'milestones' && doc.milestones?.filter(m => m.status === 'upcoming' || m.status === 'overdue').length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 text-[10px]">
                {doc.milestones.filter(m => m.status === 'upcoming' || m.status === 'overdue').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {tab === 'editor' && (
        <div className="grid gap-6 xl:grid-cols-[1fr_310px]">
          <div className="panel p-3 sm:p-5 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Document Canvas</span>
              <button
                type="button"
                onClick={() => setIsClauseModalOpen(true)}
                className="btn btn-secondary py-1.5 px-3 text-xs"
              >
                <BookOpen size={14} className="text-indigo-600 dark:text-indigo-400" /> Clause Library
              </button>
            </div>
            <div className="doc-paper">
              <textarea
                className="doc-editor"
                value={content}
                onChange={e => setContent(e.target.value)}
                aria-label="Document editor"
              />
            </div>
          </div>
          <ClauseTool />
        </div>
      )}

      {tab === 'signatures' && (
        <SignaturesTab
          documentId={id}
          signatures={doc.signatures || []}
          onOpenModal={() => setIsSignModalOpen(true)}
          onReload={load}
        />
      )}

      {tab === 'comments' && (
        <CommentsTab
          documentId={id}
          comments={doc.comments || []}
          onReload={load}
        />
      )}

      {tab === 'milestones' && (
        <MilestonesTab
          documentId={id}
          milestones={doc.milestones || []}
          onReload={load}
        />
      )}

      {tab === 'analysis' && <AnalysisTab data={data} id={id} onDone={load} />}
      {tab === 'chat' && <DocumentChat documentId={id} />}
      {tab === 'versions' && <VersionsTab id={id} versions={data.versions || []} />}

      {/* Modals */}
      <SignaturePadModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        documentId={id}
        onSigned={() => load()}
      />

      <ClauseLibraryModal
        isOpen={isClauseModalOpen}
        onClose={() => setIsClauseModalOpen(false)}
        onInsertClause={handleInsertClause}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentId={id}
        title={doc.title}
      />
    </div>
  );
}

/* --- Signatures Tab --- */
function SignaturesTab({ documentId, signatures, onOpenModal, onReload }) {
  async function removeSignature(sigId) {
    if (!window.confirm('Are you sure you want to remove this signature?')) return;
    try {
      await api(`/documents/${documentId}/signatures/${sigId}`, { method: 'DELETE' });
      toast.success('Signature removed');
      await onReload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <PenTool size={20} className="text-indigo-500" /> Digital E-Signatures & Audit Trail
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Signatures applied here are cryptographically verified and attached to exported PDFs with timestamp seals.
          </p>
        </div>
        <button type="button" onClick={onOpenModal} className="btn btn-primary">
          <Plus size={16} /> Sign Document
        </button>
      </div>

      {signatures.length === 0 ? (
        <div className="panel p-12 text-center space-y-3">
          <div className="mx-auto stat-icon">
            <PenTool size={22} className="text-indigo-500" />
          </div>
          <h3 className="text-base font-black text-slate-800 dark:text-slate-200">No Signatures Attached Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Draw, type, or upload signatures for all parties. Verified signatures will appear directly on this agreement.
          </p>
          <button type="button" onClick={onOpenModal} className="btn btn-secondary mt-2">
            Add First Signature
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {signatures.map(sig => (
            <div
              key={sig._id}
              className="panel p-5 space-y-4 border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white">{sig.partyName}</span>
                    <span className="badge badge-indigo text-[10px]">{sig.partyRole || 'Signatory'}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(sig.signedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSignature(sig._id)}
                  className="icon-btn text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Remove signature"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Signature visual preview */}
              <div className="h-24 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-2 flex items-center justify-center">
                <img src={sig.signatureData} alt={`Signature of ${sig.partyName}`} className="max-h-20 max-w-full object-contain" />
              </div>

              {/* Audit Badge */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stamp Code:</span>
                  <code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{sig.verificationCode}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Tamper-Evident
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Review Notes / Comments Tab --- */
function CommentsTab({ documentId, comments, onReload }) {
  const [noteText, setNoteText] = useState('');
  const [clauseRef, setClauseRef] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setLoading(true);
    try {
      await api(`/documents/${documentId}/comments`, {
        method: 'POST',
        body: { text: noteText, clauseReference: clauseRef }
      });
      setNoteText('');
      setClauseRef('');
      toast.success('Review note added');
      await onReload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(comment) {
    const next = comment.status === 'open' ? 'resolved' : 'open';
    try {
      await api(`/documents/${documentId}/comments/${comment.id}`, {
        method: 'PATCH',
        body: { status: next }
      });
      toast.success(`Marked as ${next}`);
      await onReload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeNote(commentId) {
    try {
      await api(`/documents/${documentId}/comments/${commentId}`, { method: 'DELETE' });
      toast.success('Review note deleted');
      await onReload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      {/* Existing Notes List */}
      <div className="space-y-4">
        <div className="panel p-5 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-500" /> Collaboration & Review Notes
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {comments.filter(c => c.status === 'open').length} Open · {comments.filter(c => c.status === 'resolved').length} Resolved
          </span>
        </div>

        {comments.length === 0 ? (
          <div className="panel p-10 text-center text-sm text-slate-400">
            No review notes yet. Add your first note using the panel on the right.
          </div>
        ) : (
          comments.map(c => (
            <div
              key={c.id}
              className={`panel p-4 space-y-2 transition border ${
                c.status === 'resolved'
                  ? 'opacity-65 border-slate-200 dark:border-slate-800'
                  : 'border-indigo-100 dark:border-indigo-900/60 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">{c.authorName}</span>
                  {c.clauseReference && (
                    <span className="badge badge-indigo text-[10px]">{c.clauseReference}</span>
                  )}
                  <span className={`badge text-[10px] ${c.status === 'resolved' ? 'badge-green' : 'badge-amber'}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleStatus(c)}
                    className="btn btn-secondary py-1 px-2 text-[11px]"
                    title={c.status === 'open' ? 'Mark resolved' : 'Reopen note'}
                  >
                    {c.status === 'open' ? <><Check size={12} /> Resolve</> : 'Reopen'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNote(c.id)}
                    className="icon-btn h-7 w-7 text-slate-400 hover:text-rose-500"
                    title="Delete note"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className={`text-xs leading-relaxed ${c.status === 'resolved' ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                {c.text}
              </p>
              <div className="text-[10px] text-slate-400">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Note Form */}
      <div>
        <form onSubmit={handleAddNote} className="panel p-5 space-y-3 sticky top-20">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Add Review Note</h3>
          <p className="text-xs text-slate-500">Tag clauses or leave revision reminders for co-drafters.</p>

          <div>
            <label className="label">Clause / Section Tag (Optional)</label>
            <input
              className="input text-xs py-1.5"
              placeholder="e.g. Clause 4 (Deposit), Section 8"
              value={clauseRef}
              onChange={e => setClauseRef(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Note Details *</label>
            <textarea
              className="input text-xs min-h-28"
              placeholder="e.g. Check lock-in period with landlord before signing..."
              required
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full text-xs">
            {loading ? 'Adding...' : 'Post Note'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* --- Clause Lab Tool --- */
function ClauseTool() {
  const [clause, setClause] = useState('');
  const [mode, setMode] = useState('explain');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function run() {
    if (clause.trim().length < 3) return;
    setLoading(true);
    try {
      const d = await api('/documents/clause', { method: 'POST', body: { clause, mode } });
      setResult(d.result);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="space-y-4">
      <div className="panel p-4">
        <div className="flex items-center gap-2 font-black">
          <WandSparkles size={17} className="text-indigo-500" /> Clause Lab
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Paste a clause to explain or improve it without changing your document automatically.
        </p>
        <textarea
          className="input mt-4 min-h-36 text-xs"
          placeholder="Paste one clause…"
          value={clause}
          onChange={e => setClause(e.target.value)}
        />
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <button
            type="button"
            className={`btn text-[11px] px-1 py-1.5 font-bold ${mode === 'explain' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('explain')}
          >
            Explain
          </button>
          <button
            type="button"
            className={`btn text-[11px] px-1 py-1.5 font-bold ${mode === 'hindi_summary' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('hindi_summary')}
          >
            हिंदी सारांश
          </button>
          <button
            type="button"
            className={`btn text-[11px] px-1 py-1.5 font-bold ${mode === 'improve' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('improve')}
          >
            Improve
          </button>
        </div>
        <button
          type="button"
          className="btn btn-secondary mt-2 w-full text-xs"
          disabled={loading || !clause.trim()}
          onClick={run}
        >
          {loading ? 'Working…' : 'Run Clause AI'}
        </button>
        {result && (
          <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-xs leading-6 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            {result}
          </div>
        )}
      </div>
    </aside>
  );
}

/* --- Existing AnalysisTab, ScoreCard, ListPanel, DocumentChat, VersionsTab --- */
function AnalysisTab({ data, id, onDone }) {
  const [loading, setLoading] = useState(false);
  const [hindiSummary, setHindiSummary] = useState('');
  const [translatingHindi, setTranslatingHindi] = useState(false);
  const [showHindi, setShowHindi] = useState(false);
  const a = data.analysis;

  async function toggleHindi() {
    if (!showHindi && !hindiSummary && a?.summary) {
      setTranslatingHindi(true);
      try {
        const res = await api('/documents/clause', {
          method: 'POST',
          body: { clause: a.summary, mode: 'hindi_summary' }
        });
        setHindiSummary(res.result);
        setShowHindi(true);
      } catch (err) {
        toast.error('Could not generate Hindi summary');
      } finally {
        setTranslatingHindi(false);
      }
    } else {
      setShowHindi(prev => !prev);
    }
  }

  async function analyze() {
    setLoading(true);
    try {
      await api(`/documents/${id}/analyze`, { method: 'POST' });
      toast.success('AI review completed');
      await onDone();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!a) {
    return (
      <div className="panel grid min-h-96 place-items-center p-8 text-center">
        <div>
          <div className="mx-auto stat-icon"><ScanSearch /></div>
          <h3 className="mt-4 text-xl font-black">No AI review yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Analyze this version for summary, obligations, missing clauses, contradictions, financial terms, readability and review-attention signals.
          </p>
          <button className="btn btn-primary mt-5" onClick={analyze} disabled={loading}>
            <Sparkles size={16} />{loading ? 'Analyzing…' : 'Run AI review'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button className="btn btn-secondary" onClick={analyze} disabled={loading}>
          <RefreshCw size={15} />{loading ? 'Analyzing…' : 'Re-run review'}
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard label="Review attention" value={a.riskScore} tone="amber" />
        <ScoreCard label="Readability" value={a.readabilityScore} tone="indigo" />
        <ScoreCard label="AI confidence" value={Math.round((a.confidence || 0) * 100)} tone="green" suffix="%" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="panel p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black">Executive summary</h3>
            <button
              type="button"
              onClick={toggleHindi}
              disabled={translatingHindi}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300"
            >
              <Languages size={13} />
              {translatingHindi ? 'अनुवाद हो रहा है...' : showHindi ? 'Show English' : 'सरल हिंदी सारांश'}
            </button>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
            {showHindi ? hindiSummary : a.summary}
          </p>
        </section>
        <section className="panel p-5">
          <h3 className="font-black">Detected financial terms & dates</h3>
          <div className="mt-3 space-y-2">
            {[...(a.financialTerms || []), ...(a.importantDates || [])].length ? (
              [...(a.financialTerms || []), ...(a.importantDates || [])].map((x, i) => (
                <div key={i} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                  <span className="text-slate-500">{x.label}</span><b>{x.value}</b>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No structured values were confidently extracted.</p>
            )}
          </div>
        </section>
      </div>
      <section className="panel p-5">
        <h3 className="flex items-center gap-2 font-black">
          <ShieldAlert size={18} className="text-amber-500" /> Potential review signals
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(a.risks || []).length ? (
            a.risks.map((r, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`badge ${r.severity === 'high' ? 'badge-red' : r.severity === 'medium' ? 'badge-amber' : 'badge-green'}`}>
                    {r.severity}
                  </span>
                  <b className="text-sm capitalize">{r.type}</b>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{r.message}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 size={17} /> No heuristic/AI risk signals were returned.
            </div>
          )}
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-2">
        <ListPanel title="Missing / unclear clauses" items={(a.missingClauses || []).map(x => ({ title: x.name, text: x.reason, badge: x.severity }))} />
        <ListPanel title="Obligations & action points" items={(a.obligations || []).map(x => ({ title: x.party || 'Party', text: x.obligation, badge: x.due }))} />
      </div>
      {a.contradictions?.length > 0 && (
        <ListPanel title="Potential contradictions" items={a.contradictions.map(x => ({ title: x.left, text: `${x.right} — ${x.explanation}` }))} />
      )}
    </div>
  );
}

function ScoreCard({ label, value = 0, suffix = '/100', tone }) {
  const colors = { amber: 'from-amber-500 to-orange-500', indigo: 'from-indigo-500 to-cyan-500', green: 'from-emerald-500 to-teal-500' };
  return (
    <div className="panel p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black">{value}{suffix}</div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full bg-gradient-to-r ${colors[tone]}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function ListPanel({ title, items }) {
  return (
    <section className="panel p-5">
      <h3 className="font-black">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.map((x, i) => (
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60" key={i}>
              <div className="flex items-center justify-between gap-3">
                <b className="text-sm">{x.title}</b>{x.badge && <span className="badge">{x.badge}</span>}
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{x.text}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">Nothing returned for this category.</p>
        )}
      </div>
    </section>
  );
}

function DocumentChat({ documentId }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Ask a factual question about this document. I will retrieve only chunks from this document before answering.' }]);
  const [q, setQ] = useState('');
  const [conversationId, setConversationId] = useState();
  const [loading, setLoading] = useState(false);

  async function send(e) {
    e.preventDefault();
    if (!q.trim()) return;
    const question = q;
    setQ('');
    setMessages(m => [...m, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const d = await api('/chat', { method: 'POST', body: { question, documentId, conversationId } });
      setConversationId(d.conversationId);
      setMessages(m => [...m, { role: 'assistant', content: d.answer, citations: d.citations, confidence: d.confidence }]);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-2 font-black">
          <MessageSquareText size={18} className="text-indigo-500" /> Private document RAG
        </div>
        <p className="mt-1 text-xs text-slate-500">Authorization filtering happens before retrieval reaches the AI model.</p>
      </div>
      <div className="min-h-[440px] space-y-4 p-4 sm:p-6">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === 'user' ? 'chat-user' : 'chat-ai'}`}>
            {m.content}
            {m.citations?.length > 0 && (
              <div className="mt-3 border-t border-slate-300/30 pt-2 text-[11px]">
                <b>Sources:</b>
                {m.citations.map(c => (
                  <div key={c.chunkId} className="mt-1">[{c.label}] {c.citation || 'Document chunk'} · match {Math.round((c.score || 0) * 100)}%</div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="chat-bubble chat-ai">Retrieving authorized context…</div>}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
        <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="What is the termination notice period?" />
        <button className="btn btn-primary" disabled={loading}>Ask</button>
      </form>
    </div>
  );
}

function VersionsTab({ id, versions }) {
  const sorted = [...versions].sort((a, b) => a.version - b.version);
  const [from, setFrom] = useState(sorted.at(-2)?.version || 1);
  const [to, setTo] = useState(sorted.at(-1)?.version || 1);
  const [compare, setCompare] = useState(null);

  useEffect(() => {
    setFrom(sorted.at(-2)?.version || 1);
    setTo(sorted.at(-1)?.version || 1);
  }, [versions.length]);

  async function run() {
    try {
      setCompare(await api(`/documents/${id}/compare?from=${from}&to=${to}`));
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
      <div className="panel p-5">
        <h3 className="flex items-center gap-2 font-black">
          <History size={18} /> Immutable version trail
        </h3>
        <div className="mt-4 space-y-2">
          {[...versions].sort((a, b) => b.version - a.version).map(v => (
            <div key={v.version} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex justify-between">
                <b>Version {v.version}</b>
                <span className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{v.changeNote}</div>
              <code className="mt-2 block truncate text-[10px] text-indigo-500">{v.contentHash}</code>
            </div>
          ))}
        </div>
      </div>
      <div className="panel p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label">From version</label>
            <select className="input w-40" value={from} onChange={e => setFrom(Number(e.target.value))}>
              {sorted.map(v => <option key={v.version} value={v.version}>v{v.version}</option>)}
            </select>
          </div>
          <div>
            <label className="label">To version</label>
            <select className="input w-40" value={to} onChange={e => setTo(Number(e.target.value))}>
              {sorted.map(v => <option key={v.version} value={v.version}>v{v.version}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={run} disabled={from === to}>
            <GitCompareArrows size={16} /> Compare
          </button>
        </div>
        {compare ? (
          <div className="mt-5 rounded-2xl border border-slate-200 p-4 font-mono text-xs leading-6 dark:border-slate-800">
            {compare.changes.map((p, i) => (
              <span
                key={i}
                className={
                  p.added
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                    : p.removed
                    ? 'bg-rose-100 text-rose-900 line-through dark:bg-rose-950 dark:text-rose-300'
                    : ''
                }
              >
                {p.value}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-sm text-slate-500">
            Choose two versions to visualize line-level changes.
          </div>
        )}
      </div>
    </div>
  );
}
