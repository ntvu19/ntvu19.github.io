import type { PaletteItem } from '../components/palette/CommandPalette';

interface BuildPaletteProps {
  contacts: any[];
  projects: any[];
}

export function buildPaletteItems({ contacts, projects }: BuildPaletteProps): PaletteItem[] {
  const items: PaletteItem[] = [
    {
      id: 'nav-home',
      group: 'Navigate',
      label: 'Home',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'nav-experience',
      group: 'Navigate',
      label: 'Experience',
      action: () => {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-projects',
      group: 'Navigate',
      label: 'Projects',
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-skills',
      group: 'Navigate',
      label: 'Skills',
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-oss',
      group: 'Navigate',
      label: 'Open Source',
      action: () => {
        document.getElementById('oss')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  // Theme
  const themes = ['light', 'dark', 'system'];
  themes.forEach((t) => {
    items.push({
      id: `theme-${t}`,
      group: 'Theme',
      label: `${t.charAt(0).toUpperCase()}${t.slice(1)}`,
      action: () => {
        if (typeof window !== 'undefined') {
          // We can dispatch an event to the theme script or directly set it
          document.documentElement.setAttribute('data-theme', t);
          localStorage.setItem('vtn:theme', t);
        }
      },
    });
  });

  // Accent
  const accents = ['green', 'blue', 'orange', 'red', 'purple', 'neutral'];
  accents.forEach((a) => {
    items.push({
      id: `accent-${a}`,
      group: 'Accent',
      label: `${a.charAt(0).toUpperCase()}${a.slice(1)}`,
      action: () => {
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-accent', a);
          localStorage.setItem('vtn:accent', a);
        }
      },
    });
  });

  // Projects
  projects.forEach((p) => {
    items.push({
      id: `proj-${p.id}`,
      group: 'Projects',
      label: p.title,
      action: () => {
        const el = document.querySelector(`.proj-card:has(.proj-thumb-id:contains("${p.id}"))`);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    });
  });

  // Contacts
  contacts.forEach((c) => {
    items.push({
      id: `contact-${c.label}`,
      group: 'Contact',
      label: c.label,
      hint: c.value,
      action: () => {
        window.open(c.href, '_blank');
      },
    });
  });

  return items;
}
