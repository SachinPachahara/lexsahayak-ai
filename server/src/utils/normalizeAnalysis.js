const text = value => value === undefined || value === null ? '' : String(value).trim();

function values(value) {
  if (value === undefined || value === null || value === '') return [];
  return Array.isArray(value) ? value : [value];
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function score(value, fallback, min, max) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function namedValues(value, label) {
  return values(value).map((item, index) => {
    if (typeof item === 'string' || typeof item === 'number') return { label: `${label} ${index + 1}`, value: text(item) };
    const source = object(item);
    return { label: text(source.label || source.name || source.type || `${label} ${index + 1}`), value: text(source.value || source.date || source.amount || source.text) };
  }).filter(item => item.value);
}

/**
 * Converts untrusted LLM JSON into the exact embedded-document shapes expected
 * by AnalysisResult. Providers frequently return a scalar for a single item.
 */
export function normalizeAnalysis(raw = {}) {
  const source = object(raw);
  const parties = values(source.parties).flatMap(item => {
    if (typeof item === 'string' || typeof item === 'number') return text(item) ? [{ name: text(item), role: '' }] : [];
    const party = object(item);
    if (party.name || party.party || party.partyName) return [{ name: text(party.name || party.party || party.partyName), role: text(party.role || party.type || party.designation) }];
    return Object.values(party).filter(value => typeof value === 'string' || typeof value === 'number').map(value => ({ name: text(value), role: '' }));
  }).filter(party => party.name);

  const severity = value => ['low', 'medium', 'high'].includes(text(value).toLowerCase()) ? text(value).toLowerCase() : 'medium';
  return {
    summary: text(source.summary),
    parties,
    importantDates: namedValues(source.importantDates, 'Date'),
    financialTerms: namedValues(source.financialTerms, 'Financial term'),
    obligations: values(source.obligations).map(item => {
      if (typeof item === 'string' || typeof item === 'number') return { party: '', obligation: text(item), due: '' };
      const value = object(item); return { party: text(value.party || value.name), obligation: text(value.obligation || value.action || value.text), due: text(value.due || value.deadline || value.date) };
    }).filter(item => item.obligation),
    risks: values(source.risks).map(item => {
      if (typeof item === 'string' || typeof item === 'number') return { severity: 'medium', type: 'review', clause: '', message: text(item) };
      const value = object(item); return { severity: severity(value.severity), type: text(value.type || 'review'), clause: text(value.clause), message: text(value.message || value.text) };
    }).filter(item => item.message),
    missingClauses: values(source.missingClauses).map(item => {
      if (typeof item === 'string' || typeof item === 'number') return { name: text(item), reason: '', severity: 'medium' };
      const value = object(item); return { name: text(value.name || value.clause), reason: text(value.reason || value.message), severity: severity(value.severity) };
    }).filter(item => item.name),
    contradictions: values(source.contradictions).map(item => {
      if (typeof item === 'string' || typeof item === 'number') return { left: '', right: '', explanation: text(item) };
      const value = object(item); return { left: text(value.left), right: text(value.right), explanation: text(value.explanation || value.message || value.text) };
    }).filter(item => item.explanation),
    suggestions: values(source.suggestions).map(item => {
      if (typeof item === 'string' || typeof item === 'number') return { title: 'Suggestion', text: text(item), rationale: '' };
      const value = object(item); return { title: text(value.title || value.name || 'Suggestion'), text: text(value.text || value.suggestion || value.message), rationale: text(value.rationale || value.reason) };
    }).filter(item => item.text),
    riskScore: score(source.riskScore, 0, 0, 100),
    readabilityScore: score(source.readabilityScore, 0, 0, 100),
    confidence: score(source.confidence, 0.5, 0, 1),
    aiGenerated: source.aiGenerated !== false
  };
}
