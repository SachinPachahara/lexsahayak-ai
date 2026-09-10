import { describe,it,expect } from 'vitest';
import { legalTemplates } from '../src/templates/legalTemplates.js';
describe('template catalog',()=>{
  it('contains high-quality document templates with required fields',()=>{
    expect(legalTemplates.length).toBe(23);
    for(const t of legalTemplates){
      expect(t.id).toBeTruthy();
      expect(t.fields.some(f=>f.required)).toBe(true);
    }
  });

  it('includes core Indian statutory templates', () => {
    const ids = legalTemplates.map(t => t.id);
    expect(ids).toContain('cheque-bounce-notice');
    expect(ids).toContain('promissory-note');
    expect(ids).toContain('founders-agreement');
    expect(ids).toContain('simple-will');
    expect(ids).toContain('power-of-attorney');
    expect(ids).toContain('commercial-lease');
    expect(ids).toContain('website-privacy-policy');
    expect(ids).toContain('rera-delay-notice');
    expect(ids).toContain('gift-deed');
  });
});

describe('custom document workflow', () => {
  it('offers a guided fallback when no fixed template fits', () => {
    const template = legalTemplates.find(item => item.id === 'custom-document');
    expect(template).toBeTruthy();
    expect(template.fields.find(field => field.name === 'documentTitle')?.required).toBe(true);
  });
});
