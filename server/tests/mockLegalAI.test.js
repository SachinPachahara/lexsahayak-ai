import { describe, expect, it } from 'vitest';
import { mockChat } from '../src/services/mockLegalAI.js';

const giftDeed = `GIFT DEED

This deed of gift is made between a Donor and a Donee. The donor transfers a cash gift to the donee. Witnesseth as follows: the parties agree to the terms stated below.`;

describe('mock document chat', () => {
  it('answers a document overview with a concise, grounded summary', () => {
    const answer = mockChat('what is this doc about', [{ text: giftDeed, citation: 'Sample gift deed (user document)' }]);
    expect(answer).toContain('Gift Deed');
    expect(answer).toContain('donor and a donee');
    expect(answer).toContain('terms of a gift or transfer');
    expect(answer).not.toContain('most relevant text is');
  });

  it('returns a focused passage for a specific question', () => {
    const answer = mockChat('Who receives the gift?', [{ text: giftDeed }]);
    expect(answer).toContain('Donee');
    expect(answer).toContain('[S1]');
  });
});
