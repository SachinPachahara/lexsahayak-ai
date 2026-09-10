import { useState, useRef, useEffect } from 'react';
import { X, PenTool, Type, Upload, Eraser, Check, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function SignaturePadModal({ isOpen, onClose, documentId, onSigned }) {
  const [tab, setTab] = useState('draw'); // 'draw' | 'type' | 'upload'
  const [partyName, setPartyName] = useState('');
  const [partyRole, setPartyRole] = useState('First Party');
  const [typedSign, setTypedSign] = useState('');
  const [typedFont, setTypedFont] = useState('font-serif italic');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Canvas drawing handlers
  useEffect(() => {
    if (!isOpen || tab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e1b4b';

    // Clear canvas background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [isOpen, tab]);

  function startDrawing(e) {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e) {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawing.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image (PNG/JPG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!partyName.trim()) {
      toast.error('Please enter the signatory name');
      return;
    }

    let signatureData = '';
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      signatureData = canvas.toDataURL('image/png');
    } else if (tab === 'type') {
      if (!typedSign.trim()) {
        toast.error('Please type your signature');
        return;
      }
      // Render typed text to temporary offscreen canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = 400;
      offscreen.height = 140;
      const ctx = offscreen.getContext('2d');
      ctx.font = 'italic 34px "Brush Script MT", cursive, Georgia, serif';
      ctx.fillStyle = '#1e1b4b';
      ctx.fillText(typedSign.trim(), 20, 80);
      signatureData = offscreen.toDataURL('image/png');
    } else if (tab === 'upload') {
      if (!uploadedImage) {
        toast.error('Please select an image file');
        return;
      }
      signatureData = uploadedImage;
    }

    setSaving(true);
    try {
      const res = await api(`/documents/${documentId}/signatures`, {
        method: 'POST',
        body: { partyName, partyRole, signatureData }
      });
      toast.success('Document digitally signed!');
      if (onSigned) onSigned(res.signatures);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to sign document');
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="stat-icon">
              <PenTool size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Digital E-Signature</h2>
              <p className="text-xs text-slate-500">Sign with cryptographic timestamp and audit seal</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Signatory Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Signatory Name *</label>
              <input
                className="input text-xs"
                placeholder="Full Legal Name"
                required
                value={partyName}
                onChange={e => setPartyName(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Capacity / Role</label>
              <input
                className="input text-xs"
                placeholder="e.g. Landlord, Tenant, Client"
                value={partyRole}
                onChange={e => setPartyRole(e.target.value)}
              />
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setTab('draw')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                tab === 'draw' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              <PenTool size={13} /> Draw Sign
            </button>
            <button
              type="button"
              onClick={() => setTab('type')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                tab === 'type' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              <Type size={13} /> Type Sign
            </button>
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                tab === 'upload' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              <Upload size={13} /> Upload Image
            </button>
          </div>

          {/* Signature Area */}
          {tab === 'draw' && (
            <div className="space-y-2">
              <div className="relative rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-1 flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={140}
                  className="touch-none cursor-crosshair rounded-xl bg-white dark:bg-slate-950/60"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="absolute bottom-3 right-3 text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  <Eraser size={12} /> Clear
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center">Use your mouse or touchscreen to draw your signature</p>
            </div>
          )}

          {tab === 'type' && (
            <div className="space-y-3">
              <input
                className="input text-xs"
                placeholder="Type your name to generate signature..."
                value={typedSign}
                onChange={e => setTypedSign(e.target.value)}
              />
              <div className="h-28 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center p-4">
                <span className="font-serif italic text-3xl tracking-wide text-indigo-950 dark:text-indigo-200">
                  {typedSign || 'Your Signature Preview'}
                </span>
              </div>
            </div>
          )}

          {tab === 'upload' && (
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {uploadedImage && (
                <div className="h-28 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center p-2">
                  <img src={uploadedImage} alt="Uploaded signature" className="max-h-24 max-w-full object-contain" />
                </div>
              )}
            </div>
          )}

          {/* Audit Notice */}
          <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-300">
            <ShieldCheck size={16} className="shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <b>Indian Legal Compliance Seal:</b> Generates a unique verification stamp (<code className="font-mono text-[10px] bg-indigo-100 dark:bg-indigo-900 px-1 py-0.5 rounded">LX-SIGN-XXXX</code>) and embeds into the PDF export with signing timestamp.
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary text-xs">
              {saving ? 'Signing...' : <><Check size={15} /> Apply Signature</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
