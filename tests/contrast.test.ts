import { describe, it, expect } from 'vitest';
import { contrastRatio, isAA } from '../scripts/check-contrast';

describe('contrastRatio', () => {
  it('returns 21 for white-on-black', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
  });
  it('returns 1 for same color', () => {
    expect(contrastRatio('#888888', '#888888')).toBeCloseTo(1, 1);
  });
});

describe('isAA', () => {
  it('passes white on black', () => {
    expect(isAA('#ffffff', '#000000')).toBe(true);
  });
  it('fails light gray on white', () => {
    expect(isAA('#cccccc', '#ffffff')).toBe(false);
  });
});
