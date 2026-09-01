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

## Garden — pick a plant (CI)

When a project gets a botanical codename, run the **pick plant** workflow in GitHub Actions:

1. Actions → **pick plant** → Run workflow
2. **plant_id** — id from `src/data/botanical.json` (e.g. `lavender`, `daisy`)
3. **project_url** — link to the repo or site (e.g. `https://github.com/ntvu19/lavender`)

The workflow sets `picked: true` and `projectLink` on that entry, commits to `main`, and the deploy workflow publishes the update.

Locally:

```bash
pnpm exec tsx scripts/pick-plant.ts lavender https://github.com/ntvu19/lavender
```

## Deploy

CI deploys on push to `main` via `actions/deploy-pages`.

**One-time GitHub setup** (after first push of this branch to `main`):

1. Repo → Settings → Pages → Source = **GitHub Actions**.
2. Run the `deploy` workflow manually once if it didn't auto-trigger.

## Variant config

Edit `src/config/site.ts` to swap hero / experience / project variants and the default theme/accent.
