# Portfolio Migration: Vuepress → Astro

**Date:** 2026-04-25
**Author:** Vu T. Nguyen (with Claude)
**Status:** Approved — ready for implementation plan
**Scope:** Full rebuild of the personal portfolio at `ntvu19.github.io`. Replaces the current Vuepress site with an Astro static site that follows the design system in `claude/SPECIFICATION.md`.

---

## 0. Goal

Migrate the existing Vuepress 2.x portfolio to **Astro 4.x** so the site:

1. Has a much larger ecosystem and easier long-term maintenance than Vuepress.
2. Renders the new design system from `claude/SPECIFICATION.md` (engineering-document aesthetic, tokenized theme, command palette, keyboard shortcuts, content collections).
3. Stays fully static for free GitHub Pages hosting.
4. Ships almost zero JavaScript by default — JS only where interactivity is required.
5. Is content-driven: adding a new project = create one MDX, adding a new role = edit one YAML.

---

## 1. Decisions Locked During Brainstorming

| #   | Decision                                                                                                                                                                                                                 | Rationale                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Framework: Astro 4.x.**                                                                                                                                                                                                | Per `claude/SPECIFICATION.md` §1.1. Larger community than Vuepress, content collections, islands architecture, first-class GitHub Pages support.   |
| 2   | **Strict spec scope.** Drop the entire current `docs/` markdown tree (`algorithm/`, `database/`, `programming/`, etc.), the Vietnamese locale, the rotating browser-tab favicon, medium-zoom, and the CodeMirror editor. | User chose option A in Question 2 — clean rebuild, no legacy carryover.                                                                            |
| 3   | **No project deep-dive pages at v1.** Card-expand only. Project MDX files store frontmatter for the card; bodies stay empty for now.                                                                                     | Faster v1, idiomatic Astro for the chosen UX. Can be added later by enabling `src/pages/projects/[slug].astro`.                                    |
| 4   | **Domain: `ntvu19.github.io`.** No custom domain at v1.                                                                                                                                                                  | User has used this URL for 2 years; can change later via `astro.config.mjs` `site` + a `CNAME` file.                                               |
| 5   | **No analytics.**                                                                                                                                                                                                        | Performance budget; can revisit later.                                                                                                             |
| 6   | **Content seed strategy: realistic placeholders.** Pull from the current `Welcome.vue`, `Experience.vue`, and `Project.vue` data to seed YAML/MDX/JSON; user will refine after seeing the UI.                            | User chose option A in Question 3d.                                                                                                                |
| 7   | **All three variants of Hero / Experience / Project, switchable via build-time config (`src/config/site.ts`).** No runtime Tweaks panel.                                                                                 | User wants to iterate on UI choices later. The Tweaks panel from the prototype becomes static config, ships zero extra JS.                         |
| 8   | **Styling: SCSS, not plain CSS or Tailwind.** Design tokens remain CSS custom properties so theme switching works at runtime.                                                                                            | User preference. Tailwind would conflict with `claude/SPECIFICATION.md` §2.2 ("Don't use Tailwind utility soup").                                  |
| 9   | **TypeScript-only logic.** No `.js` or `.jsx` files in `src/`. Only TS/TSX/Astro/SCSS.                                                                                                                                   | User explicit instruction. Tool config files (`eslint.config.mjs`, `astro.config.mjs`) are exempt — they are tool requirements, not project logic. |

---

## 2. Architecture

### 2.1 Stack

- **Astro 4.x**, `output: 'static'`. No SSR, no Node runtime in production.
- **React 18** for islands (`@astrojs/react`).
- **MDX** for projects (`@astrojs/mdx`).
- **SCSS** for styles (Astro built-in via Vite + `sass`).
- **TypeScript strict** (`astro/tsconfigs/strict`).
- **pnpm** as the package manager.

### 2.2 Repo layout

```
/
├─ astro.config.mjs
├─ tsconfig.json
├─ package.json
├─ pnpm-lock.yaml
├─ eslint.config.mjs
├─ .prettierrc.json
├─ .prettierignore
├─ .gitignore
├─ .npmrc                              (kept as-is)
├─ .vscode/
│  ├─ settings.json                    (format-on-save + ESLint fix-on-save)
│  └─ extensions.json                  (recommended: astro, eslint, prettier, mdx)
├─ .github/workflows/
│  └─ deploy.yml                       (replaces vuepress-deploy.yml)
├─ public/
│  ├─ favicon.svg
│  ├─ avatar.jfif                      (migrated from current site)
│  ├─ og.png                           (1200×630, static for v1)
│  ├─ robots.txt
│  └─ assets/                          (stack logos: cpp, qt, cmake, windows11, linux,
│                                       postgresql, sqlite, nginx, jenkins, docker,
│                                       grpc, junit, opswat-light, opswat-dark, …)
├─ scripts/
│  ├─ check-no-js.ts                   (CI guard: fails if any .js/.jsx in src/)
│  └─ check-contrast.ts                (CI guard: AA contrast for every theme×accent)
├─ src/
│  ├─ config/
│  │  └─ site.ts                       (variant + default-theme/accent config)
│  ├─ content/
│  │  ├─ config.ts                     (zod schemas, exports `collections`)
│  │  ├─ identity.json                 (singleton — name, role, tagline, contacts)
│  │  ├─ now.json                      (singleton — currently building/researching)
│  │  ├─ companies/
│  │  │  └─ opswat.yaml
│  │  ├─ projects/
│  │  │  ├─ hcmus-event-management.mdx
│  │  │  ├─ h4-webserver.mdx
│  │  │  └─ video-streaming-platform.mdx
│  │  │     (3 total, mirroring current Project.vue; slugs derived from each project's name)
│  │  ├─ skills.yaml
│  │  └─ oss.yaml                      (empty `items: []` at v1)
│  ├─ components/
│  │  ├─ TopBar.astro
│  │  ├─ Footer.astro
│  │  ├─ SectionHead.astro
│  │  ├─ AvatarBlock.astro
│  │  ├─ hero/
│  │  │  ├─ HeroSplit.astro
│  │  │  ├─ HeroCentered.astro
│  │  │  └─ HeroTerminal.tsx           (React island)
│  │  ├─ now/
│  │  │  └─ Now.astro
│  │  ├─ experience/
│  │  │  ├─ ExperienceTimeline.astro
│  │  │  ├─ ExperienceCards.astro
│  │  │  └─ ExperienceTable.astro
│  │  ├─ projects/
│  │  │  ├─ ProjectGrid.astro
│  │  │  ├─ ProjectExpanded.astro
│  │  │  └─ ProjectList.tsx            (React island — inline expand-on-click)
│  │  ├─ skills/
│  │  │  └─ Skills.astro
│  │  ├─ oss/
│  │  │  └─ OSS.astro
│  │  ├─ palette/
│  │  │  └─ CommandPalette.tsx         (React island)
│  │  ├─ help/
│  │  │  └─ HelpOverlay.tsx            (React island)
│  │  └─ icons/
│  │     ├─ MailIcon.astro
│  │     ├─ GithubIcon.astro
│  │     ├─ LinkedinIcon.astro
│  │     ├─ SearchIcon.astro
│  │     ├─ HashIcon.astro
│  │     ├─ PlayIcon.astro
│  │     ├─ ExternalIcon.astro
│  │     ├─ StarIcon.astro
│  │     └─ ArrowIcon.astro
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ pages/
│  │  └─ index.astro                   (single page; reads `site.ts`, picks variants)
│  ├─ scripts/
│  │  ├─ theme.ts                      (top-bar theme/accent toggle handlers)
│  │  ├─ keyboard.ts                   (j/k/gg/G/t/?/⌘K/Esc dispatcher)
│  │  └─ events.ts                     (typed CustomEvent declarations)
│  └─ styles/
│     ├─ tokens.scss                   (CSS custom properties — light/dark/5 accents)
│     ├─ base.scss                     (reset, typography, helpers)
│     ├─ layout.scss                   (shell, section-head, topbar, footer, grid bg)
│     ├─ hero.scss
│     ├─ experience.scss
│     ├─ projects.scss
│     ├─ skills.scss
│     ├─ oss.scss
│     ├─ now.scss
│     ├─ palette.scss
│     └─ help.scss
└─ docs/superpowers/                   (planning artifacts; preserved across migration)
   └─ specs/
      └─ 2026-04-25-portfolio-astro-migration-design.md   ← this file
```

### 2.3 Files removed in this migration

- `docs/.vuepress/` (entire Vuepress config, components, layouts, public assets — assets migrate to `public/`)
- `docs/algorithm/`, `docs/database/`, `docs/miscellaneous/`, `docs/networking/`, `docs/operating-system/`, `docs/programming/`, `docs/others/`, `docs/vi/`, `docs/index.md`, `docs/.gitignore`
- `package.json`, `package-lock.json` (replaced)
- `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- `.github/workflows/vuepress-deploy.yml`

### 2.4 Files kept

- `.git/`
- `.npmrc`
- `claude/` (design-system reference; not edited, not deployed)
- `docs/superpowers/` (planning archive)

---

## 3. Variant Configuration

`src/config/site.ts` — single source of truth for which variant `index.astro` renders.

```ts
export const site = {
  heroVariant: 'split', // 'split' | 'terminal' | 'centered'
  experienceVariant: 'timeline', // 'timeline' | 'cards' | 'table'
  projectVariant: 'grid', // 'grid' | 'list' | 'expanded'
  defaultTheme: 'light', // 'light' | 'dark'
  defaultAccent: 'green', // 'green' | 'amber' | 'blue' | 'magenta' | 'mono'
} as const;

export type HeroVariant = typeof site.heroVariant;
export type ExperienceVariant = typeof site.experienceVariant;
export type ProjectVariant = typeof site.projectVariant;
```

Resolution pattern in `index.astro`:

```astro
---
import { site } from '../config/site';
import HeroSplit from '../components/hero/HeroSplit.astro';
import HeroCentered from '../components/hero/HeroCentered.astro';
import HeroTerminal from '../components/hero/HeroTerminal.tsx';
// … same imports for Experience and Project variants

const HeroByVariant = {
  split: HeroSplit,
  centered: HeroCentered,
  terminal: HeroTerminal,
} as const;

const Hero = HeroByVariant[site.heroVariant];
---
```

`HeroTerminal` is the only React island among hero variants — when chosen, it's hydrated `client:visible`.

`defaultTheme` and `defaultAccent` set the _first-visit fallback_ used by the inline no-flash script in `BaseLayout.astro`. After first visit, `localStorage` (`vtn:theme`, `vtn:accent`) takes over.

---

## 4. Design System Reference

Visual design, typography, color tokens, layout grid, component specifications, accessibility rules, and interaction details are sourced from `claude/SPECIFICATION.md`. Sections of that file map to this build as follows:

| `claude/SPECIFICATION.md` section | This build                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| §2 Aesthetic Direction            | Tone enforced in seed content; no marketing copy.                                                     |
| §3 Typography                     | `src/styles/base.scss` + `@fontsource/ibm-plex-{sans,serif}` + `@fontsource-variable/jetbrains-mono`. |
| §4 Color System                   | `src/styles/tokens.scss` — CSS custom properties exactly as listed.                                   |
| §5 Layout System                  | `src/styles/layout.scss`. Shell max 1240px, gutter 56/24px.                                           |
| §6 Component Spec                 | One file per component (see §2.2 above).                                                              |
| §7 Interactions & Keyboard        | `src/scripts/keyboard.ts` + custom-event bus.                                                         |
| §8 Content Model                  | `src/content/config.ts` — zod schemas (see §5 below).                                                 |
| §9 Iconography                    | `public/assets/` for stack logos + one Astro file per UI glyph.                                       |
| §10 Performance Budget            | Enforced; see §6.4 below.                                                                             |
| §11 Accessibility                 | Verified via `scripts/check-contrast.ts` and manual a11y QA.                                          |
| §12 SEO & Metadata                | `BaseLayout.astro` — JSON-LD `Person`, OG/Twitter, sitemap.                                           |

Where this spec disagrees with `claude/SPECIFICATION.md`, **this spec wins** (it captures user decisions made during brainstorming):

- This spec uses **SCSS**; `claude/SPECIFICATION.md` says plain CSS.
- This spec ships **all three variants** of hero/experience/project; `claude/SPECIFICATION.md` §13 suggests dropping non-default variants.
- This spec **excludes** project deep-dive routes; `claude/SPECIFICATION.md` mentions them as optional.

---

## 5. Content Model

### 5.1 zod schemas (`src/content/config.ts`)

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

### 5.2 Singletons (typed JSON imports)

`identity.json` — name, role, tagline, summary, location, years-shipping, status, contact links.
`now.json` — building, researching, reading, working from.

Both imported directly: `import identity from '../content/identity.json'`. A hand-written interface in `src/content/types.ts` describes the shape and TS strict catches mismatches.

### 5.3 Seed sources

| Target                  | Source                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `identity.json`         | `Welcome.vue` intro text + the five contact links (Facebook, GitHub, Gmail, LinkedIn, Telegram).                                                             |
| `now.json`              | Plausible defaults from `claude/SPECIFICATION.md` examples. User edits after seeing the UI.                                                                  |
| `companies/opswat.yaml` | `Experience.vue` Opswat data: 3 roles (SE II → SE → ASE), MetaDefender ICAP product summary, full tech stack, problem-resolves keywords.                     |
| `projects/*.mdx`        | `Project.vue` projects (currently 3: HCMUS Event Management, H4 Webserver, Video Streaming Platform). Each MDX has frontmatter only at v1; body stays empty. |
| `skills.yaml`           | Aggregated from Experience + Projects tech stacks; levels seeded conservatively (user tunes).                                                                |
| `oss.yaml`              | `items: []` placeholder. OSS section renders an empty state.                                                                                                 |

---

## 6. Build, Deploy, Performance

### 6.1 `astro.config.mjs`

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
    css: { preprocessorOptions: { scss: { quietDeps: true } } },
  },
});
```

### 6.2 `tsconfig.json`

Extends `astro/tsconfigs/strict`. Adds:

```json
{
  "compilerOptions": {
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@components/*": ["./src/components/*"],
      "@styles/*": ["./src/styles/*"],
      "@content/*": ["./src/content/*"],
      "@scripts/*": ["./src/scripts/*"],
      "@config/*": ["./src/config/*"]
    }
  }
}
```

### 6.3 GitHub Actions — `.github/workflows/deploy.yml`

Replaces `vuepress-deploy.yml`. Uses the official `actions/deploy-pages` flow (no `gh-pages` branch).

```yaml
name: deploy
on:
  push: { branches: [main] }
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
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm lint
      - run: pnpm format:check
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
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

**One-time manual step (user):** GitHub repo → Settings → Pages → Source = "GitHub Actions". README will document this.

### 6.4 Performance budget

| Metric        | Target        | Strategy                                                                                                                         |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Initial JS gz | ≤ 25 KB       | Astro 0-JS by default; React only via `client:idle` (palette, help) and `client:visible` (terminal hero, list-variant projects). |
| LCP           | ≤ 1.5 s on 4G | Critical CSS inlined (Astro `inlineStylesheets: 'auto'`); preload IBM Plex Sans 400 + IBM Plex Serif 500.                        |
| CLS           | < 0.05        | Explicit width/height on avatar + project thumbnails.                                                                            |
| Lighthouse    | ≥ 95 each     | Standard Astro output + sitemap + JSON-LD baked at build.                                                                        |

### 6.5 Fonts

Self-hosted via `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-serif`, `@fontsource-variable/jetbrains-mono`. Preload only the two weights used above the fold (Sans 400, Serif 500); the rest load async.

### 6.6 Avatar

Migrated to `public/avatar.jfif` and rendered via `astro:assets` `<Image>` — converted to `.avif`/`.webp` at build, served at two sizes (original + 280×280), explicit aspect.

### 6.7 SEO

- `<title>`: `${identity.name} — ${identity.role}` (e.g. `Vu T. Nguyen — Backend Software Engineer`).
- Meta description: `identity.summary` with `*…`\* markers stripped at build.
- `<link rel="canonical">` set to deployed URL.
- JSON-LD `Person` schema in `<head>` (built from `identity.json`).
- Open Graph / Twitter card: 1200×630 static `public/og.png` for v1.
- `sitemap.xml` via `@astrojs/sitemap`.
- `robots.txt` allowing all.

---

## 7. Interactions

### 7.1 Theme & accent

- `<html data-theme="light|dark" data-accent="green|amber|blue|magenta|mono">`.
- Persisted in `localStorage`: keys `vtn:theme`, `vtn:accent`.
- First-visit fallback: `prefers-color-scheme` for theme, `site.defaultAccent` for accent.
- No-flash inline script in `<head>` of `BaseLayout.astro` — the only inline JS exception in the build, since it must run before paint.

### 7.2 Command palette (⌘K)

React island, hydrated `client:idle`. Item groups:

| Group    | Source                                           | Action                      |
| -------- | ------------------------------------------------ | --------------------------- |
| Navigate | static (Hero/Now/Experience/Projects/Skills/OSS) | smooth-scroll to section id |
| Theme    | static (Light/Dark)                              | `setTheme(…)`               |
| Accent   | static (Green/Amber/Blue/Magenta/Mono)           | `setAccent(…)`              |
| Contact  | from `identity.json`                             | `mailto:` / external link   |
| Projects | from project collection                          | scroll to card + expand     |

A11y: `role="dialog"`, `aria-modal="true"`, focus trap, Esc restores focus, list as `role="listbox"` with `role="option"` items.

### 7.3 Help overlay (`?`)

React island, hydrated `client:idle`. Modal listing all keyboard shortcuts in a 2-column row layout.

### 7.4 Keyboard layer (`src/scripts/keyboard.ts`)

Single `keydown` listener on `window`. Skips when focus is in `<input>`, `<textarea>`, or `[contenteditable]` — except `⌘K` / `Ctrl+K`.

| Shortcut              | Behavior                         |
| --------------------- | -------------------------------- |
| `⌘K` / `Ctrl+K`       | dispatch `palette:toggle`        |
| `/`                   | `palette:open` (input prefilled) |
| `?`                   | dispatch `help:toggle`           |
| `Esc`                 | dispatch `overlay:close`         |
| `j`                   | scroll to next section           |
| `k`                   | scroll to previous section       |
| `g g` (within 500 ms) | scroll to top                    |
| `Shift+G`             | scroll to bottom                 |
| `t`                   | toggle theme                     |

Active-section tracking: scroll listener with `passive: true`, throttled via `requestAnimationFrame`. Active section computed by checking each `[data-section]` against `scrollY + 120`. Active link gets `aria-current="true"`.

### 7.5 Custom event bus (`src/scripts/events.ts`)

```ts
type PaletteEvent = CustomEvent<{ prefill?: string }>;

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

Keyboard module dispatches; React islands listen via `useEffect`. Avoids cross-island state coupling.

### 7.6 Reduced motion

`@media (prefers-reduced-motion: reduce)`:

- HeroTerminal renders all lines instantly (no typing animation, no cursor blink).
- Pulse dot on top bar stays solid.
- Smooth-scroll → instant jump.
- Scanline overlay animation disabled (static grid stays).

---

## 8. Linting, Formatting & Editor Setup

### 8.1 Tooling

ESLint 9 (flat config) + Prettier 3 + plugins:

- `eslint`, `typescript-eslint`
- `eslint-plugin-astro`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-react`, `eslint-plugin-react-hooks`
- `prettier`, `prettier-plugin-astro`, `eslint-config-prettier`

### 8.2 `eslint.config.mjs`

```js
import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**'] },
  js.configs.recommended,
  ...ts.configs.strict,
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
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

### 8.3 `.prettierrc.json`

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "always",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }]
}
```

### 8.4 `.prettierignore`

```
dist
.astro
node_modules
pnpm-lock.yaml
public
```

### 8.5 TS-only enforcement

`scripts/check-no-js.ts` walks `src/` recursively. If any `.js` or `.jsx` file exists, prints the offenders and exits 1. Wired into `pnpm check` and CI.

### 8.6 VS Code — `.vscode/settings.json`

Committed so the format-on-save behavior is consistent across machines.

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

### 8.7 VS Code — `.vscode/extensions.json`

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

### 8.8 npm scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check && tsc --noEmit && tsx scripts/check-no-js.ts",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### 8.9 Local setup steps (user, post-merge)

1. `pnpm install`
2. Open repo in VS Code → click "Install All" on the recommended-extensions prompt.
3. Reload window (`Ctrl+Shift+P` → "Developer: Reload Window").
4. Save any file → confirm Prettier reformats.

---

## 9. Accessibility

- Color contrast: every ink/bg combination ≥ AA. Verified by `scripts/check-contrast.ts` for all 5 accents × light/dark.
- All interactive elements tab-reachable.
- Focus ring: `outline: 2px solid var(--accent); outline-offset: 2px`.
- Hero terminal: respects `prefers-reduced-motion`.
- Background scanlines: animation disabled under `prefers-reduced-motion`; static decoration may stay (with muted opacity).
- Command palette + help overlay: `role="dialog"`, `aria-modal="true"`, focus trap, restore focus on close.
- Active nav link: `aria-current="true"`.

---

## 10. Verification Before Marking Complete

Implementation is not "done" until every item below is confirmed by direct observation:

1. `pnpm install && pnpm check && pnpm lint && pnpm format:check && pnpm build && pnpm preview` all pass.
2. `http://localhost:4321/` loads; all six sections render: Hero, Now, Experience, Projects, Skills, OSS.
3. Switching `site.heroVariant` between `split` / `centered` / `terminal` rebuilds correctly; same for experience and project variants.
4. Theme toggle (`t` and top-bar glyph) cycles light ↔ dark with no FOUC.
5. Each accent (`green`, `amber`, `blue`, `magenta`, `mono`) renders correctly in light + dark.
6. `⌘K` opens palette; arrow keys navigate; Enter selects; Esc closes; focus restores.
7. `?` opens help overlay; lists every shortcut from §7.4.
8. `j` / `k` jump between sections; `gg` scrolls to top; `Shift+G` to bottom.
9. At `max-width: 900px`, layout collapses per `claude/SPECIFICATION.md` §5.4 (no top-bar nav, single-column, no section-num gutter).
10. `du -sh dist/_astro/*.js` confirms initial JS budget ≤ 25 KB gz.
11. Lighthouse audit ≥ 95 in every category.
12. `prefers-reduced-motion: reduce` users see no animation.
13. CI pipeline green on push to `main`; site live at `https://ntvu19.github.io`.

---

## 11. Out of Scope (Explicit)

- Vietnamese locale.
- Markdown content trees (`algorithm/`, `database/`, `programming/`, etc.).
- Browser-tab favicon rotation.
- Medium-zoom image plugin.
- CodeMirror in-page code editor.
- Project deep-dive routes (`/projects/<slug>`).
- Custom domain.
- Analytics.
- Tweaks runtime panel (replaced by build-time `site.ts` config).
- Blog / writing section.
- Husky / lint-staged pre-commit hooks (CI runs the same checks).

---

## 12. Open Questions Deferred to Implementation

None blocking. Items the user may want to revisit during implementation:

- Real OSS repo URLs and star counts (currently empty).
- Final content for `now.json` (placeholders until UI is reviewed).
- Skill levels and years (seeded conservatively).
- Whether to add Husky + lint-staged later if CI catches too much too late.

---

_Last updated: 2026-04-25._
