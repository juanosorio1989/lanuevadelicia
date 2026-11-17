# Task 1: Phone orders, delivery range, gallery hidden

Implementer: `implementer-sonnet`. Reviewer: `reviewer-opus`. Spec sections 3, 4 and "Dev server on a phone".

**Files:**
- Modify: `src/types/content.ts` (`Restaurant.deliveryRange`, no `deliveryNote`), `src/data/restaurant.ts`
- Modify: `src/components/shared/PhoneOrder.tsx` (spike), `src/components/shared/DeliveryLinks.tsx` (`showPrompt`)
- Modify: `src/app/[locale]/visit/page.tsx`, `src/components/home/VisitBlock.tsx`
- Modify: `messages/es.json`, `messages/en.json` (`delivery.phoneTitle`, `delivery.phoneBody`, `delivery.range`)
- Modify: `src/components/layout/nav-items.ts` (no gallery), `src/lib/seo.ts` (sitemap list), `next.config.ts`
- Modify: `docs/superpowers/specs/2026-11-12-website-design/02-business-facts.md`, `03-site-and-pages.md`
- Test: `tests/unit/data.test.ts`, `tests/unit/seo.test.ts`, `tests/e2e/pages.spec.ts`, `tests/e2e/home.spec.ts`,
  `tests/e2e/chrome.spec.ts`

**Interfaces:**
- Produces: `restaurant.deliveryRange: { freeMiles: number; maxMiles: number }` = `{ freeMiles: 1, maxMiles: 1.5 }`.
- Produces: `PhoneOrder({ locale, location, variant?: "links" | "buttons", className? })` (server component),
  root `data-testid="phone-order"`.
- Produces: `sitemapPaths: PagePath[]` in `src/lib/seo.ts` = `pagePaths` without `"gallery"`; `sitemap.ts` maps
  `sitemapPaths`. `pagePaths` itself keeps `"gallery"` (the page is still built and has metadata).

Exact copy (already in the spike's messages; verify, do not reword):

| key | es | en |
|-----|----|----|
| `delivery.phoneTitle` | Pide por teléfono | Order by phone |
| `delivery.phoneBody` | `Llámanos al <phone></phone> para recoger o para domicilio.` | `Call <phone></phone> for pickup or delivery.` |
| `delivery.range` | `Domicilio: hasta {free} milla sin recargo; de {free} a {max} millas, con recargo. A más de {max} millas, pide por:` | `Delivery: up to {free} mile at no extra charge; {free} to {max} miles, extra charge. Beyond {max} miles, order on:` |

- [ ] **Step 1: Write the failing tests**

`tests/unit/data.test.ts`, new case:
```ts
it("delivery range: free up to 1 mile, own delivery up to 1.5 miles", () => {
  expect(restaurant.deliveryRange).toEqual({ freeMiles: 1, maxMiles: 1.5 });
  expect("deliveryNote" in restaurant).toBe(false);
});
```
`tests/unit/seo.test.ts`: rename the sitemap case to "sitemap lists 12 pages (gallery hidden) with es/en
alternates", expect length `12`, and `expect(entries.some((e) => e.url.includes("/gallery/"))).toBe(false)`.

`tests/e2e/pages.spec.ts`, visit (es) test: replace the old delivery-note line with
```ts
const order = main.getByTestId("phone-order");
await expect(order).toContainText("Pide por teléfono");
await expect(order).toContainText("Llámanos al (718) 672-3456 para recoger o para domicilio.");
await expect(order).toContainText("Domicilio: hasta 1 milla sin recargo; de 1 a 1.5 millas, con recargo. A más de 1.5 millas, pide por:");
await expect(order.getByRole("link", { name: "(718) 672-3456" })).toHaveAttribute("href", telHref());
await expect(main).not.toContainText("cargo extra");
```
Add a test "visit (en): phone order copy" on `/en/visit/` asserting the EN strings above (with 1 and 1.5 substituted)
and the three app links inside `phone-order`.

`tests/e2e/home.spec.ts`: a test "home visit block has the phone-order block" on `/es/` and `/en/`: `phone-order`
visible, contains the title and the range line, has the three app links, and does not contain "¿Prefieres a domicilio?"
/ "Prefer delivery?".

`tests/e2e/chrome.spec.ts`:
- "clicking a link in the open dialog closes it": click "Visítanos" instead of "Galería", expect `/es/visit/`.
- "footer nav reaches every section as plain links": loop over Nuestra historia and Visítanos only; add
  `await expect(page.getByRole("contentinfo").getByRole("link", { name: "Galería" })).toHaveCount(0)`.
- New test "gallery is hidden from navigation in both languages": on `/es/` and `/en/` at 390px and 1280px, header
  nav, mobile dialog and footer have no link whose `href` contains `/gallery/`
  (`page.locator('a[href*="/gallery/"]')` count 0 after opening the dialog at 390px).
- Keep "language switch keeps the page" on `/en/gallery/` (the page still exists).

- [ ] **Step 2: Run them; expect the new ones to fail where the spike is incomplete**

Run: `npx vitest run tests/unit/data.test.ts tests/unit/seo.test.ts`
Expected: the sitemap case FAILS (14 entries); data case may pass on the spike.

- [ ] **Step 3: Implement**

- `sitemapPaths` in `src/lib/seo.ts`, used by `src/app/sitemap.ts`.
- `PhoneOrder`: keep the spike's structure; the phone is a `TrackedLink` with `event="click_call"`, the `location`
  prop, `href={telHref()}`, text `restaurant.phone.display`; miles passed as `String(...)` so ICU does not print
  `1,5`. Visit page uses `variant="buttons"` (app buttons ≥ 44px tall); home `VisitBlock` uses the default links.
- `next.config.ts`: keep `allowedDevOrigins: ["192.168.*.*"]` with its one-line comment.
- Spec 02: replace the "Delivery note" row with "Phone orders: pickup and delivery by phone" and "Delivery range: up
  to 1 mile free; 1–1.5 miles extra charge (amount not shown); beyond 1.5 miles only via the apps", source "Owner,
  2026-11-15". Spec 03: Gallery row and nav labels say "hidden from navigation and sitemap since 2026-11-15 (page
  kept)". Point both at `docs/superpowers/specs/2026-11-15-menu-search-design/`.

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run lint && npm test && npm run build && npm run check:out && npm run check:links && npx playwright test tests/e2e/pages.spec.ts tests/e2e/home.spec.ts tests/e2e/chrome.spec.ts tests/e2e/seo.spec.ts`
Expected: all pass. (`menu.spec.ts` and `site.spec.ts` may still fail on the spike search box until Task 2; say so in
the report if they do, do not fix them here.)

- [ ] **Step 5: Commit**

```bash
git add -A src messages next.config.ts tests docs/superpowers/specs
git commit -m "feat: phone orders and delivery range; hide gallery from nav and sitemap"
```
