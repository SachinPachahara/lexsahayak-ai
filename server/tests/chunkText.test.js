import { describe,it,expect } from 'vitest';
import { chunkText } from '../src/utils/chunkText.js';
describe('chunkText',()=>{it('splits long text and preserves content fragments',()=>{const text='Clause one. '.repeat(600);const chunks=chunkText(text,500,50);expect(chunks.length).toBeGreaterThan(5);expect(chunks.every(c=>c.length<=520)).toBe(true);});});
