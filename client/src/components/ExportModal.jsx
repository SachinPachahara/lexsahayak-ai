import { useState } from 'react';
import { Download, FileText, X, Stamp } from 'lucide-react';
import { downloadDocument } from '../lib/api';
import toast from 'react-hot-toast';

export default function ExportModal({ isOpen, onClose, documentId, title = 'Document' }) {
  const [format, setFormat] = useState('pdf');
  const [watermark, setWatermark] = useState('');
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  async function handleExport() {
    setExporting(true);
    try {
      await downloadDocument(documentId, format, title, watermark);
      toast.success(`${format.toUpperCase()} downloaded successfully`);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  }

  const watermarkOptions = [
    { value: '', label: 'No Watermark (Clean Official Copy)', description: 'Standard document export without overlay' },
    { value: 'DRAFT', label: 'DRAFT Watermark', description: 'Diagonal DRAFT watermark across pages for review' },
    { value: 'CONFIDENTIAL', label: 'CONFIDENTIAL Watermark', description: 'Protects proprietary agreements and trade secrets' },
    { value: 'EXECUTED', label: 'EXECUTED Watermark', description: 'For signed agreements with attached digital execution seals' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="stat-icon h-9 w-9">
              <Download size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Export Legal Document</h2>
              <p className="text-xs text-slate-500">Select format and optional security watermark.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Format Selection */}
          <div>
            <label className="label">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  format === 'pdf'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                }`}
              >
                <FileText size={16} /> PDF Document
              </button>
              <button
                type="button"
                onClick={() => setFormat('docx')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  format === 'docx'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                }`}
              >
                <FileText size={16} /> Microsoft Word (.docx)
              </button>
            </div>
          </div>

          {/* Watermark Selection */}
          <div>
            <label className="label flex items-center gap-1">
              <Stamp size={13} className="text-indigo-500" /> Security Watermark Overlay
            </label>
            <div className="space-y-2">
              {watermarkOptions.map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                    watermark === opt.value
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500/70 dark:bg-indigo-950/40'
                      : 'border-slate-200/80 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850'
                  }`}
                >
                  <input
                    type="radio"
                    name="watermark"
                    value={opt.value}
                    checked={watermark === opt.value}
                    onChange={() => setWatermark(opt.value)}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{opt.label}</div>
                    <div className="text-[11px] text-slate-500">{opt.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary py-2 px-4 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={exporting}
            onClick={handleExport}
            className="btn btn-primary py-2 px-5 text-xs font-bold"
          >
            <Download size={15} /> {exporting ? 'Generating...' : `Export ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
