import { useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, LockKeyhole, Mail, Palette, Scale, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LegalModal from '../components/LegalModal';

function Info({ label, value }) {
  return <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60"><div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm font-black capitalize">{value}</div></div>;
}

export default function SettingsPage() {
  const { user, theme, setTheme, updatePreferences } = useAuth();
  const [prefs, setPrefs] = useState({ theme, redactPIIForAI: user?.preferences?.redactPIIForAI !== false, locale: user?.locale || 'en' });
  const [loading, setLoading] = useState(false);
  const [legalModal, setLegalModal] = useState(null);

  function changeTheme(nextTheme) { setPrefs({ ...prefs, theme: nextTheme }); setTheme(nextTheme); }
  async function save() { setLoading(true); try { await updatePreferences(prefs); toast.success('Preferences saved'); } catch (error) { toast.error(error.message); } finally { setLoading(false); } }

  return <div className="space-y-6">
    <div><div className="text-sm font-black text-indigo-500">WORKSPACE SETTINGS</div><h1 className="mt-1 text-3xl font-black tracking-tight">Settings</h1></div>
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="panel p-5"><div className="flex items-center gap-2 font-black"><LockKeyhole size={18} className="text-indigo-500"/> Privacy</div><p className="mt-2 text-sm leading-6 text-slate-500">Mask common personal details before document text is processed. Your saved document remains unchanged.</p><label className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60"><div><b className="text-sm">Mask personal information</b><div className="mt-1 text-xs text-slate-500">Email · phone · PAN · Aadhaar pattern</div></div><input type="checkbox" className="h-5 w-5 accent-indigo-600" checked={prefs.redactPIIForAI} onChange={event => setPrefs({ ...prefs, redactPIIForAI: event.target.checked })}/></label></section>
      <section className="panel p-5"><div className="flex items-center gap-2 font-black"><Palette size={18} className="text-indigo-500"/> Appearance</div><div className="mt-4"><label className="label">Theme</label><select className="input" value={prefs.theme} onChange={event => changeTheme(event.target.value)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></div><div className="mt-4"><label className="label">Default AI response language</label><p className="mt-1 text-xs text-slate-500">Changes AI answers only. The platform interface remains in English.</p><select className="input mt-2" value={prefs.locale} onChange={event => setPrefs({ ...prefs, locale: event.target.value })}><option value="en">English</option><option value="hi">Hindi</option></select></div></section>
    </div>
    <section className="panel p-5"><div className="flex items-center gap-2 font-black"><ShieldCheck size={18} className="text-emerald-500"/> Account security</div><div className="mt-4 grid gap-3 sm:grid-cols-3"><Info label="Role" value={user?.role?.replace('_', ' ')}/><Info label="Email verification" value={user?.verified ? 'Verified' : 'Not verified'}/><Info label="Session" value="Secure session"/></div></section>
    <section className="panel p-5">
      <div className="flex items-center gap-2 font-black"><ShieldCheck size={18} className="text-indigo-500"/> Trust & Legal Policies</div>
      <p className="mt-2 text-sm leading-6 text-slate-500">Review LexSahayak data protection commitments, zero public AI training policies, and platform terms anytime.</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <button type="button" onClick={() => setLegalModal('privacy')} className="btn btn-secondary text-xs"><ShieldCheck size={14} className="text-emerald-500"/> Privacy Policy</button>
        <button type="button" onClick={() => setLegalModal('terms')} className="btn btn-secondary text-xs"><FileText size={14} className="text-indigo-500"/> Terms of Service</button>
        <button type="button" onClick={() => setLegalModal('disclaimer')} className="btn btn-secondary text-xs"><Scale size={14} className="text-amber-500"/> Legal Disclaimer</button>
      </div>
    </section>
    <section className="panel p-5"><div className="flex items-center gap-2 font-black"><Mail size={18} className="text-indigo-500"/> Contact support</div><p className="mt-2 text-sm text-slate-500">Need help with LexSahayak? Reach out by email.</p><a className="mt-3 inline-flex font-bold text-indigo-500 hover:underline" href="mailto:s85319748@gmail.com">s85319748@gmail.com</a></section>
    <button className="btn btn-primary" onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save settings'}</button>
    <LegalModal type={legalModal} onClose={() => setLegalModal(null)}/>
  </div>;
}
