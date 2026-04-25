import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { applyTheme, applyAccent, nextTheme, ACCENTS } from '../src/scripts/theme';

beforeEach(() => {
  const dom = new JSDOM(`<!doctype html><html data-theme="light" data-accent="green"></html>`, { url: 'http://localhost' });
  // @ts-expect-error inject jsdom globals
  global.document = dom.window.document;
  // @ts-expect-error
  global.window = dom.window;
  // @ts-expect-error
  global.localStorage = dom.window.localStorage;
});

describe('applyTheme', () => {
  it('writes data-theme and persists', () => {
    applyTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('vtn:theme')).toBe('dark');
  });
});

describe('applyAccent', () => {
  it('writes data-accent and persists', () => {
    applyAccent('amber');
    expect(document.documentElement.getAttribute('data-accent')).toBe('amber');
    expect(localStorage.getItem('vtn:accent')).toBe('amber');
  });
});

describe('nextTheme', () => {
  it('toggles light <-> dark', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });
});

describe('ACCENTS', () => {
  it('lists 5 accents', () => {
    expect(ACCENTS).toEqual(['green', 'amber', 'blue', 'magenta', 'mono']);
  });
});
