export type ThemeMode = 'light' | 'dark';
export type AccentId = 'green' | 'amber' | 'blue' | 'magenta' | 'mono';

export const ACCENTS: AccentId[] = ['green', 'amber', 'blue', 'magenta', 'mono'];

export function applyTheme(t: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', t);
  try {
    localStorage.setItem('vtn:theme', t);
  } catch {
    /* localStorage unavailable */
  }
}

export function applyAccent(a: AccentId): void {
  document.documentElement.setAttribute('data-accent', a);
  try {
    localStorage.setItem('vtn:accent', a);
  } catch {
    /* localStorage unavailable */
  }
}

export function currentTheme(): ThemeMode {
  return (document.documentElement.getAttribute('data-theme') as ThemeMode) ?? 'light';
}

export function currentAccent(): AccentId {
  return (document.documentElement.getAttribute('data-accent') as AccentId) ?? 'green';
}

export function nextTheme(t: ThemeMode): ThemeMode {
  return t === 'light' ? 'dark' : 'light';
}

export function bindToggleHandlers(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => applyTheme(nextTheme(currentTheme())));
  });
}
