import React from 'react';
import { CheckCircle2, LockKeyhole, ShieldCheck, X } from 'lucide-react';

export default function LegalModal({ type, onClose }) {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {type === 'privacy' && 'Privacy Policy & Data Protection'}
            {type === 'terms' && 'Terms of Service'}
            {type === 'disclaimer' && 'Legal Information Disclaimer'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {type === 'privacy' && (
            <>
              {/* Highlighted Encryption Callout */}
              <div className="rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50/90 to-sky-50/80 p-4.5 dark:border-indigo-500/40 dark:from-indigo-950/40 dark:to-slate-900/60">
                <div className="flex flex-wrap items-center gap-2 font-black text-indigo-900 dark:text-indigo-200">
                  <LockKeyhole size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Field-Level AES-256-GCM Encryption at Rest</span>
                  <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    Database Protection
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-indigo-950/80 dark:text-indigo-200/90 font-medium">
                  All uploaded legal files, contract texts, versions, and vector chunks are mathematically encrypted using <b>authenticated AES-256-GCM</b> before being stored in the database. <b>Even system administrators or database owners cannot read your contracts in plaintext</b>—the database holds only unreadable ciphertext.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                  1. Ephemeral In-Memory Processing Only
                </h4>
                <p className="mt-1">
                  When you request an AI review, legal analysis, or export, your document is decrypted strictly in temporary memory (volatile RAM) for the few milliseconds needed to execute the operation. It is immediately purged from RAM once the response is returned. Raw document text is never written unencrypted to persistent disk.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                  2. Zero Public AI Training
                </h4>
                <p className="mt-1">
                  Your uploaded agreements, confidential business contracts, and custom drafts belong strictly and exclusively to you. We maintain an explicit zero-training policy: private user data is never used to train public or commercial AI models, nor is it ever sold or shared with external data brokers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                  3. PII Masking & In-Transit Security
                </h4>
                <p className="mt-1">
                  All network traffic is encrypted end-to-end via TLS 1.3 / SSL. Furthermore, LexSahayak includes automated PII redaction that can mask sensitive personal details (such as Aadhaar, PAN, emails, and phone numbers) before processing.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                  4. Complete Data Sovereignty & Irrevocable Deletion
                </h4>
                <p className="mt-1">
                  You retain complete intellectual property and legal ownership over every document. Whenever you delete a document from your workspace, all corresponding database records, version histories, and encrypted vector chunks are permanently erased from the server.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">1. Purpose of Service</h4>
                <p className="mt-1">
                  LexSahayak is a digital legal productivity and document automation platform designed to assist individuals, founders, and legal teams with drafting, clause inspection, and workflow management.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">2. Informational Assistance</h4>
                <p className="mt-1">
                  The analyses, summaries, and drafted templates provided by LexSahayak serve as assistive legal information. They do not constitute formal attorney-client representation. For high-stakes or specialized litigation, independent qualified counsel is advised.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">3. Responsible Use</h4>
                <p className="mt-1">
                  Users agree to only upload contracts and legal paperwork that they have the lawful authority to review and manage.
                </p>
              </div>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Legal Information, Not Legal Advice</h4>
                <p className="mt-1">
                  LexSahayak provides software tools for document analysis and standardized template generation. Use of this platform does not create an advocate-client relationship. Laws and statutory requirements vary across jurisdictions and change over time; always verify critical documents against current statutory regulations.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="btn btn-primary px-5 py-2.5 text-xs font-bold"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
