# La Nueva Delicia website

Bilingual (es/en) static website for the La Nueva Delicia restaurant in Jackson Heights, NY. Next.js (App Router,
static export), TypeScript, Tailwind CSS, next-intl. Hosted on Cloudflare Pages.

## Commands

Node 22 is the target (`.nvmrc`); Node >= 20.9 works.

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server |
| `npm run build` | Validates content (`prebuild`: `tests/unit/data.test.ts`), then static export to `out/` |
| `npm run check:out` | Checks the shape of `out/` (redirect, locales, 404, hosting files) |
| `npm run serve:out` | Serves `out/` on http://localhost:4173 |
| `npm test` | Unit tests (Vitest) |
| `npm run e2e` | End-to-end tests (Playwright; serves `out/` itself, run `build` first) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |

First time: `npm install && npx playwright install chromium`.

## Notes

- `serve.json`: `serve` only resolves `/es/` to `es/index.html` with `cleanUrls` at its default, so it is not set to `false`.
- `public/_redirects` and `public/_headers` are Cloudflare Pages files, copied to `out/`.

## Content

- Facts: `src/data/restaurant.ts` (spec 02). Menu, specials, photos: `src/data/{menu,specials,photos}.ts`.
- Types in `src/types/content.ts`; Zod schemas and `validateContent()` in `src/data/schemas.ts`; link builders in `src/lib/links.ts`.

## Docs

- Spec: [docs/superpowers/specs/2026-11-12-website-design/](docs/superpowers/specs/2026-11-12-website-design/README.md)
- Plan: [docs/superpowers/plans/2026-11-12-website/](docs/superpowers/plans/2026-11-12-website/)
