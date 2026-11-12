# Copy review

Copy that Claude wrote and the owner has **not** reviewed yet. Menu items and prices are in
[menu-review.md](menu-review.md); this page lists the rest. Text is quoted as it is live today. Message keys live in
`messages/es.json` and `messages/en.json`.

## Short UI copy

| Where (key) | ES | EN |
|-------------|----|----|
| `specials.lead` | Un especial distinto cada día, preparado en casa. | A different special every day, made in house. |
| `gallery.lead` | Algunos de nuestros platos y bebidas. | Some of our dishes and drinks. |
| `story.expect.0.body` | Recetas de siempre, preparadas en casa. | Time-honored recipes, cooked in-house. |
| `story.expect.1.body` | Cocinamos con ingredientes frescos. | We cook with fresh ingredients. |
| `story.expect.2.body` | Aquí te sientes como en casa. | Here you feel at home. |
| `map.hint` | El mapa se carga solo al tocar el botón. | The map loads only when you tap the button. |
| `specials.seeMenu` | Ver el menú completo | See the full menu |

## Home hero and story

- `home.hero.lead` (EN is Claude's translation): "Fresh, home-style food cooked just right, with 30+ years in
  Jackson Heights. Come feel at home." (ES: "Comida casera, fresca y en su punto, con más de 30 años en Jackson
  Heights. Ven a sentirte como en casa.")
- `home.story.body`, EN translation of the Spanish story text (also check "more than three decades" matches the
  owner's own wording).

## Page descriptions (`meta.*.description`)

All seven descriptions in both languages are Claude's: `meta.home`, `meta.menu`, `meta.specials`, `meta.story`,
`meta.gallery`, `meta.visit`, `meta.privacy`. Titles are Claude's too. Check the claims they make ("más de 30 años",
"bandeja paisa", "pescados y mariscos", "sin anuncios ni remarketing").

## Privacy page (`privacy.*`, `src/app/[locale]/privacy/page.tsx`)

The whole text is Claude's draft (`COPY-REVIEW` comment in the page). One sentence needs a decision. Live text:

- ES: "Usamos Google Analytics (GA4) para medir de forma anónima cómo se usa el sitio ... No guardamos tu nombre ni
  datos personales."
- EN: "We use Google Analytics (GA4) to measure, anonymously, how the site is used ... We do not store your name or
  personal details."

This overstates what GA4 does. GA4 sets cookies and a client ID in the visitor's browser and collects the approximate
location and device. Nothing is changed in the live text. Proposed wording for the owner to approve:

- ES: "Usamos Google Analytics (GA4) para saber qué páginas se visitan y qué botones se tocan. GA4 guarda cookies y
  un identificador aleatorio en tu navegador, y recibe datos como tu ubicación aproximada y tu tipo de dispositivo.
  No sabemos quién eres y no te pedimos tu nombre ni otros datos personales."
- EN: "We use Google Analytics (GA4) to learn which pages are visited and which buttons are tapped. GA4 stores cookies
  and a random identifier in your browser, and receives data such as your approximate location and device type. We
  do not know who you are, and we do not ask for your name or other personal details."

The `meta.privacy.description` ("estadísticas de uso anónimas" / "anonymous usage statistics") should follow the
approved wording. The 404 page (`src/app/not-found.tsx`, `COPY-REVIEW` comment) is also Claude's draft: "Página no
encontrada / No encontramos lo que buscas" and "Page not found / We could not find what you were looking for".

## English dish names (from the Task 5 notes)

These English names are Claude's wording of the Spanish names; see also the table in [menu-review.md](menu-review.md).

| ES | EN today | Question |
|----|----------|----------|
| Picada doble | Double picada platter | Does the owner use an English name for it? |
| Chorizo con arepita | Sausage with little corn cake | "Arepita" could stay untranslated. |
| Calentado ... (four items) | Calentado with pork chop / grilled beef / chicken breast and eggs as you like; Calentado with eggs as you like | Keep "Calentado" with a short explanation? |
| Jarra de refajo envenenado | Pitcher of spiked refajo | The Spanish is literally "poisoned refajo"; "spiked" is Claude's choice. |
| Flyer alt texts (specials) | English alt texts for the weekly flyers | Check the dish names. |
