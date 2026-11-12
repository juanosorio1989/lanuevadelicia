# Task 2: Types, Zod schemas, restaurant facts, link builders

Spec pages: 02 (all facts and link rules), 04 (item rules), 07 (data models).

**Files:**
- Create: `src/types/content.ts`, `src/data/schemas.ts`, `src/data/restaurant.ts`, `src/lib/links.ts`
- Create (empty stubs, filled by Tasks 4 and 5): `src/data/menu.ts` (`export const categories = []; export const menuItems = []`),
  `src/data/specials.ts` (`export const specials = []`), `src/data/photos.ts` (`export const photos = []`)
- Test: `tests/unit/links.test.ts`, `tests/unit/data.test.ts`
- Modify: `package.json` (`"prebuild": "vitest run tests/unit/data.test.ts"`)

**Interfaces:**
- Produces (in `src/types/content.ts`):
  ```ts
  export type Locale = 'es' | 'en';            // re-export of the i18n type is fine
  export type L10n = { es: string; en: string };
  export type IsoWeekday = 1|2|3|4|5|6|7;
  export type CategoryId = 'desayunos'|'antojitos'|'ricuras'|'pollo'|'mariscos'|'ensaladas'|'especiales'
    |'infantil'|'extras'|'postres'|'bebidas'|'cocteles'|'cervezas';
  export type PhotoId = string;
  export interface Photo { id: PhotoId; src: string; width: number; height: number; alt: L10n;
    group: 'dishes'|'drinks'|'specials'|'restaurant' }
  export interface MenuOption { label: L10n; price?: number }
  export interface MenuItem { id: string; category: CategoryId; subcategory?: L10n; name: L10n; description?: L10n;
    price?: number; options?: MenuOption[]; image?: PhotoId; featured?: boolean; featuredOrder?: number;
    available?: boolean; allergens?: string[] }
  export interface MenuCategory { id: CategoryId; name: L10n; note?: L10n; order: number }
  export interface SpecialDay { day: IsoWeekday; main: L10n; alternative?: L10n; price: number; flyer: PhotoId }
  export interface HoursRule { days: IsoWeekday[]; open: string; close: string }
  export type Hours = HoursRule[];
  export interface Restaurant { name: string; address: { street: string; locality: string; region: string;
    postalCode: string; country: 'US'; oneLine: string }; phone: { e164: string; display: string };
    email: string; hours: Hours; breakfastUntil: string; happyHour: { days: IsoWeekday[]; from: string; to: string }[];
    happyHourCocktailPrice: number; deliveryNote: L10n; instagram: { handle: string; url: string };
    googleMapsUrl: string; googlePlaceId?: string; rating: { value: number; count: number; asOf: string; displayCount: string };
    delivery: { app: 'ubereats'|'doordash'|'grubhub'; label: string; url: string }[]; siteUrl: string;
    timeZone: 'America/New_York'; foundedClaim: L10n }
  ```
- Produces: `restaurant: Restaurant` (`src/data/restaurant.ts`); `schemas` (Zod, one per type) and
  `validateContent(): void` (throws a readable error that lists every problem) in `src/data/schemas.ts`.
  `directionsUrl(): string`, `telHref(): string`, `mapsEmbedUrl(): string`, `reviewsUrl(): string`,
  `writeReviewUrl(): string` in `src/lib/links.ts`.

- [ ] **Step 1: Write `tests/unit/links.test.ts`**

```ts
expect(directionsUrl()).toBe('https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent('La Nueva Delicia, 93-16B 37th Ave, Jackson Heights, NY 11372'));
expect(telHref()).toBe('tel:+17186723456');
expect(mapsEmbedUrl()).toBe('https://www.google.com/maps?q=' +
  encodeURIComponent('La Nueva Delicia, 93-16B 37th Ave, Jackson Heights, NY 11372') + '&output=embed');
expect(reviewsUrl()).toBe('https://maps.app.goo.gl/4CmW2ZLtRpvPJKb56');
// no place id yet → write-review falls back to the listing
expect(writeReviewUrl()).toBe('https://maps.app.goo.gl/4CmW2ZLtRpvPJKb56');
```
Plus one case with a stubbed `googlePlaceId: 'ChIJtest'`: `directionsUrl()` ends with `&destination_place_id=ChIJtest`,
and `writeReviewUrl()` is `https://search.google.com/local/writereview?placeid=ChIJtest`. Make the functions accept an
optional `r: Restaurant = restaurant` so this is testable.

- [ ] **Step 2: Write `tests/unit/data.test.ts`**

`it('content validates', () => expect(() => validateContent()).not.toThrow())`. Also add unit cases that feed the
schemas bad samples and expect failure: a price of `0` or negative; an `en` name that is empty; a duplicate item id;
an `image` id missing from `photos`; a `featured` item without an image; an hours `open` of `'9:00'` (it must be
`HH:MM`); a `SpecialDay.day` of `0`. With empty stubs, `validateContent()` must pass. (Task 4 adds the counts.)

- [ ] **Step 3: Run the tests and confirm they fail** (modules missing)

`npx vitest run tests/unit` → FAIL.

- [ ] **Step 4: Implement** `src/types/content.ts`, `src/data/schemas.ts`, `src/data/restaurant.ts` and `src/lib/links.ts`

Fill `restaurant.ts` with the exact values from spec 02. The hours are
`[{days:[1,2,3,4],open:'09:00',close:'21:00'},{days:[5,6,7],open:'09:00',close:'22:00'}]`. `breakfastUntil: '13:00'`.
Happy hour is `[{days:[1,2,3,4,5],from:'12:00',to:'19:00'},{days:[6,7],from:'17:00',to:'20:00'}]`, at $8.
The rating is `{value:4.4,count:452,asOf:'2026-11-12',displayCount:'450+'}`. The delivery apps come in the order
Uber Eats, DoorDash, Grubhub, with the spec 02 URLs. `siteUrl` reads `process.env.NEXT_PUBLIC_SITE_URL ??
'https://lanuevadelicia.com'`. Cross-reference checks (image ids, featured) live in `validateContent()`.

- [ ] **Step 5: Run** `npx vitest run tests/unit` → PASS, and `npm run build` → PASS (prebuild runs validation).

- [ ] **Step 6: Commit** `feat: add content types, schemas, restaurant facts and link builders`
