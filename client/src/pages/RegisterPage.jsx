import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthShell } from './LoginPage';

export default function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ name: '', email: '', password: '', locale: 'en' }); const [loading, setLoading] = useState(false);
  const set = (key, value) => setForm({ ...form, [key]: value });
  async function submit(event) { event.preventDefault(); setLoading(true); try { const result = await register(form); toast.success('Account created'); if (result.verificationRequired) { toast.success('Verify your email, then sign in'); navigate('/login'); } else navigate('/app'); } catch (error) { toast.error(error.details?.[0]?.message || error.message); } finally { setLoading(false); } }
  return <AuthShell title="Create your workspace" subtitle="Store, prepare and review your legal documents in one place."><form onSubmit={submit} className="space-y-4"><div><label className="label">Full name</label><input className="input" required minLength={2} value={form.name} onChange={event => set('name', event.target.value)}/></div><div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={event => set('email', event.target.value)}/></div><div><label className="label">Password</label><input className="input" type="password" minLength={10} required value={form.password} onChange={event => set('password', event.target.value)}/><p className="mt-1 text-[11px] text-slate-400">10+ characters with uppercase, lowercase and a number.</p></div><div><label className="label">Preferred language</label><select className="input" value={form.locale} onChange={event => set('locale', event.target.value)}><option value="en">English</option><option value="hi">Hindi</option></select></div><button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating…' : <>Create account <ArrowRight size={16}/></>}</button><p className="text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-indigo-500" to="/login">Sign in</Link></p></form></AuthShell>;
}
