import { useState, useMemo } from 'react';
import { X, Search, Check, Copy, Plus, BookOpen, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { standardClauses } from '../data/clauseLibrary';

export default function ClauseLibraryModal({ isOpen, onClose, onInsertClause }) {
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Disputes', 'Risk', 'Commercial', 'Employment', 'General', 'Legal'];

  const filtered = useMemo(() => {
    return standardClauses.filter(c => {
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
      const matchQuery = !q.trim() || 
        c.title.toLowerCase().includes(q.toLowerCase()) || 
        c.summary.toLowerCase().includes(q.toLowerCase()) ||
        c.text.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [q, selectedCategory]);

  if (!isOpen) return null;

  async function handleCopy(clause) {
    await navigator.clipboard.writeText(clause.text);
    setCopiedId(clause.id);
    toast.success('Clause copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleInsert(clause) {
    if (onInsertClause) {
      onInsertClause(clause.text);
      toast.success(`Inserted "${clause.title}" into draft`);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="stat-icon">
              <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Indian Legal Clause Library</h2>
              <p className="text-xs text-slate-500">Standard, legally vetted clauses ready to insert into your agreement</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input has-search-icon py-2 text-xs"
              placeholder="Search clauses (e.g. arbitration, force majeure, indemnity, IP)..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clause List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching clauses found for "{q}".
            </div>
          ) : (
            filtered.map(clause => (
              <div
                key={clause.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">{clause.title}</h3>
                      <span className="badge badge-indigo text-[10px]">{clause.category}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{clause.summary}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(clause)}
                      className="btn btn-secondary py-1.5 px-2.5 text-xs"
                      title="Copy text"
                    >
                      {copiedId === clause.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span className="hidden sm:inline">{copiedId === clause.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    {onInsertClause && (
                      <button
                        type="button"
                        onClick={() => handleInsert(clause)}
                        className="btn btn-primary py-1.5 px-3 text-xs"
                      >
                        <Plus size={14} /> Insert
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 font-mono text-[11px] leading-5 text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {clause.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
