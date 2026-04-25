import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { handleKey, type KeyContext } from '../src/scripts/keyboard';

beforeEach(() => {
  const dom = new JSDOM(
    `<!doctype html><html data-theme="light"><body>
    <section id="hero" data-section></section>
    <section id="now" data-section></section>
    <section id="experience" data-section></section>
  </body></html>`,
    { url: 'http://localhost/' },
  );
  // @ts-expect-error inject jsdom document into node global
  global.document = dom.window.document;
  // @ts-expect-error inject jsdom window into node global
  global.window = dom.window;
});

const makeCtx = (): KeyContext => ({
  dispatch: vi.fn(),
  scrollTo: vi.fn(),
  scrollToSection: vi.fn(),
  toggleTheme: vi.fn(),
  isInputFocused: () => false,
  now: () => 0,
});

describe('handleKey', () => {
  it('dispatches palette:toggle on Cmd+K', () => {
    const ctx = makeCtx();
    handleKey({ key: 'k', metaKey: true } as KeyboardEvent, ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('palette:toggle');
  });

  it('dispatches palette:toggle on Ctrl+K', () => {
    const ctx = makeCtx();
    handleKey({ key: 'k', ctrlKey: true } as KeyboardEvent, ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('palette:toggle');
  });

  it('opens help on ?', () => {
    const ctx = makeCtx();
    handleKey({ key: '?' } as KeyboardEvent, ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('help:toggle');
  });

  it('toggles theme on t', () => {
    const ctx = makeCtx();
    handleKey({ key: 't' } as KeyboardEvent, ctx);
    expect(ctx.toggleTheme).toHaveBeenCalled();
  });

  it('jumps next section on j', () => {
    const ctx = makeCtx();
    handleKey({ key: 'j' } as KeyboardEvent, ctx);
    expect(ctx.scrollToSection).toHaveBeenCalledWith('next');
  });

  it('jumps prev section on k', () => {
    const ctx = makeCtx();
    handleKey({ key: 'k' } as KeyboardEvent, ctx);
    expect(ctx.scrollToSection).toHaveBeenCalledWith('prev');
  });

  it('skips letter shortcuts when input focused', () => {
    const ctx = { ...makeCtx(), isInputFocused: () => true };
    handleKey({ key: 'j' } as KeyboardEvent, ctx);
    expect(ctx.scrollToSection).not.toHaveBeenCalled();
  });

  it('still allows Cmd+K when input focused', () => {
    const ctx = { ...makeCtx(), isInputFocused: () => true };
    handleKey({ key: 'k', metaKey: true } as KeyboardEvent, ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('palette:toggle');
  });

  it('triggers gg sequence within 500ms', () => {
    const ctx = { ...makeCtx(), now: vi.fn().mockReturnValueOnce(100).mockReturnValueOnce(400) };
    handleKey({ key: 'g' } as KeyboardEvent, ctx);
    handleKey({ key: 'g' } as KeyboardEvent, ctx);
    expect(ctx.scrollTo).toHaveBeenCalledWith('top');
  });

  it('Shift+G scrolls to bottom', () => {
    const ctx = makeCtx();
    handleKey({ key: 'G', shiftKey: true } as KeyboardEvent, ctx);
    expect(ctx.scrollTo).toHaveBeenCalledWith('bottom');
  });
});
