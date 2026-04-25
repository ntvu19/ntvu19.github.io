import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function findJsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...findJsFiles(full));
    } else if (entry.endsWith('.js') || entry.endsWith('.jsx')) {
      out.push(full);
    }
  }
  return out;
}

function main(): void {
  const offenders = findJsFiles('src');
  if (offenders.length > 0) {
    console.error('TypeScript-only rule violated. The following files must be .ts or .tsx:');
    for (const f of offenders) console.error('  ' + f);
    process.exit(1);
  }
  console.log('check-no-js: OK (0 offenders in src/)');
}

const isMain = import.meta.url === `file://${process.argv[1]?.replaceAll('\\', '/')}`;
if (isMain) main();
