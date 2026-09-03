import { describe,it,expect } from 'vitest';
import { mockEmbedding, cosineSimilarity } from '../src/utils/vector.js';
describe('local retrieval math',()=>{it('ranks similar text higher',()=>{const q=mockEmbedding('termination notice period');const a=mockEmbedding('termination requires written notice period');const b=mockEmbedding('monthly rent and security deposit');expect(cosineSimilarity(q,a)).toBeGreaterThan(cosineSimilarity(q,b));});});
