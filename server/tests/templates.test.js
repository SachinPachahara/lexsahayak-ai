import { describe,it,expect } from 'vitest';
import { legalTemplates } from '../src/templates/legalTemplates.js';
describe('template catalog',()=>{it('contains high-quality document templates with required fields',()=>{expect(legalTemplates.length).toBeGreaterThanOrEqual(8);for(const t of legalTemplates){expect(t.id).toBeTruthy();expect(t.fields.some(f=>f.required)).toBe(true);}});});

describe('custom document workflow', () => {
  it('offers a guided fallback when no fixed template fits', () => {
    const template = legalTemplates.find(item => item.id === 'custom-document');
    expect(template).toBeTruthy();
    expect(template.fields.find(field => field.name === 'documentTitle')?.required).toBe(true);
  });
});
