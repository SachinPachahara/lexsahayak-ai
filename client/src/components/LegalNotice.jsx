import React from 'react';
import { ShieldAlert } from 'lucide-react';
export default function LegalNotice({compact=false}){return <div className={`legal-notice ${compact?'text-xs':''}`}><ShieldAlert size={17} className="shrink-0"/><span><b>Legal information, not legal advice.</b> Verify applicable law and seek qualified professional review for important decisions.</span></div>}
