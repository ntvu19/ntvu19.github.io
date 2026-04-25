import { useEffect, useMemo, useRef, useState } from 'react';

export interface PaletteItem {
  id: string;
  group: 'Navigate' | 'Theme' | 'Accent' | 'Contact' | 'Projects';
  label: string;
  hint?: string;
  action: () => void;
}

export interface CommandPaletteProps {
  items: PaletteItem[];
}

export default function CommandPalette({ items }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener('palette:toggle', onToggle);
    window.addEventListener('palette:open', onOpen);
    window.addEventListener('overlay:close', onClose);
    return () => {
      window.removeEventListener('palette:toggle', onToggle);
      window.removeEventListener('palette:open', onOpen);
      window.removeEventListener('overlay:close', onClose);
    };
  }, []);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery('');
      setActive(0);
      previouslyFocused.current?.focus();
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<PaletteItem['group'], PaletteItem[]>();
    for (const i of filtered) {
      const arr = map.get(i.group) ?? [];
      arr.push(i);
      map.set(i.group, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (!open) return null;

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[active];
      if (item) {
        item.action();
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- backdrop dialog dismissal
    <div
      className="palette-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="command palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      onKeyDown={onKey}
    >
      <div className="palette">
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Type to search…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          aria-label="search commands"
        />
        <ul className="palette-list" role="listbox">
          {groups.map(([group, list]) => (
            <li key={group}>
              <div className="palette-group-label">{group}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {list.map((item) => {
                  const idx = filtered.indexOf(item);
                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled at dialog level
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={idx === active}
                      className={`palette-item ${idx === active ? 'is-active' : ''}`}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => {
                        item.action();
                        setOpen(false);
                      }}
                    >
                      <span>{item.label}</span>
                      {item.hint && <span className="palette-item-hint">{item.hint}</span>}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
