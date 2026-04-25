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
