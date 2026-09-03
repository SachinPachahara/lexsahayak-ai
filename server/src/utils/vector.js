export function cosineSimilarity(a = [], b = []) {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

export function mockEmbedding(text = '', dimensions = 256) {
  const v = Array(dimensions).fill(0);
  const tokens = text.toLowerCase().match(/[a-z0-9₹]+/g) || [];
  for (const token of tokens) {
    let h = 2166136261;
    for (const ch of token) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    v[Math.abs(h) % dimensions] += 1;
  }
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map(x => x / norm);
}
