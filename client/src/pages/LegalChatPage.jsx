import { useState } from 'react';
import toast from 'react-hot-toast';
import { BookOpenCheck, MessageSquareText, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import LegalNotice from '../components/LegalNotice';

export default function LegalChatPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Ask a legal question. I will check the workspace knowledge base first, then clearly label any general AI answer.' }]);
  const [q, setQ] = useState('');
  const [conversationId, setConversationId] = useState();
  const [loading, setLoading] = useState(false);

  async function send(event) {
    event.preventDefault();
    if (!q.trim()) return;
    const question = q;
    setQ('');
    setMessages(items => [...items, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const result = await api('/chat', { method: 'POST', body: { question, conversationId } });
      setConversationId(result.conversationId);
      setMessages(items => [...items, { role: 'assistant', content: result.answer, citations: result.citations, answerSource: result.answerSource }]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return <div className="space-y-6">
    <div><div className="text-sm font-black text-indigo-500">LEGAL ASSISTANT</div><h1 className="mt-1 text-3xl font-black tracking-tight">Legal Assistant</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Answers use workspace reference materials first. When no relevant material is available, general AI information is clearly labelled.</p></div>
    <LegalNotice/>
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="panel overflow-hidden">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800"><div className="flex items-center gap-2 font-black"><MessageSquareText size={18} className="text-indigo-500"/> Legal Assistant</div></div>
        <div className="min-h-[500px] space-y-4 p-4 sm:p-6">
          {messages.map((message, index) => <div key={index} className={`chat-bubble ${message.role === 'user' ? 'chat-user' : 'chat-ai'}`}>
            {message.content}
            {message.role === 'assistant' && message.answerSource && <div className="mt-3 border-t border-slate-300/30 pt-2 text-[11px]"><b>Source:</b> {message.answerSource === 'knowledge_base' ? 'Workspace knowledge base' : 'General AI knowledge — not found in the workspace knowledge base'}</div>}
            {message.citations?.length > 0 && <div className="mt-3 border-t border-slate-300/30 pt-2 text-[11px]"><b>References used</b>{message.citations.map(citation => <div key={citation.chunkId} className="mt-1">[{citation.label}] {citation.citation || 'Reference material'}</div>)}</div>}
          </div>)}
          {loading && <div className="chat-bubble chat-ai">Checking knowledge base…</div>}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-800"><input className="input" value={q} onChange={event => setQ(event.target.value)} placeholder="Ask a legal question…"/><button className="btn btn-primary" disabled={loading}>Ask</button></form>
      </div>
      <aside className="space-y-4">
        <div className="panel p-5"><div className="flex items-center gap-2 font-black"><BookOpenCheck size={18} className="text-indigo-500"/> How it works</div><ol className="mt-4 space-y-3 text-sm leading-6 text-slate-500"><li><b>1.</b> Ask your question.</li><li><b>2.</b> The workspace knowledge base is checked first.</li><li><b>3.</b> If no material is found, a clearly labelled general AI answer is provided.</li></ol></div>
        <div className="panel p-5"><div className="flex items-center gap-2 font-black"><ShieldCheck size={18} className="text-emerald-500"/> Keep in mind</div><p className="mt-2 text-sm leading-6 text-slate-500">For current laws, sections, judgments, deadlines, or important matters, verify official sources and obtain professional advice.</p></div>
      </aside>
    </div>
  </div>;
}
