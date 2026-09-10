import { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, Plus, Trash2, Check, 
  CalendarClock, ShieldAlert, BellRing 
} from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function MilestonesTab({ documentId, milestones = [], onReload }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('expiry');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function getDaysRemaining(targetDate) {
    const target = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async function handleAddMilestone(e) {
    e.preventDefault();
    if (!title.trim() || !date) {
      toast.error('Please provide a milestone title and date');
      return;
    }

    setSubmitting(true);
    try {
      await api(`/documents/${documentId}/milestones`, {
        method: 'POST',
        body: { title: title.trim(), date, type, notes: notes.trim() }
      });
      toast.success('Deadline tracked');
      setTitle('');
      setDate('');
      setNotes('');
      await onReload();
    } catch (err) {
      toast.error(err.message || 'Failed to add milestone');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(milestone) {
    const nextStatus = milestone.status === 'completed' ? 'upcoming' : 'completed';
    try {
      await api(`/documents/${documentId}/milestones/${milestone.id}`, {
        method: 'PATCH',
        body: { status: nextStatus }
      });
      toast.success(`Milestone marked ${nextStatus}`);
      await onReload();
    } catch (err) {
      toast.error(err.message || 'Failed to update milestone');
    }
  }

  async function removeMilestone(milestoneId) {
    if (!window.confirm('Delete this tracked deadline?')) return;
    try {
      await api(`/documents/${documentId}/milestones/${milestoneId}`, {
        method: 'DELETE'
      });
      toast.success('Milestone removed');
      await onReload();
    } catch (err) {
      toast.error(err.message || 'Failed to remove milestone');
    }
  }

  const typeConfig = {
    expiry: { label: 'Contract Expiry', badge: 'badge-red', icon: ShieldAlert },
    renewal_notice: { label: 'Renewal Notice Deadline', badge: 'badge-amber', icon: BellRing },
    lock_in: { label: 'Lock-in Period', badge: 'badge-indigo', icon: Clock },
    payment: { label: 'Payment / Deposit', badge: 'badge-green', icon: Calendar },
    milestone: { label: 'Deliverable / Milestone', badge: 'badge-indigo', icon: CalendarClock },
    other: { label: 'Important Date', badge: 'badge-amber', icon: Calendar }
  };

  const overdueCount = milestones.filter(m => m.status !== 'completed' && getDaysRemaining(m.date) < 0).length;
  const upcomingCount = milestones.filter(m => m.status === 'upcoming' && getDaysRemaining(m.date) >= 0).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
      <div className="space-y-4">
        {/* Metric summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="panel p-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deadlines</div>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{milestones.length}</div>
          </div>
          <div className="panel p-4">
            <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Upcoming</div>
            <div className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">{upcomingCount}</div>
          </div>
          <div className="panel p-4 col-span-2 sm:col-span-1">
            <div className="text-xs font-bold text-rose-500 uppercase tracking-wider">Overdue / Action Needed</div>
            <div className="mt-1 text-2xl font-black text-rose-600 dark:text-rose-400">{overdueCount}</div>
          </div>
        </div>

        {/* Milestone Cards */}
        {milestones.length === 0 ? (
          <div className="panel p-10 text-center space-y-3">
            <div className="mx-auto stat-icon h-12 w-12">
              <CalendarClock size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No contract deadlines tracked yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Never miss a contract expiry, renewal notice window, lock-in date, or key deliverable. Add your first milestone using the form on the right.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {milestones.map(m => {
              const days = getDaysRemaining(m.date);
              const isOverdue = days < 0 && m.status !== 'completed';
              const cfg = typeConfig[m.type] || typeConfig.other;
              const Icon = cfg.icon;

              return (
                <div
                  key={m.id}
                  className={`panel p-4 transition-all ${
                    m.status === 'completed'
                      ? 'opacity-70 bg-slate-50/50 dark:bg-slate-900/30'
                      : isOverdue
                      ? 'border-rose-300/80 bg-rose-50/20 dark:border-rose-900/60'
                      : 'border-slate-200/90 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`stat-icon h-10 w-10 shrink-0 ${isOverdue ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' : ''}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm font-bold ${m.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            {m.title}
                          </h4>
                          <span className={`badge ${cfg.badge} text-[10px]`}>{cfg.label}</span>
                          {m.status === 'completed' && (
                            <span className="badge badge-green text-[10px]">Completed</span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span>•</span>
                          {m.status === 'completed' ? (
                            <span className="text-emerald-600 font-semibold">Done</span>
                          ) : isOverdue ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <AlertCircle size={12} /> Overdue by {Math.abs(days)} {Math.abs(days) === 1 ? 'day' : 'days'}
                            </span>
                          ) : days === 0 ? (
                            <span className="text-amber-600 font-bold">Due today</span>
                          ) : (
                            <span className="text-indigo-600 font-bold">
                              {days} {days === 1 ? 'day' : 'days'} remaining
                            </span>
                          )}
                        </div>

                        {m.notes && (
                          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            {m.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleStatus(m)}
                        className="btn btn-secondary py-1 px-2.5 text-xs"
                        title={m.status === 'completed' ? 'Reopen deadline' : 'Mark as done'}
                      >
                        <Check size={13} className={m.status === 'completed' ? 'text-emerald-500' : ''} />
                        {m.status === 'completed' ? 'Reopen' : 'Done'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMilestone(m.id)}
                        className="icon-btn h-8 w-8 text-slate-400 hover:text-rose-500"
                        title="Delete milestone"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Milestone Form */}
      <div>
        <form onSubmit={handleAddMilestone} className="panel p-5 space-y-3.5 sticky top-20">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
            <CalendarClock size={17} className="text-indigo-600 dark:text-indigo-400" />
            Track Contract Deadline
          </div>
          <p className="text-xs text-slate-500">
            Set calendar milestones to track contract expiry dates, renewal notice periods, and lock-in windows.
          </p>

          <div>
            <label className="label">Milestone Title *</label>
            <input
              type="text"
              className="input text-xs"
              placeholder="e.g. Agreement Expiry, 60-Day Renewal Notice"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Milestone Type</label>
            <select
              className="input text-xs py-2 cursor-pointer"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="expiry">Contract Expiry Date</option>
              <option value="renewal_notice">Renewal Notice Deadline</option>
              <option value="lock_in">Lock-in Period Expiry</option>
              <option value="payment">Payment / Security Deposit Due</option>
              <option value="milestone">Deliverable / Performance Milestone</option>
              <option value="other">Other Important Date</option>
            </select>
          </div>

          <div>
            <label className="label">Deadline Date *</label>
            <input
              type="date"
              className="input text-xs"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Action Notes (Optional)</label>
            <textarea
              className="input text-xs min-h-20"
              placeholder="e.g. Send formal renewal letter to counterparty before notice cutoff..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full text-xs font-bold"
          >
            <Plus size={15} /> {submitting ? 'Saving...' : 'Add Deadline Reminder'}
          </button>
        </form>
      </div>
    </div>
  );
}
