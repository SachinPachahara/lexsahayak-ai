import { describe, expect, it } from 'vitest';
import { normalizeAnalysis } from '../src/utils/normalizeAnalysis.js';

describe('normalizeAnalysis', () => {
  it('converts scalar AI values into AnalysisResult embedded-document shapes', () => {
    const analysis = normalizeAnalysis({
      summary: 'Review', parties: 'csjmu', importantDates: '2026-01-01', financialTerms: 'INR 500',
      obligations: 'Pay the fee', risks: 'Termination wording is unclear', missingClauses: 'Termination',
      contradictions: 'The dates conflict', suggestions: 'Add a notice clause', riskScore: 150, confidence: -1
    });

    expect(analysis.parties).toEqual([{ name: 'csjmu', role: '' }]);
    expect(analysis.importantDates).toEqual([{ label: 'Date 1', value: '2026-01-01' }]);
    expect(analysis.obligations).toEqual([{ party: '', obligation: 'Pay the fee', due: '' }]);
    expect(analysis.risks[0]).toMatchObject({ severity: 'medium', type: 'review' });
    expect(analysis.riskScore).toBe(100);
    expect(analysis.confidence).toBe(0);
  });
});
