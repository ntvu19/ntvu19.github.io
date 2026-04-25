import { useEffect, useState } from 'react';

export interface HeroTerminalProps {
  name: string;
  role: string;
  location: string;
  summary: string;
}

const cadence = 110;

export default function HeroTerminal({ name, role, location, summary }: HeroTerminalProps) {
  const lines = [
    { kind: 'prompt', text: '$ whoami --verbose' } as const,
    { kind: 'plain', text: name } as const,
    { kind: 'plain', text: role } as const,
    { kind: 'plain', text: location } as const,
    { kind: 'comment', text: '# 3 years shipping' } as const,
    { kind: 'prompt', text: '$ cat ~/about.md' } as const,
    { kind: 'plain', text: summary } as const,
  ];

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [revealed, setRevealed] = useState<number>(reduced ? lines.length : 0);

  useEffect(() => {
    if (reduced) return;
    if (revealed >= lines.length) return;
    const id = window.setTimeout(() => setRevealed((r) => r + 1), cadence + Math.random() * 110);
    return () => window.clearTimeout(id);
  }, [revealed, reduced, lines.length]);

  return (
    <pre className="hero-terminal">
      {lines.slice(0, revealed).map((line, i) => {
        const isLast = i === revealed - 1 && revealed < lines.length;
        const cls =
          line.kind === 'prompt'
            ? 'hero-terminal-prompt'
            : line.kind === 'comment'
              ? 'hero-terminal-comment'
              : '';
        return (
          <div key={i}>
            <span className={cls}>{line.text}</span>
            {isLast && <span className="hero-terminal-cursor" />}
          </div>
        );
      })}
    </pre>
  );
}
