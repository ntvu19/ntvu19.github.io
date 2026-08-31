import type { PaletteItem } from '../components/palette/CommandPalette';
import { ACCENTS, applyAccent, applyTheme, type AccentId } from './theme';

export interface PaletteContext {
  contacts: Array<{ label: string; href: string }>;
  projects: Array<{ id: string; title: string }>;
}

export function buildPaletteItems(ctx: PaletteContext): PaletteItem[] {
  const sections = ['hero', 'now', 'experience', 'projects', 'skills', 'oss'];
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const items: PaletteItem[] = [];

  for (const id of sections) {
    items.push({
      id: `nav:${id}`,
      group: 'Navigate',
      label: id.charAt(0).toUpperCase() + id.slice(1),
      action: () => scrollTo(id),
    });
  }
  items.push({
    id: 'nav:garden',
    group: 'Navigate',
    label: 'Garden',
    hint: 'botanical codenames',
    action: () => {
      window.location.href = '/garden/';
    },
  });
  items.push(
    { id: 'theme:light', group: 'Theme', label: 'Light', action: () => applyTheme('light') },
    { id: 'theme:dark', group: 'Theme', label: 'Dark', action: () => applyTheme('dark') },
  );
  for (const a of ACCENTS as AccentId[]) {
    items.push({
      id: `accent:${a}`,
      group: 'Accent',
      label: a.charAt(0).toUpperCase() + a.slice(1),
      action: () => applyAccent(a),
    });
  }
  for (const c of ctx.contacts) {
    items.push({
      id: `contact:${c.label}`,
      group: 'Contact',
      label: c.label.charAt(0).toUpperCase() + c.label.slice(1),
      action: () => window.open(c.href, '_blank', 'noopener'),
    });
  }
  for (const p of ctx.projects) {
    items.push({
      id: `project:${p.id}`,
      group: 'Projects',
      label: p.title,
      hint: p.id,
      action: () => scrollTo('projects'),
    });
  }

  return items;
}
