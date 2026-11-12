# 05. Design system

## Direction (owner decision)

**B, contemporary editorial, with light touches of C (rustic heritage).** It is calm, warm, and has generous white
space, and the large photos are the hero. The restaurant's photos already carry strong Colombian props (Willys jeep
toys, paisa houses, sombrero vueltiao, rustic wood, orchids), so the UI chrome stays restrained and does not repeat
them. The "C" touches are limited to: a thin coffee-leaf/bean line icon, the "Raíces en Caldas · Eje Cafetero"
line, and the sand band behind the daily special. No wood or paper textures.

Directions rejected: A (traditional, bright yellow/red, hand-painted type) looked too busy next to the photos and
risked cliché. Pure C (textures) hurt load speed and legibility.

## Color tokens

| Token | Hex | Use |
|-------|-----|-----|
| `green-900` | `#253D30` | Header, footer-adjacent bands, headings on cream, outline buttons |
| `cream-50` | `#F4EBDD` | Page background |
| `sand-100` | `#E8DCC8` | Special band, chips background, dividers |
| `white` | `#FFFFFF` | Cards |
| `terra-500` | `#C85E36` | Decorative only: icons, large display accents ≥24px |
| `terra-700` | `#A2471F` | Primary buttons (white text 6.07:1), prices and eyebrow text on cream (5.14:1) and white |
| `charcoal-900` | `#252722` | Body text (12.77:1 on cream), footer background |
| `muted-600` | `#555555` | Secondary text (6.31:1 on cream) |
| `star` | `#E9B44C` | Star glyphs only, always next to text |

Contrast was checked: white on `#C85E36` is 4.11:1, which **fails** AA for normal text. That is why buttons and small
terracotta text use `terra-700`. Do not put small `terra-700` text on `sand-100` (4.48:1); use green or charcoal
there. The site is light-themed only (Claude's call; restaurant sites rarely benefit from a dark mode, and the photos
are tuned for light surroundings).

## Typography

- Headings: **Playfair Display** 600/700. Body and UI: **DM Sans** 400/500/700. Load both via `next/font/google`
  (self-hosted at build), `display: swap`, latin only (it includes the Spanish accents, ñ, ¿ and ¡; latin-ext was dropped to save two preloaded woff2 files).
- Scale (mobile → desktop): H1 28→44px, H2 22→30px, H3 18→20px, body 16px (line-height 1.6), small 13–14px. Eyebrow:
  12px, 700, uppercase, letter-spacing .12em, `terra-700`.

## Shape, spacing, layout

- Radius: cards 12px, bands 14px, buttons fully rounded (pill).
- Spacing: a 4px base scale (Tailwind default). Sections get 44px padding on desktop and 22px on mobile. The page
  gutter is 16px on mobile.
- Max content width 1200px. The hero is full-bleed.
- Breakpoints: Tailwind defaults. The bottom bar shows below `md` (768px).

## Components (inventory)

`Header`, `MobileNav`, `MobileActionBar`, `LanguageSwitch`, `Footer`, `Button` (primary / outline / on-dark
variants, min height 44px), `OpenStatus` (client), `Hero`, `DishCard` (vertical) and `DishRow` (horizontal mobile
card), `MenuCategory`, `MenuItemRow`, `CategoryChips` (client enhancement), `TodaySpecial` (client), `SpecialDay`,
`StoryBlock`, `ReviewsBand`, `HoursTable`, `MapEmbed` (click-to-load, client), `DeliveryLinks`, `Gallery` and
`GalleryDialog` (client), `PhotoPlaceholder` (dev only, see [06-photos.md](06-photos.md)). The gallery dialog and the mobile nav
panel both use the native `<dialog>` element (no Radix), to stay inside the JS budget. Use shadcn/ui only for
primitives that ship no client JS, or skip it. Lucide for icons. Emoji appear in the mockups only.

## Motion and accessibility

- Motion: only subtle hover and focus transitions and the header shrink. Respect `prefers-reduced-motion`.
- WCAG 2.2 AA: visible focus rings (2px green-900 + offset), targets ≥44px, skip link, `lang` attribute per locale,
  semantic landmarks, one H1 per page, alt text on every image, and the menu works without JS.

## Voice

Warm and plain, like a family host. Spanish uses "tú". Short sentences. Avoid superlatives ("el mejor de NY").
English is the same voice, not a literal translation.
