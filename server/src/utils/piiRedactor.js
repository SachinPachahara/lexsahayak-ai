const patterns = [
  { label: 'EMAIL', regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { label: 'PHONE', regex: /(?<!\d)(?:\+91[-\s]?)?[6-9]\d{9}(?!\d)/g },
  { label: 'AADHAAR', regex: /(?<!\d)\d{4}[ -]?\d{4}[ -]?\d{4}(?!\d)/g },
  { label: 'PAN', regex: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g }
];
export function redactIndianPII(text = '') {
  let output = text;
  const counts = {};
  for (const { label, regex } of patterns) {
    let n = 0;
    output = output.replace(regex, () => { n += 1; return `[REDACTED_${label}_${n}]`; });
    if (n) counts[label] = n;
  }
  return { text: output, counts };
}
