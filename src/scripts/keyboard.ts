import './events';

export interface KeyContext {
  dispatch: (name: 'palette:toggle' | 'palette:open' | 'help:toggle' | 'overlay:close') => void;
  scrollTo: (target: 'top' | 'bottom') => void;
  scrollToSection: (dir: 'next' | 'prev') => void;
  toggleTheme: () => void;
  isInputFocused: () => boolean;
  now: () => number;
}

let lastG = -Infinity;

export function handleKey(e: KeyboardEvent, ctx: KeyContext): void {
  // Cmd/Ctrl+K is allowed even when typing
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    ctx.dispatch('palette:toggle');
    return;
  }

  if (ctx.isInputFocused()) return;

  switch (e.key) {
    case '/':
      ctx.dispatch('palette:open');
      return;
    case '?':
      ctx.dispatch('help:toggle');
      return;
    case 'Escape':
      ctx.dispatch('overlay:close');
      return;
    case 't':
      ctx.toggleTheme();
      return;
    case 'j':
      ctx.scrollToSection('next');
      return;
    case 'k':
      ctx.scrollToSection('prev');
      return;
    case 'g': {
      const t = ctx.now();
      if (t - lastG <= 500) {
        ctx.scrollTo('top');
        lastG = -Infinity;
      } else {
        lastG = t;
      }
      return;
    }
    case 'G':
      if (e.shiftKey) ctx.scrollTo('bottom');
      return;
  }
}

export function activateKeyboard(): void {
  const isInputFocused = (): boolean => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  };

  const ctx: KeyContext = {
    dispatch: (name) => window.dispatchEvent(new CustomEvent(name)),
    scrollTo: (target) => {
      window.scrollTo({
        top: target === 'top' ? 0 : document.body.scrollHeight,
        behavior: 'smooth',
      });
    },
    scrollToSection: (dir) => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
      if (sections.length === 0) return;
      const y = window.scrollY + 120;
      const idx = sections.findIndex((s, i) => {
        const next = sections[i + 1];
        return s.offsetTop <= y && (!next || next.offsetTop > y);
      });
      const target =
        dir === 'next'
          ? sections[Math.min(idx + 1, sections.length - 1)]
          : sections[Math.max(idx - 1, 0)];
      if (target) window.scrollTo({ top: target.offsetTop - 24, behavior: 'smooth' });
    },
    toggleTheme: () => {
      const cur =
        (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'light';
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('vtn:theme', next);
      } catch {
        /* localStorage unavailable */
      }
    },
    isInputFocused,
    now: () => performance.now(),
  };

  window.addEventListener('keydown', (e) => handleKey(e, ctx));
}
