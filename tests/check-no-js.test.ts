import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { findJsFiles } from '../scripts/check-no-js';

describe('findJsFiles', () => {
  it('returns empty array for src dir with only .ts files', () => {
    const dir = mkdtempSync(join(tmpdir(), 'check-no-js-'));
    try {
      mkdirSync(join(dir, 'sub'));
      writeFileSync(join(dir, 'a.ts'), '');
      writeFileSync(join(dir, 'sub', 'b.tsx'), '');
      expect(findJsFiles(dir)).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('finds .js and .jsx files recursively', () => {
    const dir = mkdtempSync(join(tmpdir(), 'check-no-js-'));
    try {
      mkdirSync(join(dir, 'sub'));
      writeFileSync(join(dir, 'a.js'), '');
      writeFileSync(join(dir, 'sub', 'b.jsx'), '');
      writeFileSync(join(dir, 'c.ts'), '');
      const found = findJsFiles(dir).sort();
      expect(found).toEqual([join(dir, 'a.js'), join(dir, 'sub', 'b.jsx')].sort());
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
