import { useEffect, useRef, useState } from 'react';

const SHORTCUTS: Array<[string, string]> = [
  ['⌘K / Ctrl+K', 'Open command palette'],
  ['/', 'Search'],
  ['?', 'Toggle this help'],
  ['Esc', 'Close overlay'],
  ['j', 'Next section'],
  ['k', 'Previous section'],
  ['gg', 'Scroll to top'],
  ['Shift+G', 'Scroll to bottom'],
  ['t', 'Toggle theme'],
];

export default function HelpOverlay() {
  const [open, setOpen] = useState(false);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    const onClose = () => setOpen(false);
    window.addEventListener('help:toggle', onToggle);
    window.addEventListener('overlay:close', onClose);
    return () => {
      window.removeEventListener('help:toggle', onToggle);
      window.removeEventListener('overlay:close', onClose);
    };
  }, []);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
    } else {
      previouslyFocused.current?.focus();
    }
  }, [open]);

  if (!open) return <div style={{ display: 'none' }} />;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- backdrop dialog dismissal
    <div
      className="help-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="keyboard shortcuts"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
      tabIndex={-1}
    >
      <div className="help-modal">
        <h3 style={{ margin: '0 0 16px', fontFamily: 'IBM Plex Serif, serif', fontWeight: 500 }}>
          Keyboard shortcuts
        </h3>
        {SHORTCUTS.map(([k, v]) => (
          <div className="help-row" key={k}>
            <span>
              <span className="help-kbd">{k}</span>
            </span>
            <span style={{ color: 'var(--ink-2)' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
