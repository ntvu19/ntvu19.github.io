# Portfolio Astro Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Vuepress portfolio with a fully static Astro site that renders the design system in `claude/SPECIFICATION.md`, ships near-zero JS by default, and deploys to GitHub Pages on push to `main`.

**Architecture:** Astro 4.x (static output) + React for islands + SCSS with CSS-custom-property tokens + zod-validated content collections + build-time variant config. Phased delivery: scaffold → content → static sections → interactivity → CI → cleanup.

**Tech Stack:** Astro 4, React 18, TypeScript strict, SCSS, MDX, ESLint flat config, Prettier, pnpm, GitHub Actions, vitest (logic tests).

**Spec source of truth:** `docs/superpowers/specs/2026-04-25-portfolio-astro-migration-design.md` and `claude/SPECIFICATION.md`.

---

## Conventions used in this plan

- **Working directory** for every shell command: repo root `C:/Users/vu.t.nguyen/Desktop/ntvu19.github.io`. (Bash uses Unix syntax / forward slashes.)
- **Commit message style:** lowercase imperative, no scope prefix unless useful (matches repo's existing style: "Add .npmrc file", "Move to use npm instead of yarn"). **Do not append any AI co-author trailer** (no `Co-Authored-By: Claude …`, no Cursor / Anthropic vendor lines) — commits should read as solely the user's authorship.
- **TDD:** logic modules (keyboard, palette item builder, contrast checker) get vitest tests written first. UI components (Astro/React) verified via build success and browser smoke check.
- **No `.js`/`.jsx` files in `src/`.** Only `.ts`, `.tsx`, `.astro`, `.scss`, `.md`, `.mdx`, `.yaml`, `.json`. Tool config files (`astro.config.mjs`, `eslint.config.mjs`) at repo root are exempt.
- **Frequent commits.** Every task ends with a commit. If a task has multiple files, they commit together.

---

## Phase 0: Branch & clean slate

This phase isolates the migration on a feature branch and removes the Vuepress files in one commit so the diff is reviewable.

### Task 0.1: Create migration branch

**Files:** none (git only)

- [ ] **Step 1: Verify clean working tree**

```bash
git status
```
Expected: "nothing to commit, working tree clean" (the spec commit already landed on `main`).

- [ ] **Step 2: Create and switch to migration branch**

```bash
git checkout -b feat/astro-migration
git status
```
Expected: "On branch feat/astro-migration".

### Task 0.2: Remove Vuepress source tree

**Files:**
- Delete: `docs/.vuepress/`, `docs/algorithm/`, `docs/database/`, `docs/miscellaneous/`, `docs/networking/`, `docs/operating-system/`, `docs/programming/`, `docs/others/`, `docs/vi/`, `docs/index.md`, `docs/.gitignore`
- Keep: `docs/superpowers/` (planning artifacts)

- [ ] **Step 1: List what's about to be removed (sanity check)**

```bash
ls docs/
```
Expected: includes `algorithm`, `database`, `programming`, `superpowers`, `.vuepress`, etc.

- [ ] **Step 2: Remove Vuepress directories and files**

```bash
rm -rf docs/.vuepress docs/algorithm docs/database docs/miscellaneous docs/networking docs/operating-system docs/programming docs/others docs/vi
rm -f docs/index.md docs/.gitignore
ls docs/
```
Expected: only `superpowers/` remains.

- [ ] **Step 3: Commit**

```bash
git add -A docs/
git commit -m "$(cat <<'EOF'
Remove Vuepress source tree

Phase 0 of Astro migration. Keeps docs/superpowers/ planning archive.
EOF
)"
```

### Task 0.3: Remove Vuepress build config and Docker files

**Files:**
- Delete: `package.json`, `package-lock.json`, `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.github/workflows/vuepress-deploy.yml`
- Also delete: `node_modules/` (clean state)

- [ ] **Step 1: Remove build/Docker files**

```bash
rm -f package.json package-lock.json Dockerfile docker-compose.yml .dockerignore
rm -f .github/workflows/vuepress-deploy.yml
rm -rf node_modules
```

- [ ] **Step 2: Verify**

```bash
ls .github/workflows/ 2>/dev/null || echo "(workflows dir empty)"
ls
```
Expected: no `package.json`, no Dockerfiles. `.github/workflows/` is empty.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Remove Vuepress build config and Docker files

Drops package.json, package-lock.json, Dockerfile, docker-compose.yml,
.dockerignore, and the old vuepress-deploy workflow. Astro replacements
land in subsequent phases.
EOF
)"
```

---

## Phase 1: Astro project scaffolding

Initialize Astro, install dependencies, set up TypeScript paths, write `astro.config.mjs`. End state: `pnpm dev` starts a dev server on a blank page with the project structure in place.

### Task 1.1: Create `package.json`

**Files:** Create `package.json`

- [ ] **Step 1: Write `package.json`**

Create `package.json`:

```json
{
  "name": "ntvu19-portfolio",
  "version": "1.0.0",
  "description": "Vu T. Nguyen — personal portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check && tsc --noEmit && tsx scripts/check-no-js.ts",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/react": "^4.0.0",
    "@astrojs/sitemap": "^3.2.1",
    "@fontsource-variable/jetbrains-mono": "^5.1.1",
    "@fontsource/ibm-plex-sans": "^5.1.0",
    "@fontsource/ibm-plex-serif": "^5.1.0",
    "astro": "^4.16.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.6.3"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "eslint": "^9.17.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-astro": "^1.3.1",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.1.0",
    "prettier": "^3.4.2",
    "prettier-plugin-astro": "^0.14.1",
    "sass": "^1.83.0",
    "tsx": "^4.19.2",
    "typescript-eslint": "^8.18.2",
    "vitest": "^2.1.8"
  },
  "packageManager": "pnpm@9.15.0"
}
```

- [ ] **Step 2: Install with pnpm**

```bash
pnpm install
```
Expected: dependencies install, `pnpm-lock.yaml` created, `node_modules/` repopulated.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
Add package.json with Astro + React + TypeScript dependencies
EOF
)"
```

### Task 1.2: Create `astro.config.mjs`

**Files:** Create `astro.config.mjs`

- [ ] **Step 1: Write `astro.config.mjs`**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ntvu19.github.io',
  output: 'static',
  integrations: [react(), mdx(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: { quietDeps: true },
      },
    },
  },
});
```

- [ ] **Step 2: Verify Astro recognizes the config**

```bash
pnpm astro --help
```
Expected: Astro CLI prints help. No "config invalid" error.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "Add astro.config.mjs"
```

### Task 1.3: Create `tsconfig.json`

**Files:** Create `tsconfig.json`

- [ ] **Step 1: Write `tsconfig.json`**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "noUncheckedIndexedAccess": true,
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@components/*": ["./src/components/*"],
      "@styles/*": ["./src/styles/*"],
      "@content/*": ["./src/content/*"],
      "@scripts/*": ["./src/scripts/*"],
      "@config/*": ["./src/config/*"]
    }
  },
  "include": ["src/**/*", "scripts/**/*", ".astro/types.d.ts", "astro.config.mjs", "eslint.config.mjs"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 2: Verify**

```bash
pnpm tsc --noEmit
```
Expected: passes (no source files yet, so no type errors).

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "Add tsconfig.json with strict mode and path aliases"
```

### Task 1.4: Create `.gitignore` and starter directories

**Files:** Create `.gitignore`, `src/`, `public/`, `scripts/`

- [ ] **Step 1: Write `.gitignore`**

Create `.gitignore`:

```
node_modules
dist
.astro
.env
.env.production
.DS_Store

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json

# OS
Thumbs.db
```

- [ ] **Step 2: Create empty starter directories with `.gitkeep`**

```bash
mkdir -p src/components src/content src/layouts src/pages src/scripts src/styles src/config public/assets scripts
```

- [ ] **Step 3: Add a placeholder `src/pages/index.astro` to allow build**

Create `src/pages/index.astro`:

```astro
---
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Vu T. Nguyen — Backend Software Engineer</title>
  </head>
  <body>
    <p>Migration in progress.</p>
  </body>
</html>
```

- [ ] **Step 4: Verify the dev server starts**

```bash
pnpm dev --host 127.0.0.1
```
Expected: server starts, prints "Local: http://127.0.0.1:4321/". Open in browser → see "Migration in progress."
Stop the server with Ctrl+C.

- [ ] **Step 5: Verify the build works**

```bash
pnpm build
ls dist/
```
Expected: `dist/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add .gitignore src/ public/ scripts/
git commit -m "$(cat <<'EOF'
Scaffold Astro project structure

Adds .gitignore, src/ directory tree, and a placeholder index.astro
so 'pnpm build' succeeds.
EOF
)"
```

**Phase 1 checkpoint:** `pnpm dev` runs, `pnpm build` produces `dist/`, repo is on `feat/astro-migration` branch.

---

## Phase 2: Linting, formatting, and editor setup

### Task 2.1: ESLint flat config

**Files:** Create `eslint.config.mjs`

- [ ] **Step 1: Write `eslint.config.mjs`**

```js
import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**', 'pnpm-lock.yaml'] },
  js.configs.recommended,
  ...ts.configs.strict,
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  prettier,
];
```

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```
Expected: passes (only the placeholder index.astro exists).

- [ ] **Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "Add ESLint flat config with TS/Astro/React/a11y plugins"
```

### Task 2.2: Prettier config

**Files:** Create `.prettierrc.json`, `.prettierignore`

- [ ] **Step 1: Write `.prettierrc.json`**

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "always",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } }
  ]
}
```

- [ ] **Step 2: Write `.prettierignore`**

```
dist
.astro
node_modules
pnpm-lock.yaml
public
```

- [ ] **Step 3: Run format check**

```bash
pnpm format:check
```
Expected: All matched files use Prettier code style!

- [ ] **Step 4: Commit**

```bash
git add .prettierrc.json .prettierignore
git commit -m "Add Prettier config with Astro plugin"
```

### Task 2.3: VS Code settings (format on save)

**Files:** Create `.vscode/settings.json`, `.vscode/extensions.json`

- [ ] **Step 1: Write `.vscode/settings.json`**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[astro]": { "editor.defaultFormatter": "astro-build.astro-vscode" },
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[scss]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[markdown]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "eslint.validate": ["javascript", "typescript", "typescriptreact", "astro"],
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.eol": "\n"
}
```

- [ ] **Step 2: Write `.vscode/extensions.json`**

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "unifiedjs.vscode-mdx"
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add .vscode/
git commit -m "Add VS Code settings for format on save and recommended extensions"
```

### Task 2.4: TS-only enforcement script

**Files:** Create `scripts/check-no-js.ts`, `tests/check-no-js.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/check-no-js.test.ts`:

```ts
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
      expect(found).toEqual([
        join(dir, 'a.js'),
        join(dir, 'sub', 'b.jsx'),
      ].sort());
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
```

- [ ] **Step 2: Run test, see it fail**

```bash
pnpm test
```
Expected: fails — module `../scripts/check-no-js` not found.

- [ ] **Step 3: Write `scripts/check-no-js.ts`**

```ts
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
```

- [ ] **Step 4: Run test, see it pass**

```bash
pnpm test
```
Expected: 2 passing tests.

- [ ] **Step 5: Run the script directly to verify the main path**

```bash
pnpm tsx scripts/check-no-js.ts
```
Expected: prints `check-no-js: OK (0 offenders in src/)`.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-no-js.ts tests/check-no-js.test.ts
git commit -m "$(cat <<'EOF'
Add TS-only enforcement script and test

Fails CI if any .js or .jsx file lands in src/.
EOF
)"
```

**Phase 2 checkpoint:** `pnpm check && pnpm lint && pnpm format:check && pnpm test` all pass.

---

## Phase 3: Design tokens and base styles

The token system must be in place before any component renders. Tokens are CSS custom properties (so theme switching works at runtime). SCSS files import `tokens.scss` for structural concerns.

### Task 3.1: Color and typography tokens

**Files:** Create `src/styles/tokens.scss`

- [ ] **Step 1: Write `src/styles/tokens.scss`**

```scss
:root,
:root[data-theme='light'] {
  --bg: oklch(0.985 0.004 90);
  --bg-alt: oklch(0.97 0.005 90);
  --bg-card: oklch(1 0 0);
  --ink: oklch(0.18 0.01 250);
  --ink-2: oklch(0.38 0.012 250);
  --ink-3: oklch(0.55 0.012 250);
  --ink-4: oklch(0.72 0.01 250);
  --rule: oklch(0.88 0.008 250);
  --rule-strong: oklch(0.78 0.012 250);
}

:root[data-theme='dark'] {
  --bg: oklch(0.16 0.008 250);
  --bg-alt: oklch(0.19 0.009 250);
  --bg-card: oklch(0.21 0.009 250);
  --ink: oklch(0.96 0.005 90);
  --ink-2: oklch(0.82 0.008 90);
  --ink-3: oklch(0.65 0.01 90);
  --ink-4: oklch(0.45 0.012 90);
  --rule: oklch(0.3 0.012 250);
  --rule-strong: oklch(0.42 0.014 250);
}

/* Accents — light theme */
:root[data-theme='light'][data-accent='green'] {
  --accent: oklch(0.62 0.17 145);
  --accent-soft: oklch(0.62 0.17 145 / 15%);
  --accent-ink: oklch(0.42 0.18 145);
}
:root[data-theme='light'][data-accent='amber'] {
  --accent: oklch(0.72 0.17 75);
  --accent-soft: oklch(0.72 0.17 75 / 15%);
  --accent-ink: oklch(0.5 0.18 75);
}
:root[data-theme='light'][data-accent='blue'] {
  --accent: oklch(0.6 0.17 245);
  --accent-soft: oklch(0.6 0.17 245 / 15%);
  --accent-ink: oklch(0.4 0.18 245);
}
:root[data-theme='light'][data-accent='magenta'] {
  --accent: oklch(0.62 0.21 340);
  --accent-soft: oklch(0.62 0.21 340 / 15%);
  --accent-ink: oklch(0.42 0.22 340);
}
:root[data-theme='light'][data-accent='mono'] {
  --accent: oklch(0.25 0.01 250);
  --accent-soft: oklch(0.25 0.01 250 / 12%);
  --accent-ink: oklch(0.2 0.01 250);
}

/* Accents — dark theme */
:root[data-theme='dark'][data-accent='green'] {
  --accent: oklch(0.78 0.18 145);
  --accent-soft: oklch(0.78 0.18 145 / 18%);
  --accent-ink: oklch(0.85 0.18 145);
}
:root[data-theme='dark'][data-accent='amber'] {
  --accent: oklch(0.82 0.16 80);
  --accent-soft: oklch(0.82 0.16 80 / 18%);
  --accent-ink: oklch(0.88 0.16 80);
}
:root[data-theme='dark'][data-accent='blue'] {
  --accent: oklch(0.74 0.16 240);
  --accent-soft: oklch(0.74 0.16 240 / 18%);
  --accent-ink: oklch(0.82 0.16 240);
}
:root[data-theme='dark'][data-accent='magenta'] {
  --accent: oklch(0.76 0.2 340);
  --accent-soft: oklch(0.76 0.2 340 / 18%);
  --accent-ink: oklch(0.84 0.2 340);
}
:root[data-theme='dark'][data-accent='mono'] {
  --accent: oklch(0.92 0.005 90);
  --accent-soft: oklch(0.92 0.005 90 / 14%);
  --accent-ink: oklch(0.96 0.005 90);
}

/* Layout / radius / spacing */
:root {
  --shell-max: 1240px;
  --gutter: 56px;
  --gutter-mobile: 24px;
  --topbar-h: 48px;
  --radius-sm: 4px;
  --radius: 8px;
  --radius-lg: 12px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens.scss
git commit -m "Add design tokens for theme/accent and layout"
```

### Task 3.2: Base styles, fonts, helpers

**Files:** Create `src/styles/base.scss`

- [ ] **Step 1: Write `src/styles/base.scss`**

```scss
@use './tokens.scss';

@import '@fontsource/ibm-plex-sans/300.css';
@import '@fontsource/ibm-plex-sans/400.css';
@import '@fontsource/ibm-plex-sans/500.css';
@import '@fontsource/ibm-plex-sans/600.css';
@import '@fontsource/ibm-plex-sans/700.css';
@import '@fontsource/ibm-plex-serif/400.css';
@import '@fontsource/ibm-plex-serif/500.css';
@import '@fontsource/ibm-plex-serif/600.css';
@import '@fontsource/ibm-plex-serif/700.css';
@import '@fontsource-variable/jetbrains-mono';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'IBM Plex Sans', -apple-system, system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  font-weight: 400;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  text-wrap: pretty;
}

::selection {
  background: var(--accent-soft);
  color: var(--accent-ink);
}

a {
  color: inherit;
  text-decoration: none;
}

a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.font-serif {
  font-family: 'IBM Plex Serif', Georgia, serif;
  font-weight: 500;
}
.font-sans {
  font-family: 'IBM Plex Sans', -apple-system, system-ui, sans-serif;
}
.font-mono {
  font-family: 'JetBrains Mono Variable', ui-monospace, 'SF Mono', Menlo, monospace;
}

.mono-label {
  font-family: 'JetBrains Mono Variable', ui-monospace, monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--ink-3);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/base.scss
git commit -m "Add base styles, font imports, helper classes"
```

### Task 3.3: Layout (shell, section header, grid background)

**Files:** Create `src/styles/layout.scss`

- [ ] **Step 1: Write `src/styles/layout.scss`**

```scss
.shell {
  max-width: var(--shell-max);
  margin: 0 auto;
  padding: 0 var(--gutter);
  position: relative;
  z-index: 2;
}

.section {
  border-bottom: 1px solid var(--rule);
  padding: 64px 0 80px;
}

.section-head {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 16px;
  align-items: baseline;
  margin-bottom: 32px;
}

.section-num {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--ink-4);
}

.section-label {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--ink-3);
  margin: 0 0 8px;
}

.section-title {
  font-family: 'IBM Plex Serif', Georgia, serif;
  font-size: 32px;
  font-weight: 500;
  line-height: 1.15;
  margin: 0;
  color: var(--ink);
}

.section-meta {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-3);
  text-align: right;
}

.bg-grid,
.bg-scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-grid {
  background-image:
    linear-gradient(to right, var(--rule) 1px, transparent 1px),
    linear-gradient(to bottom, var(--rule) 1px, transparent 1px);
  background-size: 56px 56px;
  opacity: 0.35;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 90%);
}

.bg-scanlines {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 3px,
    var(--ink) 3px,
    var(--ink) 4px
  );
  opacity: 0.01;
  z-index: 1;
}

:root[data-theme='light'] .bg-scanlines {
  mix-blend-mode: multiply;
}
:root[data-theme='dark'] .bg-scanlines {
  mix-blend-mode: screen;
}

@media (max-width: 900px) {
  .shell {
    padding: 0 var(--gutter-mobile);
  }
  .section {
    padding: 40px 0 56px;
  }
  .section-head {
    grid-template-columns: 1fr auto;
  }
  .section-num {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-scanlines {
    opacity: 0;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/layout.scss
git commit -m "Add layout styles (shell, section header, grid background)"
```

### Task 3.4: Component-level SCSS shells

These start as empty files and get filled in alongside their components. Creating them now keeps imports stable.

**Files:** Create `src/styles/{hero,experience,projects,skills,oss,now,palette,help,topbar}.scss`

- [ ] **Step 1: Create empty SCSS partials**

```bash
for f in hero experience projects skills oss now palette help topbar; do
  echo "/* $f */" > src/styles/$f.scss
done
ls src/styles/
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/
git commit -m "Stub component SCSS partials"
```

**Phase 3 checkpoint:** `pnpm build` succeeds. The placeholder index page still works; new SCSS isn't imported yet.

---

## Phase 4: Content schemas and seed data

### Task 4.1: zod schemas (`src/content/config.ts`)

**Files:** Create `src/content/config.ts`

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const company = defineCollection({
  type: 'data',
  schema: z.object({
    company: z.string(),
    order: z.number(),
    logoLight: z.string().optional(),
    logoDark: z.string().optional(),
    meta: z.string(),
    website: z.string().url().optional(),
    roles: z.array(
      z.object({
        title: z.string(),
        dates: z.string(),
        duration: z.string(),
        current: z.boolean().default(false),
        promotion: z.boolean().default(false),
        summary: z.string(),
        keywords: z.array(z.string()),
        stack: z.array(z.string()),
      }),
    ),
  }),
});

const project = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['shipped', 'in progress']),
    year: z.string(),
    role: z.string(),
    thumb: z.string().nullable().optional(),
    skills: z.array(z.string()),
    problem: z.string(),
    solved: z.array(z.string()),
    links: z.object({
      details: z.string().optional(),
      demo: z.string().optional(),
      source: z.string().optional(),
    }),
  }),
});

const skill = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        category: z.enum([
          'Languages',
          'Systems & Performance',
          'Backend & Architecture',
          'Platform & Tooling',
        ]),
        level: z.number().int().min(1).max(5),
        years: z.number(),
      }),
    ),
  }),
});

const oss = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(
      z.object({
        org: z.string(),
        repo: z.string(),
        desc: z.string(),
        stars: z.number(),
        lang: z.string(),
        url: z.string().url(),
      }),
    ),
  }),
});

export const collections = { company, project, skill, oss };
```

- [ ] **Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "Add content collection schemas"
```

### Task 4.2: Singleton type definitions

**Files:** Create `src/content/types.ts`

- [ ] **Step 1: Write `src/content/types.ts`**

```ts
export interface Identity {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  location: string;
  yearsShipping: number;
  status: string;
  contacts: Array<{
    label: 'email' | 'github' | 'linkedin' | 'telegram' | 'facebook';
    href: string;
  }>;
}

export interface NowData {
  building?: { label: string; sub?: string };
  researching?: { label: string; sub?: string };
  reading?: { label: string; sub?: string };
  workingFrom?: { label: string; sub?: string };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content/types.ts
git commit -m "Add singleton type definitions for identity and now"
```

### Task 4.3: `identity.json` (seeded from Welcome.vue)

**Files:** Create `src/content/identity.json`

- [ ] **Step 1: Write `src/content/identity.json`**

```json
{
  "name": "Vu T. Nguyen",
  "role": "Backend Software Engineer",
  "tagline": "Software engineer with a passion for *building scalable systems*, *optimizing databases*, and *designing robust architectures*.",
  "summary": "Software engineer focused on high-performance systems, low-level research, and finding/resolving problems in raw languages, runtimes and frameworks.",
  "location": "Ho Chi Minh City, Vietnam",
  "yearsShipping": 3,
  "status": "Open to interesting problems",
  "contacts": [
    { "label": "email", "href": "mailto:msc.thanhvu@gmail.com" },
    { "label": "github", "href": "https://github.com/ntvu19" },
    { "label": "linkedin", "href": "https://linkedin.com/in/nguyenthanhvu" },
    { "label": "telegram", "href": "https://t.me/ntvu19" },
    { "label": "facebook", "href": "https://facebook.com/msc.thanhvu" }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content/identity.json
git commit -m "Add identity.json seeded from current Welcome.vue"
```

### Task 4.4: `now.json` placeholder

**Files:** Create `src/content/now.json`

- [ ] **Step 1: Write `src/content/now.json`**

```json
{
  "building": {
    "label": "MetaDefender ICAP Server scanning rule engine",
    "sub": "OPSWAT · C++ / Qt"
  },
  "researching": {
    "label": "io_uring vs epoll for high-concurrency request handling",
    "sub": "evenings"
  },
  "reading": {
    "label": "Designing Data-Intensive Applications · Martin Kleppmann",
    "sub": "ch. 5 — replication"
  },
  "workingFrom": {
    "label": "Ho Chi Minh City, Vietnam",
    "sub": "GMT+7"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content/now.json
git commit -m "Add now.json placeholder"
```

### Task 4.5: `companies/opswat.yaml` (seeded from Experience.vue)

**Files:** Create `src/content/companies/opswat.yaml`

- [ ] **Step 1: Create the directory and file**

Create `src/content/companies/opswat.yaml`:

```yaml
company: OPSWAT
order: 1
logoLight: /assets/opswat-light.svg
logoDark: /assets/opswat-dark.svg
meta: Critical infrastructure protection · Cybersecurity
website: https://www.opswat.com
roles:
  - title: Software Engineer II
    dates: Jan 2026 — Present
    duration: current
    current: true
    promotion: true
    summary: >
      Working on MetaDefender ICAP Server, an ICAP server that integrates with
      ICAP-supported proxies to inspect requests for malware and sensitive
      data. Designing scalable architecture, enhancing scanning rules, and
      optimizing database performance. Practising test-driven and
      domain-driven development to minimize user-impacting issues.
    keywords:
      - Software Architecture
      - Database Optimization
      - ICAP Protocol
      - High Concurrency
      - RESTful API
      - Security
    stack: [cpp, qt, cmake, windows11, linux, postgresql, sqlite, nginx, jenkins, docker, grpc, junit]
  - title: Software Engineer
    dates: Jan 2025 — Dec 2025
    duration: 1 yr
    promotion: true
    summary: >
      Continued MetaDefender ICAP work — central management integration,
      AV-scan-server orchestration, scan-rule extensions (file type, request
      info, encryption/decryption).
    keywords:
      - ICAP Protocol
      - Central Management
      - RESTful API
      - Unit Testing
    stack: [cpp, qt, cmake, linux, postgresql, sqlite, jenkins, docker, grpc, junit]
  - title: Associate Software Engineer
    dates: Jan 2024 — Dec 2024
    duration: 1 yr
    summary: >
      Joined the MetaDefender ICAP team as an associate engineer. Picked up
      C++/Qt, contributed to scanning-rule features and unit-test coverage.
    keywords:
      - C++
      - Qt
      - Unit Testing
    stack: [cpp, qt, cmake, linux, junit]
```

- [ ] **Step 2: Commit**

```bash
git add src/content/companies/
git commit -m "Add OPSWAT company seed (3 roles from current Experience.vue)"
```

### Task 4.6: Project MDX files (seeded from Project.vue)

**Files:** Create `src/content/projects/{hcmus-event-management,h4-webserver,video-streaming-platform}.mdx`

- [ ] **Step 1: Create `src/content/projects/hcmus-event-management.mdx`**

```mdx
---
id: PRJ-01
order: 1
title: HCMUS Event Management
tagline: University-level graduation project (rated 9.3/10) — event organization & ticketing for campus.
status: shipped
year: '2023'
role: Backend lead (5-person team)
thumb: null
skills: [nestjs, postgresql, redis, docker, kubernetes, nats, swagger, aws-s3]
problem: Build a scalable, maintainable platform for organizing campus events and selling tickets to students.
solved:
  - Microservice architecture (NestJS) with NATS Streaming for inter-service messaging
  - ACID-safe ticketing under high concurrency
  - OAuth 2.0 authentication and email integration
  - Database optimization and security hardening
links:
  source: https://github.com/ntvu19
  demo: https://youtu.be/j01f4toU83A
---
```

- [ ] **Step 2: Create `src/content/projects/h4-webserver.mdx`**

```mdx
---
id: PRJ-02
order: 2
title: H4 — High Performance Web Server
tagline: Custom HTTP server in C++ from scratch — async I/O, TLS, auth, logging.
status: shipped
year: '2023'
role: Sole author
thumb: null
skills: [cpp, linux, postgresql, docker, cmake]
problem: Build a high-performance HTTP server in C++ that accepts and processes large volumes of concurrent requests.
solved:
  - HTTP parser and middleware architecture
  - Asynchronous I/O for concurrent request handling
  - PostgreSQL integration and authentication
  - Pattern-driven, extensible request pipeline
links:
  source: https://github.com/ntvu19
---
```

- [ ] **Step 3: Create `src/content/projects/video-streaming-platform.mdx`**

```mdx
---
id: PRJ-03
order: 3
title: Video Streaming Platform
tagline: Cost-optimized streaming platform with high-load capacity and unlimited horizontal scale.
status: shipped
year: '2024'
role: Backend
thumb: null
skills: [java-spring, vuejs, postgresql, kubernetes, aws-s3, redis]
problem: Allow moderators to upload movies/cartoons and users to watch online — handle high concurrency at the lowest cost possible.
solved:
  - Microservice topology with Java Spring + Redis
  - Cost-aware S3 storage tiering
  - Database optimization for read-heavy workloads
  - High-concurrency streaming with Kubernetes-managed scale-out
links:
  source: https://github.com/ntvu19
---
```

- [ ] **Step 4: Verify Astro can validate the collections**

```bash
pnpm astro check
```
Expected: 0 errors, 0 warnings related to content collections.

- [ ] **Step 5: Commit**

```bash
git add src/content/projects/
git commit -m "Add 3 project MDX files seeded from current Project.vue"
```

### Task 4.7: `skill/skills.yaml` and `oss/oss.yaml`

**Files:** Create `src/content/skill/skills.yaml`, `src/content/oss/oss.yaml`

Astro content collections require the directory name to match the collection key. Our schemas define the keys as `skill` and `oss`, so files live at `src/content/skill/<slug>.yaml` and `src/content/oss/<slug>.yaml`.

- [ ] **Step 1: Create `src/content/skill/skills.yaml`**

Levels: 5 = expert (T5), 4 = advanced (T4), 3 = proficient (T3), 1–2 = familiar (T2). User will tune.

```yaml
items:
  - { name: C++,            category: Languages,                  level: 5, years: 3 }
  - { name: TypeScript,     category: Languages,                  level: 4, years: 3 }
  - { name: Java,           category: Languages,                  level: 3, years: 2 }
  - { name: Python,         category: Languages,                  level: 3, years: 2 }
  - { name: Go,             category: Languages,                  level: 2, years: 1 }

  - { name: Qt,             category: 'Systems & Performance',    level: 4, years: 2 }
  - { name: CMake,          category: 'Systems & Performance',    level: 4, years: 2 }
  - { name: Linux,          category: 'Systems & Performance',    level: 4, years: 3 }
  - { name: ICAP Protocol,  category: 'Systems & Performance',    level: 4, years: 2 }

  - { name: PostgreSQL,     category: 'Backend & Architecture',   level: 5, years: 3 }
  - { name: SQLite,         category: 'Backend & Architecture',   level: 4, years: 2 }
  - { name: Redis,          category: 'Backend & Architecture',   level: 3, years: 2 }
  - { name: NestJS,         category: 'Backend & Architecture',   level: 4, years: 2 }
  - { name: Java Spring,    category: 'Backend & Architecture',   level: 3, years: 1 }
  - { name: gRPC,           category: 'Backend & Architecture',   level: 3, years: 2 }
  - { name: NATS Streaming, category: 'Backend & Architecture',   level: 2, years: 1 }

  - { name: Docker,         category: 'Platform & Tooling',       level: 4, years: 3 }
  - { name: Kubernetes,     category: 'Platform & Tooling',       level: 3, years: 2 }
  - { name: NGINX,          category: 'Platform & Tooling',       level: 3, years: 2 }
  - { name: Jenkins,        category: 'Platform & Tooling',       level: 3, years: 2 }
  - { name: Git,            category: 'Platform & Tooling',       level: 5, years: 4 }
  - { name: AWS S3,         category: 'Platform & Tooling',       level: 2, years: 1 }
```

- [ ] **Step 2: Create `src/content/oss/oss.yaml`**

```yaml
items: []
```

- [ ] **Step 3: Create the directories first if needed**

```bash
mkdir -p src/content/skill src/content/oss
```

(The Step 1 / Step 2 file creations should already have created these directories via your editor; this step is a safety net.)

- [ ] **Step 4: Verify**

```bash
pnpm astro check
```
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/skill/ src/content/oss/
git commit -m "Add skills.yaml seed and empty oss.yaml in collection dirs"
```

**Phase 4 checkpoint:** `pnpm astro check` passes; all content validates against schemas.

---

## Phase 5: Migrate static assets

### Task 5.1: Migrate avatar and stack icons

The current site has assets in `docs/.vuepress/public/`. We deleted that folder in Phase 0 — but `git` history still has them. Restore selectively from history.

**Files:** Create `public/avatar.jfif`, `public/assets/*.svg`, `public/favicon.svg`

- [ ] **Step 1: Restore avatar from git history**

```bash
git show main:docs/.vuepress/public/avatar.jfif > public/avatar.jfif
ls -lh public/avatar.jfif
```
Expected: file exists, size > 0.

- [ ] **Step 2: Restore stack icons**

The icons we need (per spec): cpp, qt, cmake, windows11, linux, postgresql, sqlite, nginx, jenkins, docker, grpc, junit, opswat-light, opswat-dark, plus the current-site additions: nestjs, redis, kubernetes, swagger, aws, spring, vuejs.

```bash
for icon in cpp qt cmake windows11 linux postgresql sqlite nginx jenkins docker grpc junit nestjs redis kubernetes swagger aws spring vuejs; do
  git show "main:docs/.vuepress/public/icon/skill/$icon.svg" > "public/assets/$icon.svg" 2>/dev/null && echo "  ok: $icon"
done
```
Expected: each line printed for icons that existed in `main`. Some may not exist (no-op for those).

- [ ] **Step 3: Restore OPSWAT logo files**

```bash
# These come from the claude/assets/ design pack which is in the working tree.
cp claude/assets/opswat-light.svg claude/assets/opswat-dark.svg public/assets/
ls public/assets/
```

- [ ] **Step 4: Add a simple favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#13ad6a"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-size="16" font-weight="600" fill="#ffffff">V</text>
</svg>
```

- [ ] **Step 5: Add `robots.txt`**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://ntvu19.github.io/sitemap-index.xml
```

- [ ] **Step 6: Verify**

```bash
pnpm build
ls dist/assets/ 2>/dev/null
```
Expected: build succeeds; some assets may be re-emitted by Astro.

- [ ] **Step 7: Commit**

```bash
git add public/
git commit -m "$(cat <<'EOF'
Migrate avatar, stack icons, and add favicon + robots

Restores avatar.jfif and skill SVGs from git history; copies opswat
logos from claude/assets; adds a minimalist favicon and robots.txt.
EOF
)"
```

**Phase 5 checkpoint:** `public/` has avatar, icons, favicon, robots.txt. Build succeeds.

---

## Phase 6: Variant config and base layout

### Task 6.1: Variant config (`src/config/site.ts`)

**Files:** Create `src/config/site.ts`

- [ ] **Step 1: Write `src/config/site.ts`**

```ts
export type HeroVariant = 'split' | 'terminal' | 'centered';
export type ExperienceVariant = 'timeline' | 'cards' | 'table';
export type ProjectVariant = 'grid' | 'list' | 'expanded';
export type ThemeMode = 'light' | 'dark';
export type AccentId = 'green' | 'amber' | 'blue' | 'magenta' | 'mono';

export interface SiteConfig {
  heroVariant: HeroVariant;
  experienceVariant: ExperienceVariant;
  projectVariant: ProjectVariant;
  defaultTheme: ThemeMode;
  defaultAccent: AccentId;
}

// Edit these values to swap variants and defaults at build time.
export const site: SiteConfig = {
  heroVariant: 'split',
  experienceVariant: 'timeline',
  projectVariant: 'grid',
  defaultTheme: 'light',
  defaultAccent: 'green',
};
```

Note: explicit `SiteConfig` typing (rather than `as const`) is intentional. `as const` would narrow each value to a literal type, breaking the `===` comparisons in `index.astro` (TypeScript would flag them as "comparison has no overlap"). The wider type lets users change values without TS friction.

- [ ] **Step 2: Commit**

```bash
git add src/config/site.ts
git commit -m "Add build-time variant + theme config"
```

### Task 6.2: `BaseLayout.astro`

**Files:** Create `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write `src/layouts/BaseLayout.astro`**

```astro
---
import { site } from '../config/site';
import identity from '../content/identity.json';
import '../styles/tokens.scss';
import '../styles/base.scss';
import '../styles/layout.scss';
import '../styles/topbar.scss';
import '../styles/hero.scss';
import '../styles/now.scss';
import '../styles/experience.scss';
import '../styles/projects.scss';
import '../styles/skills.scss';
import '../styles/oss.scss';
import '../styles/palette.scss';
import '../styles/help.scss';

export interface Props {
  title?: string;
  description?: string;
}

const {
  title = `${identity.name} — ${identity.role}`,
  description = identity.summary.replace(/\*([^*]+)\*/g, '$1'),
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site).toString();

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: identity.name,
  jobTitle: identity.role,
  description,
  url: canonical,
  sameAs: identity.contacts.filter((c) => c.label !== 'email').map((c) => c.href),
};
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json" set:html={JSON.stringify(personSchema)} />

    <script is:inline define:vars={{ defaultTheme: site.defaultTheme, defaultAccent: site.defaultAccent }}>
      const t =
        localStorage.getItem('vtn:theme') ??
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : defaultTheme);
      const a = localStorage.getItem('vtn:accent') ?? defaultAccent;
      document.documentElement.setAttribute('data-theme', t);
      document.documentElement.setAttribute('data-accent', a);
    </script>
  </head>
  <body>
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-scanlines" aria-hidden="true"></div>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "Add BaseLayout with theme init, JSON-LD, OG tags"
```

### Task 6.3: `SectionHead.astro`

**Files:** Create `src/components/SectionHead.astro`

- [ ] **Step 1: Write `src/components/SectionHead.astro`**

```astro
---
export interface Props {
  num: string;
  label: string;
  title: string;
  meta?: string;
}
const { num, label, title, meta } = Astro.props;
---

<header class="section-head">
  <span class="section-num">§{num}</span>
  <div>
    <p class="section-label">↳ {label}</p>
    <h2 class="section-title">{title}</h2>
  </div>
  {meta && <span class="section-meta">{meta}</span>}
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionHead.astro
git commit -m "Add SectionHead component"
```

### Task 6.4: `TopBar.astro` and `topbar.scss`

**Files:** Create `src/components/TopBar.astro`, fill in `src/styles/topbar.scss`

- [ ] **Step 1: Write `src/styles/topbar.scss`**

```scss
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--topbar-h);
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--rule);

  & > .shell {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 24px;
  }
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-2);
}

.topbar-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 var(--accent-soft);
  animation: vtn-pulse 1.6s infinite;
}

@keyframes vtn-pulse {
  0% { box-shadow: 0 0 0 0 var(--accent-soft); }
  70% { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .topbar-pulse { animation: none; }
}

.topbar-nav {
  display: flex;
  gap: 20px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--ink-3);
}

.topbar-nav a[aria-current='true'] {
  color: var(--accent-ink);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-self: end;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-3);
}

.topbar-kbd {
  padding: 2px 6px;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-sm);
  font-size: 10px;
  background: var(--bg-card);
}

@media (max-width: 900px) {
  .topbar-nav { display: none; }
}
```

- [ ] **Step 2: Write `src/components/TopBar.astro`**

```astro
---
import identity from '../content/identity.json';
const sections = [
  { id: 'experience', num: '01', label: 'Experience' },
  { id: 'projects', num: '02', label: 'Projects' },
  { id: 'skills', num: '03', label: 'Skills' },
  { id: 'oss', num: '04', label: 'Open Source' },
];
const initials = identity.name
  .split(' ')
  .map((s) => s[0])
  .join('');
---

<header class="topbar">
  <div class="shell">
    <a href="#hero" class="topbar-brand" aria-label="back to top">
      <span class="topbar-pulse" aria-hidden="true"></span>
      <span>{initials} ·· portfolio</span>
    </a>
    <nav class="topbar-nav" aria-label="sections">
      {
        sections.map((s) => (
          <a href={`#${s.id}`} data-section-link={s.id}>
            {s.num} · {s.label}
          </a>
        ))
      }
    </nav>
    <div class="topbar-actions">
      <button type="button" data-palette-trigger aria-label="open command palette">
        <span class="topbar-kbd">⌘K</span>
      </button>
      <button type="button" data-theme-toggle aria-label="toggle theme">◐</button>
    </div>
  </div>
</header>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TopBar.astro src/styles/topbar.scss
git commit -m "Add TopBar with brand, nav, palette + theme buttons"
```

### Task 6.5: `Footer.astro`

**Files:** Create `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
import identity from '../content/identity.json';
const year = new Date().getUTCFullYear();
const githubLink = identity.contacts.find((c) => c.label === 'github')?.href;
---

<footer class="shell" style="padding: 32px 56px; border-top: 1px solid var(--rule);">
  <div
    style="display: flex; justify-content: space-between; gap: 16px; font-family: 'JetBrains Mono Variable', monospace; font-size: 11px; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.16em;"
  >
    <span>© {year} {identity.name}</span>
    {
      githubLink && (
        <a href={githubLink} rel="noopener" target="_blank">
          source
        </a>
      )
    }
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "Add minimal Footer with year and source link"
```

### Task 6.6: Icon components

**Files:** Create `src/components/icons/{Mail,Github,Linkedin,Telegram,Facebook,Search,External,Star,Arrow,Hash}Icon.astro`

- [ ] **Step 1: Create the icons directory and shared icon files**

Each icon is a 16×16 SVG using `currentColor`. Create `src/components/icons/MailIcon.astro`:

```astro
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="2" y="3" width="12" height="10" rx="1.5" />
  <path d="M2.5 4.5l5.5 4 5.5-4" />
</svg>
```

`src/components/icons/GithubIcon.astro`:

```astro
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
</svg>
```

`src/components/icons/LinkedinIcon.astro`:

```astro
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM20 19h-3v-5.6c0-1.4-.5-2.3-1.7-2.3a1.9 1.9 0 0 0-1.7 1.2c-.1.2-.1.5-.1.8V19h-3V8h3v1.3a3 3 0 0 1 2.7-1.5c2 0 3.5 1.3 3.5 4V19z" />
</svg>
```

`src/components/icons/TelegramIcon.astro`:

```astro
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z" />
</svg>
```

`src/components/icons/FacebookIcon.astro`:

```astro
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.96h-1.52c-1.5 0-1.96.93-1.96 1.88V12h3.34l-.53 3.47h-2.81v8.38A12 12 0 0 0 24 12" />
</svg>
```

`src/components/icons/SearchIcon.astro`:

```astro
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="7" cy="7" r="5" />
  <path d="M11 11l3 3" />
</svg>
```

`src/components/icons/ExternalIcon.astro`:

```astro
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M9 2h5v5" />
  <path d="M14 2L7 9" />
  <path d="M13 9v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" />
</svg>
```

`src/components/icons/StarIcon.astro`:

```astro
<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
  <path d="M8 1.3l2 4.4 4.7.5-3.5 3.3 1 4.7L8 11.9l-4.2 2.3 1-4.7L1.3 6.2l4.7-.5z" />
</svg>
```

`src/components/icons/ArrowIcon.astro`:

```astro
<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M3 8h10" />
  <path d="M9 4l4 4-4 4" />
</svg>
```

`src/components/icons/HashIcon.astro`:

```astro
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"
     stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
  <path d="M5 1L3 15M13 1l-2 14M1 5h14M1 11h14" />
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/icons/
git commit -m "Add SVG icon components (mail, github, linkedin, etc.)"
```

### Task 6.7: `AvatarBlock.astro`

**Files:** Create `src/components/AvatarBlock.astro`

- [ ] **Step 1: Write `src/components/AvatarBlock.astro`**

```astro
---
import identity from '../content/identity.json';

export interface Props {
  size?: number;
}

const { size = 280 } = Astro.props;
const tz = identity.location.split(', ').pop() ?? identity.location;
---

<div class="avatar-block" style={`--avatar-size: ${size}px`}>
  <div class="avatar-frame">
    <span class="avatar-label-tl mono-label">// portrait</span>
    <span class="avatar-label-tr mono-label">v.2026</span>
    <img
      src="/avatar.jfif"
      alt={`Portrait of ${identity.name}`}
      width={size}
      height={size}
      loading="eager"
    />
  </div>
  <div class="avatar-tag">
    <span class="mono-label">@ntvu19</span>
    <span style="display: inline-flex; align-items: center; gap: 6px;">
      <span class="topbar-pulse" aria-hidden="true"></span>
      <span class="mono-label">{identity.status}</span>
    </span>
    <span class="mono-label" style="color: var(--ink-3);">{tz}</span>
  </div>
</div>

<style lang="scss">
  .avatar-block {
    display: grid;
    gap: 16px;
    width: 100%;
  }
  .avatar-frame {
    position: relative;
    width: var(--avatar-size);
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid var(--rule-strong);
    background: var(--bg-card);
  }
  .avatar-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  .avatar-label-tl,
  .avatar-label-tr {
    position: absolute;
    top: -22px;
  }
  .avatar-label-tl { left: 0; }
  .avatar-label-tr { right: 0; }
  .avatar-tag {
    display: grid;
    gap: 8px;
    padding: 12px 16px;
    border: 1px solid var(--rule);
    border-radius: var(--radius);
    background: var(--bg-card);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AvatarBlock.astro
git commit -m "Add AvatarBlock with mono labels and tag card"
```

**Phase 6 checkpoint:** All shared components exist; build still succeeds.

---

## Phase 7: Hero variants

### Task 7.1: `HeroSplit.astro` (default) + `hero.scss`

**Files:** Create `src/components/hero/HeroSplit.astro`, fill in `src/styles/hero.scss`

- [ ] **Step 1: Write `src/styles/hero.scss`**

```scss
.hero {
  padding: 80px 0 96px;
  position: relative;
  border-bottom: 1px solid var(--rule);
}

.hero-split {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;
  align-items: start;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: var(--ink-3);
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.hero-eyebrow::before {
  content: '';
  width: 32px;
  height: 1px;
  background: var(--rule-strong);
}

.hero-name {
  font-family: 'IBM Plex Serif', Georgia, serif;
  font-size: clamp(48px, 8vw, 92px);
  font-weight: 500;
  line-height: 1;
  margin: 0 0 24px;
  color: var(--ink);
}

.hero-name .accent {
  color: var(--accent);
}

.hero-tagline {
  font-family: 'IBM Plex Serif', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.45;
  color: var(--ink-2);
  max-width: 60ch;
  margin: 0 0 32px;
}

.hero-tagline em {
  font-style: normal;
  background: var(--accent-soft);
  color: var(--accent-ink);
  padding: 0 4px;
  border-radius: 2px;
}

.hero-meta {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--rule);
}

.hero-meta dt {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--ink-4);
  margin-bottom: 4px;
}

.hero-meta dd {
  margin: 0;
  font-size: 14px;
  color: var(--ink-2);
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  font-size: 13px;
  color: var(--ink-2);
  transition: border-color 120ms ease, color 120ms ease;
}

.hero-link:hover {
  border-color: var(--accent);
  color: var(--accent-ink);
}

.hero-centered {
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 24px;
}

.hero-terminal {
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  padding: 24px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-2);
  max-width: 100%;
  overflow-x: auto;
}

.hero-terminal-prompt { color: var(--accent-ink); }
.hero-terminal-comment { color: var(--ink-4); }
.hero-terminal-cursor::after {
  content: '▍';
  margin-left: 2px;
  animation: vtn-cursor 1s steps(2) infinite;
}
@keyframes vtn-cursor {
  50% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-terminal-cursor::after { animation: none; }
}

@media (max-width: 900px) {
  .hero-split {
    grid-template-columns: 1fr;
  }
  .hero-meta {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 2: Write `src/components/hero/HeroSplit.astro`**

```astro
---
import identity from '../../content/identity.json';
import AvatarBlock from '../AvatarBlock.astro';
import MailIcon from '../icons/MailIcon.astro';
import GithubIcon from '../icons/GithubIcon.astro';
import LinkedinIcon from '../icons/LinkedinIcon.astro';

const taglineHtml = identity.tagline.replace(/\*([^*]+)\*/g, '<em>$1</em>');
const mainContacts = identity.contacts.filter((c) =>
  ['email', 'github', 'linkedin'].includes(c.label),
);
const iconFor = (label: string) => ({
  email: MailIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon,
})[label as 'email' | 'github' | 'linkedin'];
---

<section id="hero" data-section class="hero shell">
  <div class="hero-split">
    <div>
      <div class="hero-eyebrow">§00 · whoami</div>
      <h1 class="hero-name">
        {identity.name}<span class="accent">.</span>
      </h1>
      <p class="hero-tagline" set:html={taglineHtml}></p>
      <div class="hero-links">
        {
          mainContacts.map((c) => {
            const Icon = iconFor(c.label);
            return (
              <a href={c.href} class="hero-link" rel="noopener" target="_blank">
                {Icon && <Icon />}
                <span>{c.label}</span>
              </a>
            );
          })
        }
      </div>
      <dl class="hero-meta">
        <div>
          <dt>Role</dt>
          <dd>{identity.role}</dd>
        </div>
        <div>
          <dt>Based in</dt>
          <dd>{identity.location}</dd>
        </div>
        <div>
          <dt>Years shipping</dt>
          <dd>{identity.yearsShipping}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{identity.status}</dd>
        </div>
      </dl>
    </div>
    <AvatarBlock />
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/HeroSplit.astro src/styles/hero.scss
git commit -m "Add HeroSplit (default) + hero styles"
```

### Task 7.2: `HeroCentered.astro`

**Files:** Create `src/components/hero/HeroCentered.astro`

- [ ] **Step 1: Write `src/components/hero/HeroCentered.astro`**

```astro
---
import identity from '../../content/identity.json';
const taglineHtml = identity.tagline.replace(/\*([^*]+)\*/g, '<em>$1</em>');
---

<section id="hero" data-section class="hero shell">
  <div class="hero-centered">
    <img
      src="/avatar.jfif"
      alt={`Portrait of ${identity.name}`}
      width={120}
      height={120}
      style="border-radius: 50%; border: 1px solid var(--rule-strong);"
    />
    <h1 class="hero-name" style="font-size: clamp(40px, 6vw, 64px);">
      {identity.name}<span class="accent">.</span>
    </h1>
    <p class="hero-tagline" set:html={taglineHtml}></p>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/hero/HeroCentered.astro
git commit -m "Add HeroCentered variant"
```

### Task 7.3: `HeroTerminal.tsx` (React island)

**Files:** Create `src/components/hero/HeroTerminal.tsx`

- [ ] **Step 1: Write `src/components/hero/HeroTerminal.tsx`**

```tsx
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
    <pre class="hero-terminal">
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
            <span class={cls}>{line.text}</span>
            {isLast && <span class="hero-terminal-cursor" />}
          </div>
        );
      })}
    </pre>
  );
}
```

Note: Astro/React in TSX uses `class` (not `className`) when paired with the Astro JSX runtime. If your editor flags this, prefer `className` — Astro's React integration accepts both at runtime, but `className` is the React idiom and TypeScript types may prefer it.

Replace `class=` with `className=` if you hit TS errors:

- [ ] **Step 2: If TS complains about `class`, replace it**

```bash
# Only run if pnpm check fails on the class= usage
sed -i 's/class=/className=/g' src/components/hero/HeroTerminal.tsx
```

- [ ] **Step 3: Verify**

```bash
pnpm check
```
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/hero/HeroTerminal.tsx
git commit -m "Add HeroTerminal React island with typing animation"
```

**Phase 7 checkpoint:** Three hero variants exist; none are wired into `index.astro` yet.

---

## Phase 8: Now block

### Task 8.1: `Now.astro` + `now.scss`

**Files:** Create `src/components/now/Now.astro`, fill in `src/styles/now.scss`

- [ ] **Step 1: Write `src/styles/now.scss`**

```scss
.now {
  position: relative;
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--bg-card);
  padding: 32px;
  margin-top: 24px;
}

.now-notch {
  position: absolute;
  top: -10px;
  left: 16px;
  background: var(--bg);
  padding: 0 8px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-3);
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.now-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.now-row {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 12px;
  align-items: start;
}

.now-row-arrow {
  color: var(--accent);
  font-family: 'JetBrains Mono Variable', monospace;
}

.now-row-label {
  color: var(--ink);
  margin-bottom: 4px;
}

.now-row-sub {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-3);
}

@media (max-width: 900px) {
  .now-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Write `src/components/now/Now.astro`**

The Now block sits between Hero (§00) and Experience (§01) and intentionally has no `§NN` number — only the `// now` notch identifies it (per spec §6.3).

```astro
---
import nowData from '../../content/now.json';

const rows = [
  { key: 'building', label: 'Building' },
  { key: 'researching', label: 'Researching' },
  { key: 'reading', label: 'Reading' },
  { key: 'workingFrom', label: 'Working from' },
] as const;

const items = rows
  .map((r) => ({ ...r, data: (nowData as Record<string, { label: string; sub?: string } | undefined>)[r.key] }))
  .filter((r): r is typeof r & { data: { label: string; sub?: string } } => Boolean(r.data));
---

<section id="now" data-section class="shell" style="padding: 32px 0;">
  <div class="now">
    <span class="now-notch">// now</span>
    <div class="now-grid">
      {
        items.map((it) => (
          <div class="now-row">
            <span class="now-row-arrow">↳</span>
            <div>
              <div class="now-row-label">
                <strong>{it.label}:</strong> {it.data.label}
              </div>
              {it.data.sub && <div class="now-row-sub">{it.data.sub}</div>}
            </div>
          </div>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/now/ src/styles/now.scss
git commit -m "Add Now block with notch label and 2-col grid"
```

---

## Phase 9: Experience variants

### Task 9.1: Shared `StackBadge.astro`

**Files:** Create `src/components/experience/StackBadge.astro`

- [ ] **Step 1: Write `src/components/experience/StackBadge.astro`**

```astro
---
export interface Props {
  id: string;
  size?: number;
}
const { id, size = 22 } = Astro.props;
const src = `/assets/${id}.svg`;
---

<span
  class="stack-badge"
  style={`width: ${size}px; height: ${size}px;`}
  title={id}
>
  <img src={src} alt={id} width={size} height={size} loading="lazy" />
</span>

<style lang="scss">
  .stack-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-card);
    border: 1px solid var(--rule);
    border-radius: var(--radius-sm);
    padding: 2px;
  }
  .stack-badge img {
    object-fit: contain;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/experience/StackBadge.astro
git commit -m "Add StackBadge for stack-icon rendering"
```

### Task 9.2: `ExperienceTimeline.astro` (default) + `experience.scss`

**Files:** Create `src/components/experience/ExperienceTimeline.astro`, fill in `src/styles/experience.scss`

- [ ] **Step 1: Write `src/styles/experience.scss`**

```scss
.exp-timeline {
  position: relative;
  padding-left: 56px;
}

.exp-timeline::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--rule);
}

.exp-company {
  margin-bottom: 48px;
  position: relative;
}

.exp-company-marker {
  position: absolute;
  left: -56px;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--rule-strong);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-2);
  overflow: hidden;
}

.exp-company-marker img {
  max-width: 70%;
  max-height: 70%;
}

.exp-company-name {
  font-family: 'IBM Plex Serif', Georgia, serif;
  font-size: 22px;
  font-weight: 500;
  margin: 0 0 4px;
}

.exp-company-meta {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-3);
  margin-bottom: 24px;
}

.exp-role {
  position: relative;
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px dashed var(--rule);
}

.exp-role-marker {
  position: absolute;
  left: -47px;
  top: 22px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid var(--rule-strong);
  background: var(--bg);
}

.exp-role.is-current .exp-role-marker {
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.exp-role-dates {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-3);
}

.exp-role-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 8px;
}

.exp-role-pill {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--accent-soft);
  color: var(--accent-ink);
}

.exp-role-summary {
  margin: 8px 0 12px;
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.55;
}

.exp-role-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.exp-role-keyword {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  color: var(--ink-3);
}

.exp-role-stack {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .exp-timeline { padding-left: 0; }
  .exp-timeline::before { display: none; }
  .exp-company-marker { position: static; margin-bottom: 12px; }
  .exp-role { grid-template-columns: 1fr; }
  .exp-role-marker { display: none; }
}

/* Cards variant */
.exp-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
}

.exp-card {
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  padding: 20px;
  background: var(--bg-card);
}

/* Table variant */
.exp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.exp-table th,
.exp-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--rule);
  text-align: left;
}

.exp-table th {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--ink-3);
}
```

- [ ] **Step 2: Write `src/components/experience/ExperienceTimeline.astro`**

```astro
---
import { getCollection } from 'astro:content';
import SectionHead from '../SectionHead.astro';
import StackBadge from './StackBadge.astro';

const companies = (await getCollection('company')).sort((a, b) => b.data.order - a.data.order);
const totalRoles = companies.reduce((sum, c) => sum + c.data.roles.length, 0);
---

<section id="experience" data-section class="section shell">
  <SectionHead
    num="01"
    label="↳ work history"
    title="Where I've shipped, and how the title moved."
    meta={`${companies.length} ${companies.length === 1 ? 'company' : 'companies'} · ${totalRoles} ${totalRoles === 1 ? 'role' : 'roles'}`}
  />
  <div class="exp-timeline">
    {
      companies.map((c) => (
        <div class="exp-company">
          <div class="exp-company-marker">
            {c.data.logoLight ? (
              <img src={c.data.logoLight} alt={c.data.company} />
            ) : (
              c.data.company.slice(0, 2).toUpperCase()
            )}
          </div>
          <h3 class="exp-company-name">{c.data.company}</h3>
          <div class="exp-company-meta">{c.data.meta}</div>
          {c.data.roles.map((r) => (
            <div class:list={['exp-role', { 'is-current': r.current }]}>
              <span class="exp-role-marker" />
              <div class="exp-role-dates">
                {r.dates}
                <div style="color: var(--ink-4); margin-top: 2px;">{r.duration}</div>
              </div>
              <div>
                <div class="exp-role-title">
                  {r.title}
                  {r.current && <span class="exp-role-pill">current</span>}
                  {r.promotion && !r.current && <span class="exp-role-pill">↑ promoted</span>}
                </div>
                <p class="exp-role-summary">{r.summary}</p>
                <div class="exp-role-keywords">
                  {r.keywords.map((k) => (
                    <span class="exp-role-keyword">{k}</span>
                  ))}
                </div>
                <div class="exp-role-stack">
                  {r.stack.map((id) => <StackBadge id={id} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))
    }
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/experience/ExperienceTimeline.astro src/styles/experience.scss
git commit -m "Add ExperienceTimeline (default) + experience styles"
```

### Task 9.3: `ExperienceCards.astro`

**Files:** Create `src/components/experience/ExperienceCards.astro`

- [ ] **Step 1: Write `src/components/experience/ExperienceCards.astro`**

```astro
---
import { getCollection } from 'astro:content';
import SectionHead from '../SectionHead.astro';
import StackBadge from './StackBadge.astro';

const companies = (await getCollection('company')).sort((a, b) => b.data.order - a.data.order);
const allRoles = companies.flatMap((c) => c.data.roles.map((r) => ({ ...r, company: c.data.company })));
---

<section id="experience" data-section class="section shell">
  <SectionHead num="01" label="↳ work history" title="Where I've shipped, and how the title moved." />
  <div class="exp-cards">
    {
      allRoles.map((r) => (
        <article class="exp-card">
          <div class="exp-role-dates" style="margin-bottom: 8px;">{r.dates}</div>
          <div class="exp-role-title">
            {r.title}
            {r.current && <span class="exp-role-pill">current</span>}
            {r.promotion && !r.current && <span class="exp-role-pill">↑ promoted</span>}
          </div>
          <div class="exp-company-meta" style="margin: 4px 0 12px;">{r.company}</div>
          <p class="exp-role-summary">{r.summary}</p>
          <div class="exp-role-keywords">
            {r.keywords.map((k) => <span class="exp-role-keyword">{k}</span>)}
          </div>
          <div class="exp-role-stack" style="margin-top: 12px;">
            {r.stack.map((id) => <StackBadge id={id} />)}
          </div>
        </article>
      ))
    }
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/experience/ExperienceCards.astro
git commit -m "Add ExperienceCards variant"
```

### Task 9.4: `ExperienceTable.astro`

**Files:** Create `src/components/experience/ExperienceTable.astro`

- [ ] **Step 1: Write `src/components/experience/ExperienceTable.astro`**

```astro
---
import { getCollection } from 'astro:content';
import SectionHead from '../SectionHead.astro';

const companies = (await getCollection('company')).sort((a, b) => b.data.order - a.data.order);
const rows = companies.flatMap((c) => c.data.roles.map((r) => ({ ...r, company: c.data.company })));
---

<section id="experience" data-section class="section shell">
  <SectionHead num="01" label="↳ work history" title="Where I've shipped, and how the title moved." />
  <table class="exp-table">
    <thead>
      <tr>
        <th>Dates</th>
        <th>Role</th>
        <th>Company</th>
        <th>Keywords</th>
      </tr>
    </thead>
    <tbody>
      {
        rows.map((r) => (
          <tr>
            <td>{r.dates}</td>
            <td>{r.title}</td>
            <td>{r.company}</td>
            <td>{r.keywords.join(', ')}</td>
          </tr>
        ))
      }
    </tbody>
  </table>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/experience/ExperienceTable.astro
git commit -m "Add ExperienceTable variant"
```

**Phase 9 checkpoint:** All experience variants build.

---

## Phase 10: Project variants

### Task 10.1: `ProjectGrid.astro` (default) + `projects.scss`

**Files:** Create `src/components/projects/ProjectGrid.astro`, fill in `src/styles/projects.scss`

- [ ] **Step 1: Write `src/styles/projects.scss`**

```scss
.proj-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.proj-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--bg-card);
  overflow: hidden;
  transition: border-color 120ms ease;
}

.proj-card:hover,
.proj-card:focus-within {
  border-color: var(--accent);
}

.proj-thumb {
  aspect-ratio: 16 / 9;
  background: var(--bg-alt);
  position: relative;
  border-bottom: 1px solid var(--rule);
}

.proj-thumb-stripes {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    var(--rule) 0,
    var(--rule) 1px,
    transparent 1px,
    transparent 12px
  );
}

.proj-thumb-id {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-3);
  background: var(--bg);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.proj-status {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: var(--accent-soft);
  color: var(--accent-ink);
}

.proj-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.proj-title {
  font-family: 'IBM Plex Serif', Georgia, serif;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.25;
  margin: 0;
}

.proj-tagline {
  margin: 0;
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.5;
}

.proj-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.proj-skill {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  padding: 2px 8px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  color: var(--ink-3);
}

.proj-expand {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms ease;
}

.proj-card:hover .proj-expand,
.proj-card:focus-within .proj-expand {
  grid-template-rows: 1fr;
}

.proj-expand-inner {
  overflow: hidden;
  display: grid;
  gap: 8px;
  padding-top: 4px;
}

.proj-expand h4 {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--ink-3);
  margin: 8px 0 0;
}

.proj-expand p,
.proj-expand ul {
  margin: 0;
  font-size: 14px;
  color: var(--ink-2);
}

.proj-expand ul {
  padding-left: 20px;
}

.proj-actions {
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--rule);
  padding: 12px 20px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-2);
}

.proj-actions a:hover {
  color: var(--accent-ink);
}

/* Expanded variant */
.proj-list-expanded {
  display: grid;
  gap: 32px;
}

.proj-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.proj-row.is-flipped {
  direction: rtl;
}
.proj-row.is-flipped > * { direction: ltr; }

@media (max-width: 900px) {
  .proj-grid { grid-template-columns: 1fr; }
  .proj-row { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Write `src/components/projects/ProjectGrid.astro`**

```astro
---
import { getCollection } from 'astro:content';
import SectionHead from '../SectionHead.astro';
import ExternalIcon from '../icons/ExternalIcon.astro';

const projects = (await getCollection('project')).sort(
  (a, b) => a.data.order - b.data.order,
);
---

<section id="projects" data-section class="section shell">
  <SectionHead
    num="02"
    label="↳ technical projects"
    title="What I've built and the problems they solved."
    meta={`${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`}
  />
  <div class="proj-grid">
    {
      projects.map((p) => (
        <article class="proj-card" tabindex="0">
          <div class="proj-thumb">
            <div class="proj-thumb-stripes" aria-hidden="true" />
            <span class="proj-thumb-id">{p.data.id}</span>
            <span class="proj-status">{p.data.status}</span>
          </div>
          <div class="proj-body">
            <h3 class="proj-title">{p.data.title}</h3>
            <p class="proj-tagline">{p.data.tagline}</p>
            <div class="proj-skills">
              {p.data.skills.map((s) => <span class="proj-skill">{s}</span>)}
            </div>
            <div class="proj-expand">
              <div class="proj-expand-inner">
                <h4>Problem</h4>
                <p>{p.data.problem}</p>
                <h4>What I solved</h4>
                <ul>
                  {p.data.solved.map((s) => <li>{s}</li>)}
                </ul>
                <h4>Role</h4>
                <p>{p.data.role}</p>
              </div>
            </div>
          </div>
          <div class="proj-actions">
            {p.data.links.demo && (
              <a href={p.data.links.demo} rel="noopener" target="_blank">
                Demo <ExternalIcon />
              </a>
            )}
            {p.data.links.source && (
              <a href={p.data.links.source} rel="noopener" target="_blank">
                Source <ExternalIcon />
              </a>
            )}
          </div>
        </article>
      ))
    }
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectGrid.astro src/styles/projects.scss
git commit -m "Add ProjectGrid (default) + project styles"
```

### Task 10.2: `ProjectExpanded.astro`

**Files:** Create `src/components/projects/ProjectExpanded.astro`

- [ ] **Step 1: Write `src/components/projects/ProjectExpanded.astro`**

```astro
---
import { getCollection } from 'astro:content';
import SectionHead from '../SectionHead.astro';
import ExternalIcon from '../icons/ExternalIcon.astro';

const projects = (await getCollection('project')).sort((a, b) => a.data.order - b.data.order);
---

<section id="projects" data-section class="section shell">
  <SectionHead num="02" label="↳ technical projects" title="What I've built and the problems they solved." />
  <div class="proj-list-expanded">
    {
      projects.map((p, i) => (
        <article class:list={['proj-row', { 'is-flipped': i % 2 === 1 }]}>
          <div class="proj-thumb" style="aspect-ratio: 4 / 3;">
            <div class="proj-thumb-stripes" aria-hidden="true" />
            <span class="proj-thumb-id">{p.data.id}</span>
            <span class="proj-status">{p.data.status}</span>
          </div>
          <div>
            <h3 class="proj-title" style="font-size: 28px;">{p.data.title}</h3>
            <p class="proj-tagline" style="font-size: 16px;">{p.data.tagline}</p>
            <p style="color: var(--ink-2); margin-top: 16px;">{p.data.problem}</p>
            <ul style="color: var(--ink-2); padding-left: 20px;">
              {p.data.solved.map((s) => <li>{s}</li>)}
            </ul>
            <div class="proj-actions" style="border: none; padding: 12px 0;">
              {p.data.links.demo && <a href={p.data.links.demo} rel="noopener" target="_blank">Demo <ExternalIcon /></a>}
              {p.data.links.source && <a href={p.data.links.source} rel="noopener" target="_blank">Source <ExternalIcon /></a>}
            </div>
          </div>
        </article>
      ))
    }
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/projects/ProjectExpanded.astro
git commit -m "Add ProjectExpanded variant (alternating rows)"
```

### Task 10.3: `ProjectList.tsx` (React island)

**Files:** Create `src/components/projects/ProjectList.tsx`

- [ ] **Step 1: Write `src/components/projects/ProjectList.tsx`**

```tsx
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
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 0 }}>
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
              <span style={{ fontFamily: 'JetBrains Mono Variable, monospace', fontSize: 11, color: 'var(--ink-3)' }}>
                {p.id}
              </span>
              <span>
                <strong style={{ fontFamily: 'IBM Plex Serif, serif', fontSize: 18, fontWeight: 500 }}>
                  {p.title}
                </strong>
                <span style={{ color: 'var(--ink-3)', marginLeft: 8 }}>{p.tagline}</span>
              </span>
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div style={{ paddingBottom: 16, color: 'var(--ink-2)' }}>
                <p>{p.problem}</p>
                <ul>{p.solved.map((s) => <li key={s}>{s}</li>)}</ul>
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
```

Note on JSX: Astro's React integration uses `className`, not `class`. The inline-style approach above sidesteps the issue and matches React idiom.

- [ ] **Step 2: Verify**

```bash
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectList.tsx
git commit -m "Add ProjectList React island (inline expand)"
```

**Phase 10 checkpoint:** All project variants build.

---

## Phase 11: Skills

### Task 11.1: Skill tier helper (TDD)

**Files:** Create `src/scripts/skills.ts`, `tests/skills.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/skills.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { groupByTier, type SkillItem } from '../src/scripts/skills';

const items: SkillItem[] = [
  { name: 'C++', category: 'Languages', level: 5, years: 3 },
  { name: 'TypeScript', category: 'Languages', level: 4, years: 3 },
  { name: 'Java', category: 'Languages', level: 3, years: 2 },
  { name: 'Go', category: 'Languages', level: 2, years: 1 },
  { name: 'Rust', category: 'Languages', level: 1, years: 1 },
];

describe('groupByTier', () => {
  it('groups by T5 (5), T4 (4), T3 (3), T2 (1-2)', () => {
    const tiers = groupByTier(items);
    expect(tiers.T5.map((i) => i.name)).toEqual(['C++']);
    expect(tiers.T4.map((i) => i.name)).toEqual(['TypeScript']);
    expect(tiers.T3.map((i) => i.name)).toEqual(['Java']);
    expect(tiers.T2.map((i) => i.name)).toEqual(['Go', 'Rust']);
  });

  it('sorts within tier by years desc', () => {
    const list: SkillItem[] = [
      { name: 'A', category: 'Languages', level: 5, years: 1 },
      { name: 'B', category: 'Languages', level: 5, years: 5 },
      { name: 'C', category: 'Languages', level: 5, years: 3 },
    ];
    expect(groupByTier(list).T5.map((i) => i.name)).toEqual(['B', 'C', 'A']);
  });
});
```

- [ ] **Step 2: Run, see fail**

```bash
pnpm test
```

- [ ] **Step 3: Implement `src/scripts/skills.ts`**

```ts
export interface SkillItem {
  name: string;
  category: 'Languages' | 'Systems & Performance' | 'Backend & Architecture' | 'Platform & Tooling';
  level: number;
  years: number;
}

export type TierId = 'T5' | 'T4' | 'T3' | 'T2';

export interface TierMap {
  T5: SkillItem[];
  T4: SkillItem[];
  T3: SkillItem[];
  T2: SkillItem[];
}

const tierFor = (level: number): TierId => {
  if (level >= 5) return 'T5';
  if (level === 4) return 'T4';
  if (level === 3) return 'T3';
  return 'T2';
};

export function groupByTier(items: readonly SkillItem[]): TierMap {
  const out: TierMap = { T5: [], T4: [], T3: [], T2: [] };
  for (const item of items) out[tierFor(item.level)].push(item);
  for (const k of Object.keys(out) as TierId[]) {
    out[k].sort((a, b) => b.years - a.years);
  }
  return out;
}

export const TIER_META: Record<TierId, { label: string; note: string }> = {
  T5: { label: 'Expert',     note: 'shipped repeatedly · can teach it' },
  T4: { label: 'Advanced',   note: 'production-ready · on-the-job daily' },
  T3: { label: 'Proficient', note: 'working knowledge · solo on most tasks' },
  T2: { label: 'Familiar',   note: 'used in projects · still sharpening' },
};
```

- [ ] **Step 4: Run, see pass**

```bash
pnpm test
```

- [ ] **Step 5: Commit**

```bash
git add src/scripts/skills.ts tests/skills.test.ts
git commit -m "Add skill tier grouping helper (TDD)"
```

### Task 11.2: `Skills.astro` + `skills.scss`

**Files:** Create `src/components/skills/Skills.astro`, fill in `src/styles/skills.scss`

- [ ] **Step 1: Write `src/styles/skills.scss`**

```scss
.skills-stack {
  display: grid;
  gap: 16px;
}

.skill-tier {
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  padding: 24px;
  background: var(--bg-card);
}

.skill-tier-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.skill-tier-badge {
  padding: 4px 8px;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-sm);
  color: var(--ink-2);
  background: var(--bg);
}

.skill-tier.is-expert .skill-tier-badge {
  border-color: var(--accent);
  color: var(--accent-ink);
  background: var(--accent-soft);
}

.skill-tier-label {
  font-family: 'IBM Plex Serif', Georgia, serif;
  font-size: 18px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ink);
}

.skill-tier-note {
  color: var(--ink-3);
  margin-left: auto;
  font-size: 10px;
}

.skill-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dotted var(--rule);
  align-items: center;
}

.skill-list li:last-child { border-bottom: 0; }

.skill-name { font-size: 14.5px; color: var(--ink); }

.skill-cat {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  padding: 2px 6px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  color: var(--ink-3);
}

.skill-years {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--ink-3);
  text-align: right;
}

@media (max-width: 900px) {
  .skill-list { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Write `src/components/skills/Skills.astro`**

```astro
---
import { getEntry } from 'astro:content';
import SectionHead from '../SectionHead.astro';
import { groupByTier, TIER_META, type SkillItem, type TierId } from '../../scripts/skills';

const entry = await getEntry('skill', 'skills');
const items = (entry?.data.items ?? []) as SkillItem[];
const tiers = groupByTier(items);
const ORDER: TierId[] = ['T5', 'T4', 'T3', 'T2'];
---

<section id="skills" data-section class="section shell">
  <SectionHead
    num="03"
    label="↳ proficiency"
    title="What I reach for, ranked by depth."
    meta={`${items.length} skills`}
  />
  <div class="skills-stack">
    {
      ORDER.map((id) => (
        tiers[id].length > 0 && (
          <div class:list={['skill-tier', { 'is-expert': id === 'T5' }]}>
            <div class="skill-tier-head">
              <span class="skill-tier-badge">{id}</span>
              <span class="skill-tier-label">{TIER_META[id].label}</span>
              <span class="skill-tier-note">{TIER_META[id].note} · {tiers[id].length}</span>
            </div>
            <ul class="skill-list">
              {tiers[id].map((s) => (
                <li>
                  <span class="skill-name">{s.name}</span>
                  <span class="skill-cat">{s.category}</span>
                  <span class="skill-years">{s.years}y</span>
                </li>
              ))}
            </ul>
          </div>
        )
      ))
    }
  </div>
</section>
```

- [ ] **Step 3: Verify**

```bash
pnpm astro check
pnpm build
```
Expected: 0 errors. Skills section renders.

- [ ] **Step 4: Commit**

```bash
git add src/components/skills/ src/styles/skills.scss
git commit -m "Add Skills section with tier grouping"
```

**Phase 11 checkpoint:** Skills builds. Empty OSS too.

---

## Phase 12: OSS section

### Task 12.1: `OSS.astro` + `oss.scss`

**Files:** Create `src/components/oss/OSS.astro`, fill in `src/styles/oss.scss`

- [ ] **Step 1: Write `src/styles/oss.scss`**

```scss
.oss-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.oss-card {
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--bg-card);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.oss-repo {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 13px;
  color: var(--ink);
}

.oss-desc {
  margin: 0;
  font-size: 14px;
  color: var(--ink-2);
  flex: 1;
}

.oss-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  color: var(--accent-ink);
}

.oss-lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.oss-empty {
  border: 1px dashed var(--rule);
  border-radius: var(--radius);
  padding: 32px;
  text-align: center;
  color: var(--ink-3);
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 12px;
}
```

- [ ] **Step 2: Write `src/components/oss/OSS.astro`**

```astro
---
import { getEntry } from 'astro:content';
import SectionHead from '../SectionHead.astro';
import StarIcon from '../icons/StarIcon.astro';

const entry = await getEntry('oss', 'oss');
const items = entry?.data.items ?? [];
---

<section id="oss" data-section class="section shell">
  <SectionHead
    num="04"
    label="↳ open source"
    title="Where I've contributed code in public."
    meta={items.length === 0 ? 'coming soon' : `${items.length} repos`}
  />
  {
    items.length === 0 ? (
      <p class="oss-empty">// no public contributions worth listing yet — building in private.</p>
    ) : (
      <div class="oss-grid">
        {items.map((r) => (
          <a class="oss-card" href={r.url} rel="noopener" target="_blank">
            <span class="oss-repo">{r.org}/{r.repo}</span>
            <p class="oss-desc">{r.desc}</p>
            <div class="oss-foot">
              <span class="oss-lang-dot" aria-hidden="true" />
              <span>{r.lang}</span>
              <span style="margin-left: auto; display: inline-flex; align-items: center; gap: 4px;">
                <StarIcon /> {r.stars}
              </span>
            </div>
          </a>
        ))}
      </div>
    )
  }
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/oss/ src/styles/oss.scss
git commit -m "Add OSS section with empty-state fallback"
```

---

## Phase 13: Wire it all together — `index.astro`

### Task 13.1: Variant-resolving `index.astro`

**Files:** Replace `src/pages/index.astro`

- [ ] **Step 1: Write the full `src/pages/index.astro`**

```astro
---
import { site } from '../config/site';
import BaseLayout from '../layouts/BaseLayout.astro';
import TopBar from '../components/TopBar.astro';
import Footer from '../components/Footer.astro';

import HeroSplit from '../components/hero/HeroSplit.astro';
import HeroCentered from '../components/hero/HeroCentered.astro';
import HeroTerminal from '../components/hero/HeroTerminal.tsx';

import Now from '../components/now/Now.astro';

import ExperienceTimeline from '../components/experience/ExperienceTimeline.astro';
import ExperienceCards from '../components/experience/ExperienceCards.astro';
import ExperienceTable from '../components/experience/ExperienceTable.astro';

import ProjectGrid from '../components/projects/ProjectGrid.astro';
import ProjectExpanded from '../components/projects/ProjectExpanded.astro';
import ProjectList from '../components/projects/ProjectList.tsx';
import { getCollection } from 'astro:content';

import Skills from '../components/skills/Skills.astro';
import OSS from '../components/oss/OSS.astro';

import identity from '../content/identity.json';

const heroIsTerminal = site.heroVariant === 'terminal';
const projectIsList = site.projectVariant === 'list';

const projects = projectIsList
  ? (await getCollection('project'))
      .sort((a, b) => a.data.order - b.data.order)
      .map((p) => ({
        id: p.data.id,
        title: p.data.title,
        tagline: p.data.tagline,
        status: p.data.status,
        skills: p.data.skills,
        problem: p.data.problem,
        solved: p.data.solved,
        role: p.data.role,
        links: p.data.links,
      }))
  : [];
---

<BaseLayout>
  <TopBar />

  {site.heroVariant === 'split' && <HeroSplit />}
  {site.heroVariant === 'centered' && <HeroCentered />}
  {
    heroIsTerminal && (
      <section id="hero" data-section class="hero shell">
        <HeroTerminal
          client:visible
          name={identity.name}
          role={identity.role}
          location={identity.location}
          summary={identity.summary.replace(/\*([^*]+)\*/g, '$1')}
        />
      </section>
    )
  }

  <Now />

  {site.experienceVariant === 'timeline' && <ExperienceTimeline />}
  {site.experienceVariant === 'cards' && <ExperienceCards />}
  {site.experienceVariant === 'table' && <ExperienceTable />}

  {site.projectVariant === 'grid' && <ProjectGrid />}
  {site.projectVariant === 'expanded' && <ProjectExpanded />}
  {
    projectIsList && (
      <section id="projects" data-section class="section shell">
        <ProjectList client:visible projects={projects} />
      </section>
    )
  }

  <Skills />
  <OSS />

  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Verify build and preview**

```bash
pnpm build
pnpm preview --host 127.0.0.1
```

Open `http://127.0.0.1:4321/` in a browser. Confirm:
- All 6 sections (Hero, Now, Experience, Projects, Skills, OSS) render
- Top bar pulse, brand, nav links visible
- No console errors

Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Wire variant resolver into index.astro; full site renders"
```

**Phase 13 checkpoint:** The full static site renders. No interactivity (theme toggle, palette, keyboard) yet — that's Phase 14.

---

## Phase 14: Interaction layer

### Task 14.1: `events.ts` (typed CustomEvent declarations)

**Files:** Create `src/scripts/events.ts`

- [ ] **Step 1: Write `src/scripts/events.ts`**

```ts
export type PaletteEvent = CustomEvent<{ prefill?: string }>;

declare global {
  interface WindowEventMap {
    'palette:toggle': PaletteEvent;
    'palette:open': PaletteEvent;
    'help:toggle': Event;
    'overlay:close': Event;
  }
}

export {};
```

- [ ] **Step 2: Commit**

```bash
git add src/scripts/events.ts
git commit -m "Add typed custom-event declarations"
```

### Task 14.2: `theme.ts` (theme + accent toggle)

**Files:** Create `src/scripts/theme.ts`, `tests/theme.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/theme.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { applyTheme, applyAccent, nextTheme, ACCENTS } from '../src/scripts/theme';

beforeEach(() => {
  const dom = new JSDOM(`<!doctype html><html data-theme="light" data-accent="green"></html>`);
  // @ts-expect-error inject jsdom globals
  global.document = dom.window.document;
  // @ts-expect-error
  global.window = dom.window;
  // @ts-expect-error
  global.localStorage = dom.window.localStorage;
});

describe('applyTheme', () => {
  it('writes data-theme and persists', () => {
    applyTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('vtn:theme')).toBe('dark');
  });
});

describe('applyAccent', () => {
  it('writes data-accent and persists', () => {
    applyAccent('amber');
    expect(document.documentElement.getAttribute('data-accent')).toBe('amber');
    expect(localStorage.getItem('vtn:accent')).toBe('amber');
  });
});

describe('nextTheme', () => {
  it('toggles light <-> dark', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });
});

describe('ACCENTS', () => {
  it('lists 5 accents', () => {
    expect(ACCENTS).toEqual(['green', 'amber', 'blue', 'magenta', 'mono']);
  });
});
```

- [ ] **Step 2: Install jsdom**

```bash
pnpm add -D jsdom @types/jsdom
```

- [ ] **Step 3: Configure vitest to use jsdom (only for browser tests)**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    environmentMatchGlobs: [
      ['tests/theme.test.ts', 'jsdom'],
      ['tests/keyboard.test.ts', 'jsdom'],
    ],
  },
});
```

- [ ] **Step 4: Run, see fail**

```bash
pnpm test
```

- [ ] **Step 5: Implement `src/scripts/theme.ts`**

```ts
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
```

- [ ] **Step 6: Run, see pass**

```bash
pnpm test
```

- [ ] **Step 7: Commit**

```bash
git add src/scripts/theme.ts tests/theme.test.ts vitest.config.ts package.json pnpm-lock.yaml
git commit -m "Add theme/accent toggle module (TDD)"
```

### Task 14.3: `keyboard.ts` (TDD)

**Files:** Create `src/scripts/keyboard.ts`, `tests/keyboard.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/keyboard.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { handleKey, type KeyContext } from '../src/scripts/keyboard';

beforeEach(() => {
  const dom = new JSDOM(`<!doctype html><html data-theme="light"><body>
    <section id="hero" data-section></section>
    <section id="now" data-section></section>
    <section id="experience" data-section></section>
  </body></html>`);
  // @ts-expect-error
  global.document = dom.window.document;
  // @ts-expect-error
  global.window = dom.window;
});

const makeCtx = (): KeyContext => ({
  dispatch: vi.fn(),
  scrollTo: vi.fn(),
  scrollToSection: vi.fn(),
  toggleTheme: vi.fn(),
  isInputFocused: () => false,
  now: () => 0,
});

describe('handleKey', () => {
  it('dispatches palette:toggle on Cmd+K', () => {
    const ctx = makeCtx();
    handleKey({ key: 'k', metaKey: true } as KeyboardEvent, ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('palette:toggle');
  });

  it('dispatches palette:toggle on Ctrl+K', () => {
    const ctx = makeCtx();
    handleKey({ key: 'k', ctrlKey: true } as KeyboardEvent, ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('palette:toggle');
  });

  it('opens help on ?', () => {
    const ctx = makeCtx();
    handleKey({ key: '?' } as KeyboardEvent, ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('help:toggle');
  });

  it('toggles theme on t', () => {
    const ctx = makeCtx();
    handleKey({ key: 't' } as KeyboardEvent, ctx);
    expect(ctx.toggleTheme).toHaveBeenCalled();
  });

  it('jumps next section on j', () => {
    const ctx = makeCtx();
    handleKey({ key: 'j' } as KeyboardEvent, ctx);
    expect(ctx.scrollToSection).toHaveBeenCalledWith('next');
  });

  it('jumps prev section on k', () => {
    const ctx = makeCtx();
    handleKey({ key: 'k' } as KeyboardEvent, ctx);
    expect(ctx.scrollToSection).toHaveBeenCalledWith('prev');
  });

  it('skips letter shortcuts when input focused', () => {
    const ctx = { ...makeCtx(), isInputFocused: () => true };
    handleKey({ key: 'j' } as KeyboardEvent, ctx);
    expect(ctx.scrollToSection).not.toHaveBeenCalled();
  });

  it('still allows Cmd+K when input focused', () => {
    const ctx = { ...makeCtx(), isInputFocused: () => true };
    handleKey({ key: 'k', metaKey: true } as KeyboardEvent, ctx);
    expect(ctx.dispatch).toHaveBeenCalledWith('palette:toggle');
  });

  it('triggers gg sequence within 500ms', () => {
    const ctx = { ...makeCtx(), now: vi.fn().mockReturnValueOnce(100).mockReturnValueOnce(400) };
    handleKey({ key: 'g' } as KeyboardEvent, ctx);
    handleKey({ key: 'g' } as KeyboardEvent, ctx);
    expect(ctx.scrollTo).toHaveBeenCalledWith('top');
  });

  it('Shift+G scrolls to bottom', () => {
    const ctx = makeCtx();
    handleKey({ key: 'G', shiftKey: true } as KeyboardEvent, ctx);
    expect(ctx.scrollTo).toHaveBeenCalledWith('bottom');
  });
});
```

- [ ] **Step 2: Run, see fail**

```bash
pnpm test
```

- [ ] **Step 3: Implement `src/scripts/keyboard.ts`**

```ts
import './events';

export interface KeyContext {
  dispatch: (name: 'palette:toggle' | 'palette:open' | 'help:toggle' | 'overlay:close') => void;
  scrollTo: (target: 'top' | 'bottom') => void;
  scrollToSection: (dir: 'next' | 'prev') => void;
  toggleTheme: () => void;
  isInputFocused: () => boolean;
  now: () => number;
}

let lastG = -Infinity;

export function handleKey(e: KeyboardEvent, ctx: KeyContext): void {
  // Cmd/Ctrl+K is allowed even when typing
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    ctx.dispatch('palette:toggle');
    return;
  }

  if (ctx.isInputFocused()) return;

  switch (e.key) {
    case '/':
      ctx.dispatch('palette:open');
      return;
    case '?':
      ctx.dispatch('help:toggle');
      return;
    case 'Escape':
      ctx.dispatch('overlay:close');
      return;
    case 't':
      ctx.toggleTheme();
      return;
    case 'j':
      ctx.scrollToSection('next');
      return;
    case 'k':
      ctx.scrollToSection('prev');
      return;
    case 'g': {
      const t = ctx.now();
      if (t - lastG <= 500) {
        ctx.scrollTo('top');
        lastG = -Infinity;
      } else {
        lastG = t;
      }
      return;
    }
    case 'G':
      if (e.shiftKey) ctx.scrollTo('bottom');
      return;
  }
}

export function activateKeyboard(): void {
  const isInputFocused = (): boolean => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  };

  const ctx: KeyContext = {
    dispatch: (name) => window.dispatchEvent(new CustomEvent(name)),
    scrollTo: (target) => {
      window.scrollTo({ top: target === 'top' ? 0 : document.body.scrollHeight, behavior: 'smooth' });
    },
    scrollToSection: (dir) => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
      if (sections.length === 0) return;
      const y = window.scrollY + 120;
      const idx = sections.findIndex((s, i) => {
        const next = sections[i + 1];
        return s.offsetTop <= y && (!next || next.offsetTop > y);
      });
      const target = dir === 'next' ? sections[Math.min(idx + 1, sections.length - 1)] : sections[Math.max(idx - 1, 0)];
      if (target) window.scrollTo({ top: target.offsetTop - 24, behavior: 'smooth' });
    },
    toggleTheme: () => {
      const cur = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'light';
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('vtn:theme', next); } catch { /* */ }
    },
    isInputFocused,
    now: () => performance.now(),
  };

  window.addEventListener('keydown', (e) => handleKey(e, ctx));
}
```

- [ ] **Step 4: Run, see pass**

```bash
pnpm test
```

- [ ] **Step 5: Commit**

```bash
git add src/scripts/keyboard.ts tests/keyboard.test.ts
git commit -m "Add keyboard shortcut layer (TDD)"
```

### Task 14.4: Active section tracker

**Files:** Add to `src/scripts/keyboard.ts` — extend with active-section tracker

- [ ] **Step 1: Add `activateSectionTracker` to `src/scripts/keyboard.ts`**

Append to the end of `src/scripts/keyboard.ts`:

```ts
export function activateSectionTracker(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-section-link]'));
  if (links.length === 0) return;
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
  if (sections.length === 0) return;

  let frame = 0;
  const update = () => {
    const y = window.scrollY + 120;
    const active = sections.find((s, i) => {
      const next = sections[i + 1];
      return s.offsetTop <= y && (!next || next.offsetTop > y);
    });
    const id = active?.id ?? '';
    for (const a of links) {
      if (a.dataset.sectionLink === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };

  window.addEventListener(
    'scroll',
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scripts/keyboard.ts
git commit -m "Add active section tracker"
```

### Task 14.5: Page-level script bootstrap

**Files:** Create `src/scripts/main.ts`, wire into `BaseLayout.astro`

- [ ] **Step 1: Write `src/scripts/main.ts`**

```ts
import { activateKeyboard, activateSectionTracker } from './keyboard';
import { bindToggleHandlers } from './theme';

activateKeyboard();
activateSectionTracker();
bindToggleHandlers();
```

- [ ] **Step 2: Add to `BaseLayout.astro`**

In `src/layouts/BaseLayout.astro`, add before the closing `</body>`:

Edit the file — replace the `<slot />` line with:

```astro
    <slot />
    <script>
      import '../scripts/main';
    </script>
```

- [ ] **Step 3: Verify**

```bash
pnpm build
pnpm preview --host 127.0.0.1
```

Open browser, press `t` → theme toggles. Press `j` / `k` → sections scroll. Click `⌘K` button → console shows event dispatched (palette/help components not yet built). Stop server.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/main.ts src/layouts/BaseLayout.astro
git commit -m "Bootstrap keyboard, section tracker, theme handlers"
```

### Task 14.6: `CommandPalette.tsx` (React island)

**Files:** Create `src/components/palette/CommandPalette.tsx`, fill in `src/styles/palette.scss`

- [ ] **Step 1: Write `src/styles/palette.scss`**

```scss
.palette-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: grid;
  place-items: start center;
  padding-top: 12vh;
}

.palette {
  width: min(640px, 92vw);
  background: var(--bg-card);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px rgb(0 0 0 / 18%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.palette-input {
  width: 100%;
  padding: 16px 20px;
  border: 0;
  border-bottom: 1px solid var(--rule);
  background: transparent;
  color: var(--ink);
  font-size: 15px;
  outline: none;
}

.palette-list {
  list-style: none;
  margin: 0;
  padding: 8px 0;
  max-height: 60vh;
  overflow-y: auto;
}

.palette-group-label {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--ink-4);
  padding: 8px 20px 4px;
}

.palette-item {
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: var(--ink-2);
}

.palette-item.is-active {
  background: var(--accent-soft);
  color: var(--accent-ink);
}

.palette-item-hint {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 10px;
  color: var(--ink-4);
}
```

- [ ] **Step 2: Write `src/components/palette/CommandPalette.tsx`**

```tsx
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
```

- [ ] **Step 3: Write a palette-items builder (`src/scripts/palette-items.ts`)**

```ts
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
```

- [ ] **Step 4: Wire palette into `index.astro`**

Add to `src/pages/index.astro` after the imports (above the frontmatter close):

```astro
import CommandPalette from '../components/palette/CommandPalette.tsx';
import { buildPaletteItems } from '../scripts/palette-items';

const allProjects = (await getCollection('project')).map((p) => ({
  id: p.data.id,
  title: p.data.title,
}));
```

And add before `<Footer />`:

```astro
  <CommandPalette
    client:idle
    items={buildPaletteItems({
      contacts: identity.contacts,
      projects: allProjects,
    })}
  />
```

Wait — `buildPaletteItems` references `applyTheme` / `applyAccent` from `theme.ts`, which calls `document` at module load. We need it to evaluate inside the React component's `action`, not at SSR time. The pattern above lazy-evaluates inside `action: () => …`, so SSR-safe.

But `buildPaletteItems` also calls `document.getElementById` at action time — also lazy. Fine.

Verify by building.

- [ ] **Step 5: Verify build**

```bash
pnpm build
pnpm preview --host 127.0.0.1
```

Open browser → press `⌘K` → palette overlay appears with grouped items. Type "dark" → "Dark" theme item filters. Enter → theme switches. Esc → closes.

- [ ] **Step 6: Commit**

```bash
git add src/components/palette/ src/styles/palette.scss src/scripts/palette-items.ts src/pages/index.astro
git commit -m "$(cat <<'EOF'
Add CommandPalette React island and wire into index

Items: Navigate, Theme, Accent, Contact, Projects.
EOF
)"
```

### Task 14.7: `HelpOverlay.tsx`

**Files:** Create `src/components/help/HelpOverlay.tsx`, fill in `src/styles/help.scss`

- [ ] **Step 1: Write `src/styles/help.scss`**

```scss
.help-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: grid;
  place-items: center;
}

.help-modal {
  width: min(560px, 92vw);
  background: var(--bg-card);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.help-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 6px 0;
  border-bottom: 1px dotted var(--rule);
  align-items: center;
  font-size: 14px;
}

.help-row:last-child { border-bottom: 0; }

.help-kbd {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 11px;
  padding: 2px 8px;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-sm);
  display: inline-block;
}
```

- [ ] **Step 2: Write `src/components/help/HelpOverlay.tsx`**

```tsx
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

  if (!open) return null;

  return (
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
```

- [ ] **Step 3: Add to `index.astro`**

After the imports in `src/pages/index.astro`:

```astro
import HelpOverlay from '../components/help/HelpOverlay.tsx';
```

Before `<Footer />`:

```astro
  <HelpOverlay client:idle />
```

- [ ] **Step 4: Verify**

```bash
pnpm build
pnpm preview --host 127.0.0.1
```

Press `?` → help modal appears. Esc → closes.

- [ ] **Step 5: Commit**

```bash
git add src/components/help/ src/styles/help.scss src/pages/index.astro
git commit -m "Add HelpOverlay React island"
```

**Phase 14 checkpoint:** Theme toggle, palette, help overlay, keyboard shortcuts all work.

---

## Phase 15: Contrast checker and final scripts

### Task 15.1: AA contrast check (TDD)

**Files:** Create `scripts/check-contrast.ts`, `tests/contrast.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/contrast.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { contrastRatio, isAA } from '../scripts/check-contrast';

describe('contrastRatio', () => {
  it('returns 21 for white-on-black', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
  });
  it('returns 1 for same color', () => {
    expect(contrastRatio('#888888', '#888888')).toBeCloseTo(1, 1);
  });
});

describe('isAA', () => {
  it('passes white on black', () => {
    expect(isAA('#ffffff', '#000000')).toBe(true);
  });
  it('fails light gray on white', () => {
    expect(isAA('#cccccc', '#ffffff')).toBe(false);
  });
});
```

- [ ] **Step 2: Run, see fail**

```bash
pnpm test
```

- [ ] **Step 3: Implement `scripts/check-contrast.ts`**

```ts
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
    ['ink on bg (light)', '#1f242e', '#fbfaf6'],
    ['ink-3 on bg (light)', '#828892', '#fbfaf6'],
    ['ink on bg (dark)', '#fbf6e7', '#1f2530'],
    ['ink-3 on bg (dark)', '#9da4ad', '#1f2530'],
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

const isMain = import.meta.url === `file://${process.argv[1]?.replaceAll('\\', '/')}`;
if (isMain) main();
```

- [ ] **Step 4: Run, see pass**

```bash
pnpm test
pnpm tsx scripts/check-contrast.ts
```

- [ ] **Step 5: Add to `pnpm check`**

Edit `package.json` `scripts.check`:

```json
"check": "astro check && tsc --noEmit && tsx scripts/check-no-js.ts && tsx scripts/check-contrast.ts",
```

- [ ] **Step 6: Commit**

```bash
git add scripts/check-contrast.ts tests/contrast.test.ts package.json
git commit -m "Add AA contrast checker (TDD) and wire into pnpm check"
```

---

## Phase 16: GitHub Pages deploy workflow

### Task 16.1: `.github/workflows/deploy.yml`

**Files:** Create `.github/workflows/deploy.yml`

- [ ] **Step 1: Write the workflow file**

Create `.github/workflows/deploy.yml`:

```yaml
name: deploy

on:
  push:
    branches: [main]
  workflow_dispatch: {}

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm lint
      - run: pnpm format:check
      - run: pnpm test
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Add a README note about the one-time GitHub setting**

Create `README.md`:

```markdown
# ntvu19.github.io

Personal portfolio. Astro static site, deployed to GitHub Pages.

## Develop

```bash
pnpm install
pnpm dev
```

## Test, lint, build

```bash
pnpm check          # types + ts-only + contrast
pnpm lint
pnpm format:check
pnpm test
pnpm build          # writes to dist/
pnpm preview        # serves dist/
```

## Deploy

CI deploys on push to `main` via `actions/deploy-pages`.

**One-time GitHub setup** (after first push of this branch to `main`):

1. Repo → Settings → Pages → Source = **GitHub Actions**.
2. Run the `deploy` workflow manually once if it didn't auto-trigger.

## Variant config

Edit `src/config/site.ts` to swap hero / experience / project variants and the default theme/accent.
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "Add deploy workflow and README"
```

---

## Phase 17: Final verification

### Task 17.1: Run the full check suite

- [ ] **Step 1: Clean install + full pipeline**

```bash
rm -rf node_modules dist .astro
pnpm install --frozen-lockfile
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
```
Expected: every command exits 0. Note any failures and fix before proceeding.

- [ ] **Step 2: Inspect bundle size**

```bash
du -sh dist/_astro/*.js 2>/dev/null || echo "no JS in dist/_astro"
du -sh dist/
```
Expected: total JS in `dist/_astro/*.js` under ~25 KB gzipped (Astro reports raw size; gzip will be ~3× smaller).

If significantly over: `client:idle` instead of `client:visible` for non-critical islands; consider lazy-loading the React palette/help.

### Task 17.2: Browser smoke test

- [ ] **Step 1: Start preview**

```bash
pnpm preview --host 127.0.0.1
```

- [ ] **Step 2: Manually verify the spec §10 acceptance list**

Open `http://127.0.0.1:4321/` in your browser and confirm each:

1. All six sections render: Hero, Now, Experience, Projects, Skills, OSS.
2. Toggle `site.heroVariant` between `split`, `centered`, `terminal`. Run `pnpm build && pnpm preview` between each. Each should render correctly.
3. Same for `site.experienceVariant` (`timeline` / `cards` / `table`) and `site.projectVariant` (`grid` / `expanded` / `list`).
4. Click the `◐` glyph in top bar — theme cycles light ↔ dark with no FOUC on reload.
5. Open palette (`⌘K`), navigate accents — verify all 5 (`green`, `amber`, `blue`, `magenta`, `mono`) render correctly in light and dark.
6. Press `⌘K` → palette opens. Arrow keys navigate. Enter selects. Esc closes; focus returns to the trigger.
7. Press `?` → help overlay opens with all shortcuts. Esc closes.
8. Press `j` / `k` → smooth scroll between sections.
9. Press `gg` (within 500ms) → scroll to top. Press `Shift+G` → scroll to bottom.
10. Resize window to 800px wide → top-bar nav hides, hero collapses to single column, no horizontal scroll.
11. In DevTools: enable `prefers-reduced-motion: reduce` → animations stop (terminal renders all lines instantly, pulse stops, scanlines hidden).
12. Run Lighthouse (DevTools → Lighthouse → Performance + Best Practices + SEO + Accessibility) → ≥ 95 in each.

Stop the server.

- [ ] **Step 3: Document any deferred items**

If any acceptance item failed, do NOT mark the migration complete. Instead, file a follow-up task and fix.

### Task 17.3: Push and open PR

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feat/astro-migration
```

- [ ] **Step 2: Open a PR**

```bash
gh pr create --title "Migrate portfolio from Vuepress to Astro" --body "$(cat <<'EOF'
## Summary

- Replace Vuepress 2.x with Astro 4.x (static output)
- Render the design system from claude/SPECIFICATION.md
- Build-time variant config (src/config/site.ts) — no runtime tweaks panel
- ESLint flat config + Prettier + format-on-save VS Code settings
- TypeScript-only enforced via scripts/check-no-js.ts
- New deploy workflow using actions/deploy-pages (drops gh-pages branch)

## Test plan

- [x] pnpm check, lint, format:check, test, build all pass
- [x] All 6 sections render at /
- [x] Theme toggle, palette ⌘K, help ?, j/k/gg/G/t shortcuts work
- [x] Mobile breakpoint at 900px collapses correctly
- [x] Lighthouse ≥ 95 in every category
- [x] prefers-reduced-motion disables animations

## One-time GitHub setting after merge

Repo → Settings → Pages → Source = GitHub Actions (was previously: gh-pages branch).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Returns the PR URL. Share it with the user.

---

## Out of scope (not in this plan; explicitly deferred)

- Custom domain
- Project deep-dive routes (`/projects/<slug>`)
- Vietnamese locale
- Markdown content trees
- Favicon rotation
- Medium-zoom plugin
- CodeMirror editor
- Analytics
- OG image generation (we ship a static `og.png`)
- Husky / lint-staged pre-commit hooks (CI runs the same checks)

---

## Plan summary

**Phases:** 18 (0 = branch & clean; 1–16 = build; 17 = verify).
**Tasks:** ~50.
**Checkpoints:** end of each phase (`pnpm build` succeeds and a specific feature is live).
**Tests:** vitest for `skills.ts`, `theme.ts`, `keyboard.ts`, `check-no-js.ts`, `check-contrast.ts`. Visual/UX verified in browser per §17.2.
**Frequent commits:** every task ends with a commit. ~50 commits on the branch.

*Last updated: 2026-04-25.*
