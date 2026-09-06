import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GitCompareArrows,
  LockKeyhole,
  Mail,
  MessageSquareQuote,
  Scale,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import LegalNotice from '../components/LegalNotice';
import LegalModal from '../components/LegalModal';

const features = [
  {
    icon: FileText,
    title: 'Smart Document Drafting',
    description: 'Draft tailored agreements, notices, and affidavits in minutes with vetted, customizable templates built for legal precision.'
  },
  {
    icon: SearchCheck,
    title: 'Automated Document Review',
    description: 'Instantly scan contracts to extract clauses, pinpoint critical obligations, and surface potential legal risks.'
  },
  {
    icon: MessageSquareQuote,
    title: 'Context-Aware Legal Assistant',
    description: 'Ask specific questions about complex contracts and receive clear, cited explanations in simple language.'
  },
  {
    icon: GitCompareArrows,
    title: 'Intelligent Version Control',
    description: 'Track changes across revisions, compare document iterations side-by-side, and preserve a clean audit history.'
  },
  {
    icon: LockKeyhole,
    title: 'Private & Secure Workspace',
    description: 'Keep your contracts, drafts, and client records organized in a centralized, encrypted legal repository.'
  },
  {
    icon: ShieldCheck,
    title: 'Professional Export & Sharing',
    description: 'Export execution-ready PDF and DOCX files or share view-only links with collaborators and clients seamlessly.'
  }
];

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-7xl items-center px-5 py-4">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="ml-auto flex items-center gap-3">
            <Link className="btn btn-secondary hidden sm:inline-flex" to="/login">
              Sign in
            </Link>
            <Link className="btn btn-primary" to="/register">
              Get started <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="hero-grid absolute inset-0 opacity-80" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
                <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                Intelligent Legal Workspace
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-[-.04em] sm:text-6xl">
                Draft, understand and manage <span className="gradient-text">legal documents.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                LexSahayak simplifies complex legal paperwork. Review contracts, draft customized agreements, and uncover hidden risks—all in one streamlined workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link className="btn btn-primary px-6 py-3.5 text-sm font-bold shadow-lg shadow-indigo-500/20" to="/explore/upload">
                  <UploadCloud size={18} /> Upload document
                </Link>
                <Link className="btn btn-secondary px-6 py-3.5 text-sm font-bold" to="/explore/draft">
                  <FileText size={18} /> Try drafting
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl gap-2.5 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-400">
                {[
                  'Instant clause extraction & analysis',
                  'Standard Indian legal templates',
                  'Plain-language risk alerts',
                  'AES-256 encrypted database at rest'
                ].map(item => (
                  <div className="flex items-center gap-2 font-medium" key={item}>
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Showcase UI Card */}
            <div className="panel overflow-hidden p-6 sm:p-7 border border-slate-200/80 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:shadow-none">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="stat-icon h-10 w-10 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Commercial_Lease_Agreement.pdf</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">PDF • 14 Pages • Verified format</div>
                  </div>
                </div>
                <span className="badge badge-green flex items-center gap-1.5 font-bold">
                  <span className="status-dot" /> Analysis ready
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Risk assessment</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Low Risk (94/100)</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '94%' }} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={14} /> Key clauses identified
                  </div>
                  <div className="mt-2.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span><b>Lock-in Period:</b> 12 months with standard 60-day exit notice</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span><b>Security Deposit:</b> 2-month refundable term upon peaceful handover</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span><b>Arbitration & Jurisdiction:</b> Sole arbitrator under Indian Arbitration Act</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Link to="/explore/upload" className="btn btn-primary flex-1 py-2.5 text-xs font-bold">
                  <UploadCloud size={15} /> Upload your document
                </Link>
                <Link to="/explore/draft" className="btn btn-secondary flex-1 py-2.5 text-xs font-bold">
                  <FileText size={15} /> Try drafting a document
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-2xl">
            <div className="text-sm font-black uppercase tracking-[.2em] text-indigo-500">ALL IN ONE PLACE</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A complete legal document workspace.</h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div className="feature-card dark:border-slate-800 dark:bg-slate-900/70" key={title}>
                <div className="stat-icon mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About LexSahayak Section */}
        <section className="border-t border-slate-100 bg-slate-50/60 py-20 dark:border-slate-800/80 dark:bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-5">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
                ABOUT LEXSAHAYAK
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                Making legal clarity accessible and reliable.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Legal documents shouldn’t be slow, opaque, or intimidating. LexSahayak was built to simplify everyday legal workflows—combining standard Indian legal formats with automated clause detection to help you review contracts, draft agreements, and detect risks with confidence.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="stat-icon mb-4">
                  <Scale size={20} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Plain-Language Transparency</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Break down complex legal clauses into straightforward, actionable insights with clear risk indicators.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="stat-icon mb-4">
                  <LockKeyhole size={20} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">AES-256 Database Encryption</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Every document is encrypted at rest using authenticated AES-256-GCM. Unreadable even to database administrators, and never used for public AI training.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="stat-icon mb-4">
                  <FileText size={20} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Vetted Legal Templates</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Access standard templates structured specifically around Indian legal conventions, acts, and jurisdiction norms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Notice Banner */}
        <section className="mx-auto max-w-4xl px-5 py-10">
          <LegalNotice />
        </section>
      </main>

      {/* Professional Company Footer */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-block">
                <Logo />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Intelligent legal document workspace designed to streamline contract review, automated drafting, and risk detection.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="status-dot" /> All systems operational
              </div>
            </div>

            {/* Product Column */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Product
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/explore/upload" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Document Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/explore/draft" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Contract Drafting
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Feature Workspace
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Client Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Trust & Legal Column */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Trust & Legal
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="text-left hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="text-left hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('disclaimer')}
                    className="text-left hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Legal Disclaimer
                  </button>
                </li>
                <li>
                  <span className="text-xs text-slate-400 dark:text-slate-500">256-Bit SSL Encrypted</span>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Support & Inquiries
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="mailto:s85319748@gmail.com"
                    className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <Mail size={14} /> s85319748@gmail.com
                  </a>
                </li>
                <li className="text-xs text-slate-500 dark:text-slate-400">
                  Contact us for assistance, technical inquiries, or enterprise questions.
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 text-xs text-slate-500 sm:flex-row dark:border-slate-800">
            <div>
              © {new Date().getFullYear()} LexSahayak Technologies. All rights reserved.
            </div>
            <div className="text-center sm:text-right">
              LexSahayak provides legal document assistance and information, not formal attorney representation.
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Humanized Legal Modal */}
      <LegalModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
