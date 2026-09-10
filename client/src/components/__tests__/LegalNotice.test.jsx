import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LegalNotice from '../LegalNotice';

describe('LegalNotice', () => {
  it('communicates the legal-information limitation', () => {
    const html = renderToString(<LegalNotice />);
    expect(html).toContain('Legal information, not legal advice');
  });
});
