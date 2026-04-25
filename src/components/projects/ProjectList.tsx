import { useState } from 'react';

export interface ProjectListItem {
  id: string;
  title: string;
  tagline: string;
  status: 'shipped' | 'in progress';
  skills: string[];
  problem: string;
  solved: string[];
  role: string;
  links: { demo?: string; source?: string };
}

export interface ProjectListProps {
  projects: ProjectListItem[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gap: 0,
      }}
    >
      {projects.map((p) => {
        const isOpen = open === p.id;
        return (
          <li key={p.id} style={{ borderBottom: '1px solid var(--rule)' }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : p.id)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '64px 1fr auto',
                gap: 16,
                padding: '16px 0',
                alignItems: 'center',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontFamily: 'JetBrains Mono Variable, monospace',
                  fontSize: 11,
                  color: 'var(--ink-3)',
                }}
              >
                {p.id}
              </span>
              <span>
                <strong
                  style={{
                    fontFamily: 'IBM Plex Serif, serif',
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  {p.title}
                </strong>
                <span style={{ color: 'var(--ink-3)', marginLeft: 8 }}>
                  {p.tagline}
                </span>
              </span>
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div style={{ paddingBottom: 16, color: 'var(--ink-2)' }}>
                <p>{p.problem}</p>
                <ul>
                  {p.solved.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p>
                  <em>Role:</em> {p.role}
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
