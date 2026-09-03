import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LegalNotice from '../LegalNotice';
describe('LegalNotice',()=>{it('communicates the legal-information limitation',()=>{render(<LegalNotice/>);const notice=screen.getByText(/Legal information, not legal advice/i);expect(notice.textContent).toMatch(/Legal information, not legal advice/i);});});
