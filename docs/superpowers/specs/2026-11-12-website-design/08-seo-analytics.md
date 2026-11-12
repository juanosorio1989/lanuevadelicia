# 08. SEO and analytics

## Local SEO

Target themes (not ranking promises): Colombian restaurant Jackson Heights, Colombian food Jackson Heights NY,
Colombian food Queens NY, bandeja paisa Jackson Heights, Colombian breakfast Queens, and the Spanish equivalents
(restaurante colombiano Jackson Heights, comida colombiana Queens, desayunos colombianos Queens).

- Unique `<title>` and meta description per page and locale. Example, home ES: "La Nueva Delicia | Restaurante
  colombiano en Jackson Heights, Queens". Home EN: "La Nueva Delicia | Colombian Restaurant in Jackson Heights,
  Queens".
- `hreflang`: `es`, `en`, and `x-default` → `/es/` on every page. Self-referencing canonical URLs (absolute,
  trailing slash).
- `sitemap.xml` with both locales and alternates. `robots.txt` allows all and points to the sitemap.
- Open Graph and Twitter cards per page (1200×630 image from the Bandeja Paisa photo, generated at build or
  committed), with `og:locale` `es_US` / `en_US`.
- NAP is identical everywhere and identical to Google Business Profile. The footer shows it on every page.
- Internal links: home → menu, specials, visit. Menu category notes → specials page. Specials → menu.
- Menu, hours and address are crawlable HTML (never only images or PDFs).
- No doorway pages. No location claims beyond Jackson Heights / Queens.

## Structured data (JSON-LD)

- Home and Visit pages: `Restaurant` with `name`, `url`, `logo`, `image`, `address` (PostalAddress: 93-16B 37th Ave,
  Jackson Heights, NY 11372, US), `telephone`, `openingHoursSpecification` (from data), `servesCuisine: "Colombian"`,
  `priceRange: "$$"` (Claude's call, derived from menu prices of $3–$65), `hasMenu` → menu URL, `acceptsReservations:
  false` (Q3 to confirm), and `sameAs` (Instagram, Google Maps link, Uber Eats, DoorDash, Grubhub). Add `geo` only if
  the owner gives coordinates or the Place ID (Q2); never guess them.
- Menu page: `Menu` with `MenuSection` and `MenuItem` (with `offers.price`, `priceCurrency: USD`) generated from
  data.
- **No `aggregateRating` or `review`**: Google treats self-served review markup for a LocalBusiness as ineligible
  and possibly spammy. The rating is shown as text only.
- Validate with Google's Rich Results Test before launch.

## Owner-side (not code; launch checklist)

Verify the Google Business Profile (website URL → `https://lanuevadelicia.com/es/`, hours, menu link). Set up
Search Console (domain property via a DNS TXT record) and submit the sitemap. Update the Instagram bio link and fix
the "delicias" spelling on Uber Eats if it appears in the display name.

## Analytics (GA4)

Load GA4 with `@next/third-parties/google` (or an equivalent small loader) only when `NEXT_PUBLIC_GA_ID` is set, and
after hydration. No cookie banner in the MVP (Claude's call: a NY-only audience, no ads or remarketing). The privacy
page discloses GA4. IP anonymization is GA4's default.

Custom events (`lib/analytics.ts`, one typed `track()` function):

| Event | When | Params |
|-------|------|--------|
| `click_directions` | Any Cómo llegar / Get Directions | `location` (hero, header, bottom_bar, visit, footer), `locale` |
| `click_call` | Any `tel:` link | `location`, `locale` |
| `click_delivery` | A delivery app link | `app` (ubereats, doordash, grubhub), `location` |
| `click_reviews` | Read / Leave review | `action` (read, write) |
| `load_map` | Map card clicked | `page` |
| `switch_language` | Language switch | `from`, `to` |
| `view_menu_category` | Chip tapped | `category` |
| `click_instagram` | Instagram link | `location` |

Mark `click_directions` and `click_call` as key events (conversions) in GA4.
