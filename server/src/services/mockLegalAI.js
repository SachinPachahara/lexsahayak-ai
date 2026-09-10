import { heuristicReadability, heuristicRiskSignals } from '../utils/legalMetrics.js';

const titleCase = s => String(s || '').replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
const val = (fields, key, fallback='[To be completed]') => fields?.[key] || fallback;

export function mockGenerate(template, fields) {
  const pairs = template.fields.filter(f => fields?.[f.name]).map(f => `${f.label}: ${fields[f.name]}`);
  const parties = pairs.slice(0, 2).join(' and ');
  const documentName = template.id === 'custom-document' ? val(fields, 'documentTitle', template.name) : template.name;
  return `${String(documentName).toUpperCase()}\n\nThis ${documentName} is prepared from information supplied by the user. It is an AI-assisted draft and should be reviewed for the specific facts and applicable law before consequential use.\n\n1. PARTIES AND BACKGROUND\n${parties || 'The parties are identified in the details below.'}\n\n2. COMMERCIAL / FACTUAL DETAILS\n${pairs.map((p,i) => `${i+1}. ${p}`).join('\n')}\n\n3. PERFORMANCE AND COOPERATION\nEach party will perform the responsibilities expressly assigned to it in this document in good faith and will communicate material changes relevant to performance.\n\n4. PAYMENT AND RECORDS\nAny payment terms stated above will apply. The parties should maintain reasonable records of payments, approvals, notices and material communications.\n\n5. CONFIDENTIALITY AND DATA\nInformation expressly identified as confidential should be used only for the purpose of this arrangement, subject to lawful disclosure obligations and agreed exceptions.\n\n6. CHANGES\nMaterial changes should be recorded in writing and accepted by the affected parties.\n\n7. TERMINATION / COMPLETION\nThe arrangement will end according to the duration, notice or completion terms stated above. Accrued payment, confidentiality and other provisions intended to survive should be reviewed before finalisation.\n\n8. DISPUTE HANDLING\nThe parties should first attempt good-faith resolution. Any dispute-resolution venue, procedure or governing-law clause should be completed only after considering the relevant jurisdiction.\n\n9. SIGNATURES\nParty 1: ____________________\nParty 2: ____________________\nDate: ${val(fields,'date',val(fields,'effectiveDate',val(fields,'startDate')))}\nPlace: ${val(fields,'city')}\n\nAI ASSISTANCE NOTICE: This draft is for document assistance and education, not a substitute for advice from a qualified legal professional.`;
}

export function mockAnalyze(content) {
  const riskSignals = heuristicRiskSignals(content);
  const lower = content.toLowerCase();
  const missing = [];
  for (const [name, words, reason] of [
    ['Termination / notice',['termination','notice'],'No clear termination or notice language was detected.'],
    ['Dispute resolution',['dispute','arbitration','jurisdiction'],'No dispute-resolution language was detected.'],
    ['Confidentiality',['confidential'],'No confidentiality language was detected.']
  ]) if (!words.some(w => lower.includes(w))) missing.push({ name, reason, severity: 'medium' });
  const money = [...content.matchAll(/(?:₹|INR\s*)[\s]?([\d,]+(?:\.\d+)?)/gi)].slice(0,8).map((m,i) => ({ label: `Amount ${i+1}`, value: m[0] }));
  const dates = [...content.matchAll(/\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/g)].slice(0,8).map((m,i) => ({ label: `Date ${i+1}`, value: m[0] }));
  const sentences = content.replace(/\n+/g,' ').split(/(?<=[.!?])\s+/).filter(Boolean);
  const summary = sentences.slice(0,3).join(' ').slice(0,900) || 'No meaningful text could be summarized.';
  const readabilityScore = heuristicReadability(content);
  const riskScore = Math.min(100, riskSignals.filter(r=>r.severity==='high').length*25 + riskSignals.filter(r=>r.severity==='medium').length*10 + missing.length*8);
  return {
    summary,
    parties: [], importantDates: dates, financialTerms: money,
    obligations: sentences.filter(s => /\b(shall|must|will|required|responsible)\b/i.test(s)).slice(0,8).map(s => ({ party: 'Referenced party', obligation: s.slice(0,400), due: '' })),
    risks: riskSignals,
    missingClauses: missing,
    contradictions: [],
    suggestions: missing.map(m => ({ title: `Review ${m.name}`, text: `Consider adding clear ${m.name.toLowerCase()} wording tailored to the transaction.`, rationale: m.reason })),
    riskScore, readabilityScore, confidence: 0.45
  };
}
export function mockExplainClause(clause) {
  return `Plain-language explanation:\n${clause}\n\nPractical effect: this clause creates or describes an obligation, right, limitation, or condition for the parties. Check defined terms, deadlines, payment amounts, exceptions and consequences elsewhere in the document because those details can change its effect.\n\nReview note: wording such as “reasonable”, broad indemnities, unilateral rights, automatic renewals, penalties, or unclear notice methods deserves closer review.`;
}
export function mockImproveClause(clause) {
  return `${clause.trim().replace(/[.;]?$/, '')}. For clarity, the responsible party, required action, applicable deadline, notice method, exceptions, and consequences of non-performance should be stated expressly and consistently with the rest of the agreement.`;
}
export function mockHindiClause(clause) {
  return `सरल हिंदी सारांश (Plain Hindi Summary):\nइस खंड (Clause) के अनुसार संबंधित पक्षों के अधिकार और कानूनी दायित्व तय किए गए हैं।\n\nमुख्य कानूनी प्रभाव:\n- यह शर्त दोनों पक्षों पर कानूनी रूप से लागू होती है।\n- किसी भी चूक, उल्लंघन या विवाद की स्थिति में दस्तावेज़ में उल्लिखित समय-सीमा और नोटिस प्रक्रिया का पालन करना अनिवार्य होगा।\n\nजांच सुझाव (Review Note): हस्ताक्षर करने से पहले यह सुनिश्चित कर लें कि यह शर्त निष्पक्ष है और इसमें कोई अनुचित या एकतरफा जुर्माना नहीं है।`;
}
const STOP_WORDS = new Set(['a','about','all','an','and','are','be','can','document','for','from','how','i','in','is','it','me','of','on','please','tell','the','this','to','what','when','which','who','will','with','you']);
const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
const questionTerms = question => normalize(question).toLowerCase().match(/[a-z0-9]{3,}/g)?.filter(word => !STOP_WORDS.has(word)) || [];
const isOverviewQuestion = question => /(?:what(?:'s| is)? (?:this|the) (?:doc(?:ument)?|agreement|deed)|summari[sz]e|overview|purpose|about\?*$)/i.test(normalize(question));

function bestSentences(text, question, count = 2) {
  const terms = questionTerms(question);
  const sentences = String(text || '').replace(/\r/g, '').split(/(?<=[.!?])\s+|\n+/).map(normalize).filter(sentence => sentence.length >= 25);
  return sentences.map((sentence, index) => {
    const lower = sentence.toLowerCase();
    const hits = terms.reduce((total, term) => total + (lower.includes(term) ? 1 : 0), 0);
    return { sentence, score: hits * 10 - index * 0.02 };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, count).map(item => item.sentence);
}

function documentTitle(text, citation) {
  const heading = String(text || '').split(/\r?\n/).map(normalize).find(line => line.length >= 3 && line.length <= 100 && (/^[A-Z][A-Z\s-]+$/.test(line) || /\b(deed|agreement|notice|contract|affidavit|lease)\b/i.test(line)));
  return heading || String(citation || '').replace(/\s*\(.*$/, '') || 'this document';
}

export function mockChat(question, chunks) {
  const best = chunks?.[0];
  if (!best) return 'I could not find supporting information in the authorized document or knowledge base.';
  const sourceText = chunks.map(chunk => chunk.text).join('\n');
  if (isOverviewQuestion(question)) {
    const title = documentTitle(sourceText, best.citation);
    const lower = sourceText.toLowerCase();
    const details = [];
    if (/\b(donor|donee)\b/.test(lower)) details.push('It identifies a donor and a donee.');
    if (/\bgift\b/.test(lower)) details.push('It records the terms of a gift or transfer.');
    if (/\b(witness|witnesses)\b/.test(lower)) details.push('It includes witness details.');
    const summary = details.length ? details.join(' ') : 'Its text sets out the parties and terms for the stated arrangement.';
    return `This appears to be **${titleCase(title.toLowerCase())}**. It is a document about the arrangement described in the deed or agreement. ${summary} [S1]\n\nThis is a high-level reading of the uploaded text, not legal advice.`;
  }
  const passages = bestSentences(sourceText, question);
  if (passages.length) return `${passages.join(' ')} [S1]\n\nThis answer is based only on the uploaded document text.`;
  return `I found the uploaded document, but it does not state a clear answer to "${question}" in the retrieved text. [S1]`;
  // The legacy text-echo fallback below is retained temporarily for reference.
  // eslint-disable-next-line no-unreachable
  return `Based on [S1], the most relevant text is: “${best.text.slice(0,650)}${best.text.length > 650 ? '…' : ''}”\n\nFor your question (“${question}”), this is the closest source-backed passage available. If it does not directly answer the question, the document does not provide enough explicit information and professional review may be appropriate.`;
}

export function mockGeneralLegalAnswer(question) {
  const normalizedQuestion = normalize(question).toLowerCase();
  const prefix = 'This is general legal information and was not found in the workspace knowledge base. ';
  if (/\blease agreement\b/.test(normalizedQuestion)) return `${prefix}Generally, a lease agreement is a contract in which one party gives another the right to use property for a stated period, usually in exchange for rent. Its enforceability and required terms can vary by jurisdiction and facts, so verify the applicable current law or seek professional advice for an important matter.`;
  if (/\bcontract\b|\bagreement\b/.test(normalizedQuestion)) return `${prefix}Generally, a contract is an agreement that creates legally enforceable obligations when the applicable legal requirements are met. The required elements and remedies depend on the jurisdiction and facts, so verify the applicable current law or seek professional advice for an important matter.`;
  return `${prefix}I can provide general legal information, but this question may depend on the jurisdiction, current law, and specific facts. Please verify it using an official current source or consult a qualified lawyer before acting on it.`;
}
