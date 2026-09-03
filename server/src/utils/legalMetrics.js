const vague = ['reasonable', 'as soon as possible', 'appropriate', 'satisfactory', 'from time to time'];
export function heuristicReadability(text = '') {
  const sentences = Math.max(1, (text.match(/[.!?]+/g) || []).length);
  const words = text.trim().split(/\s+/).filter(Boolean);
  const avg = words.length / sentences;
  const complex = words.filter(w => w.length >= 12).length / Math.max(1, words.length);
  return Math.max(0, Math.min(100, Math.round(100 - Math.max(0, avg - 18) * 2 - complex * 70)));
}
export function heuristicRiskSignals(text = '') {
  const lower = text.toLowerCase();
  const signals = [];
  for (const phrase of vague) if (lower.includes(phrase)) signals.push({ severity: 'medium', type: 'ambiguity', message: `Potentially ambiguous wording: “${phrase}”.` });
  if (/unlimited liability/i.test(text)) signals.push({ severity: 'high', type: 'liability', message: 'Unlimited liability language detected.' });
  if (/non[- ]?compete/i.test(text)) signals.push({ severity: 'medium', type: 'restriction', message: 'Restrictive non-compete language should receive jurisdiction-specific review.' });
  return signals.slice(0, 8);
}
