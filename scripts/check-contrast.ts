function srgbChannel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relLuminance(hex: string): number {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) throw new Error(`invalid hex: ${hex}`);
  const [r, g, b] = m.map((c) => parseInt(c, 16));
  if (r === undefined || g === undefined || b === undefined) {
    throw new Error(`invalid hex parse: ${hex}`);
  }
  return 0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function isAA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 4.5;
}

function main(): void {
  // Approximate hex equivalents of the oklch tokens — used as a smoke check.
  // Visual verification in the browser is the source of truth; this script
  // is a sanity guard for accidental regressions.
  const samples: Array<[string, string, string]> = [
    ['ink on bg (light)', '#0e1216', '#fbfaf7'],
    ['ink-3 on bg (light)', '#6c7278', '#fbfaf7'],
    ['ink on bg (dark)', '#f3f2ee', '#0b0e11'],
    ['ink-3 on bg (dark)', '#918f88', '#0b0e11'],
  ];
  let failed = 0;
  for (const [name, fg, bg] of samples) {
    const ratio = contrastRatio(fg, bg);
    const ok = ratio >= 4.5;
    console.log(`${ok ? 'OK' : 'FAIL'}  ${name}  ${ratio.toFixed(2)}:1`);
    if (!ok) failed++;
  }
  if (failed > 0) {
    console.error(`${failed} sample(s) below AA.`);
    process.exit(1);
  }
}

// NOTE: The plan's isMain check uses backslash replacement which produces
// `file://C:/...` on Windows while import.meta.url is `file:///C:/...`.
// Use pathToFileURL for cross-platform correctness (same approach as check-no-js.ts).
import { pathToFileURL } from 'node:url';
const isMain =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();
