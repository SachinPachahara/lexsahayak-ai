import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Calculator, ChevronRight, FilePlus2, Files, LayoutDashboard, LogOut, Menu, MessageSquareText, Moon, Settings, ShieldCheck, Sparkles, Sun, UploadCloud, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const navigation = [
  ['/app/dashboard', LayoutDashboard, 'Dashboard', true],
  ['/app/templates', FilePlus2, 'Create document'],
  ['/app/documents', Files, 'My documents'],
  ['/app/upload', UploadCloud, 'Analyze upload'],
  ['/app/stamp-duty', Calculator, 'Stamp Duty Tool'],
  ['/app/chat', MessageSquareText, 'Legal Assistant'],
  ['/app/settings', Settings, 'Settings']
];

function getBreadcrumb(pathname) {
  if (/^\/app\/generate\//.test(pathname)) return ['Create document', 'Draft details'];
  if (/^\/app\/documents\/[^/]+$/.test(pathname)) return ['My documents', 'Document workspace'];
  const labels = {
    '/app/dashboard': ['Dashboard'], '/app/templates': ['Create document'], '/app/documents': ['My documents'],
    '/app/upload': ['Analyze upload'], '/app/stamp-duty': ['Stamp Duty Tool'], '/app/chat': ['Legal Assistant'], '/app/settings': ['Settings'], '/app/admin': ['Administration']
  };
  return labels[pathname] || ['LexSahayak AI'];
}

export default function AppLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, theme, setTheme, updatePreferences } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const breadcrumbs = getBreadcrumb(pathname);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(open => !open);

  useEffect(() => {
    const handleKeyDown = event => { if (event.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function signOut() { await logout(); closeMenu(); navigate('/'); }
  async function toggleTheme() { const nextTheme = theme === 'dark' ? 'light' : 'dark'; setTheme(nextTheme); try { await updatePreferences({ theme: nextTheme }); } catch { /* The local choice remains available if the preference sync fails. */ } }
  const navClass = ({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`;

  return <div className="min-h-screen bg-app">
    <aside className={`sidebar ${isMenuOpen ? 'sidebar-open' : ''}`} aria-label="Application navigation">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo />
        <button type="button" className="icon-btn" onClick={closeMenu} aria-label="Close menu"><X size={20} /></button>
      </div>
      <nav className="space-y-1 px-3">
        {navigation.map(([to, Icon, label, end]) => <NavLink key={to} to={to} end={Boolean(end)} onClick={closeMenu} className={navClass}><Icon size={18} /><span>{label}</span>{label === 'Create document' && <Sparkles size={14} className="ml-auto opacity-60" />}</NavLink>)}
        {user?.role === 'admin' && <NavLink to="/app/admin" onClick={closeMenu} className={navClass}><ShieldCheck size={18} /><span>Admin control</span></NavLink>}
      </nav>
      <div className="mt-auto p-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{user?.name}</div><div className="truncate text-xs capitalize text-slate-500">{user?.role?.replace('_', ' ')}</div></div>
          <button type="button" className="icon-btn" onClick={signOut} aria-label="Sign out"><LogOut size={17} /></button>
        </div>
      </div>
    </aside>
    {isMenuOpen && <button type="button" className="fixed inset-0 z-30 bg-slate-950/40" onClick={closeMenu} aria-label="Close navigation" />}
    <main>
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 lg:px-7">
        <button type="button" className="icon-btn" onClick={toggleMenu} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen}><Menu size={20} /></button>
        <div className="hidden text-sm text-slate-500 sm:block">Secure workspace</div>{breadcrumbs.map((crumb, index) => <div className="flex items-center gap-3" key={crumb}><ChevronRight size={14} className="hidden text-slate-300 sm:block" /><div className={`text-sm ${index === breadcrumbs.length - 1 ? 'font-semibold' : 'hidden text-slate-500 sm:block'}`}>{crumb}</div></div>)}
        <div className="ml-auto flex items-center gap-2"><button type="button" className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button><span className="status-dot" /><span className="hidden text-xs font-semibold text-slate-500 sm:inline">Private session</span></div>
      </header>
      <div className="p-4 lg:p-7">{children || <Outlet />}</div>
    </main>
  </div>;
}
