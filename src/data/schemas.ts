import { z } from "zod";
import { restaurant } from "./restaurant";
import { categories, menuItems } from "./menu";
import { specials } from "./specials";
import { photos } from "./photos";

const text = z.string().trim().min(1);
const l10n = z.object({ es: text, en: text });
const price = z.number().positive().finite();
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "must be HH:MM (24h)");
const weekday = z.number().int().min(1).max(7);
const categoryId = z.enum([
  "desayunos", "antojitos", "ricuras", "pollo", "mariscos", "ensaladas", "especiales",
  "infantil", "extras", "postres", "bebidas", "cocteles", "cervezas",
]);

const photo = z.object({
  id: text,
  src: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: l10n,
  group: z.enum(["dishes", "drinks", "specials", "restaurant"]),
});
const menuOption = z.object({ label: l10n, price: price.optional() });
const menuItem = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be kebab-case"),
  category: categoryId,
  subcategory: l10n.optional(),
  name: l10n,
  description: l10n.optional(),
  price: price.optional(),
  options: z.array(menuOption).optional(),
  image: text.optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().int().optional(),
  available: z.boolean().optional(),
  allergens: z.array(text).optional(),
});
const menuCategory = z.object({
  id: categoryId,
  name: l10n,
  note: l10n.optional(),
  order: z.number().int(),
});
const specialDay = z.object({
  day: weekday,
  main: l10n,
  alternative: l10n.optional(),
  price,
  flyer: text,
});
const hoursRule = z.object({ days: z.array(weekday).min(1), open: hhmm, close: hhmm });
const restaurantSchema = z.object({
  name: text,
  address: z.object({
    street: text, locality: text, region: text, postalCode: z.string().regex(/^\d{5}$/),
    country: z.literal("US"), oneLine: text,
  }),
  phone: z.object({ e164: z.string().regex(/^\+1\d{10}$/), display: text }),
  email: z.email(),
  hours: z.array(hoursRule).min(1),
  breakfastUntil: hhmm,
  happyHour: z.array(z.object({ days: z.array(weekday).min(1), from: hhmm, to: hhmm })),
  happyHourCocktailPrice: price,
  deliveryNote: l10n,
  instagram: z.object({ handle: text, url: z.url() }),
  googleMapsUrl: z.url(),
  googlePlaceId: text.optional(),
  rating: z.object({
    value: z.number().min(0).max(5), count: z.number().int().positive(),
    asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), displayCount: text,
  }),
  delivery: z.array(
    z.object({ app: z.enum(["ubereats", "doordash", "grubhub"]), label: text, url: z.url() }),
  ),
  siteUrl: z.url(),
  timeZone: z.literal("America/New_York"),
  foundedClaim: l10n,
});

export const schemas = {
  l10n, photo, menuOption, menuItem, menuCategory, specialDay, hoursRule,
  restaurant: restaurantSchema,
};

export interface ContentData {
  categories: unknown[];
  menuItems: unknown[];
  specials: unknown[];
  photos: unknown[];
}

const defaults: ContentData = { categories, menuItems, specials, photos };

/** Validates all content. Throws one error listing every problem. */
export function validateContent(data: ContentData = defaults, facts: unknown = restaurant): void {
  const problems: string[] = [];
  const check = (label: string, schema: z.ZodType, values: unknown[]) =>
    values.forEach((v, i) => {
      const r = schema.safeParse(v);
      if (!r.success)
        for (const issue of r.error.issues)
          problems.push(`${label}[${i}].${issue.path.join(".")}: ${issue.message}`);
    });

  const r = restaurantSchema.safeParse(facts);
  if (!r.success)
    for (const issue of r.error.issues)
      problems.push(`restaurant.${issue.path.join(".")}: ${issue.message}`);
  check("categories", menuCategory, data.categories);
  check("menuItems", menuItem, data.menuItems);
  check("specials", specialDay, data.specials);
  check("photos", photo, data.photos);

  const photoIds = new Set((data.photos as { id: string }[]).map((p) => p.id));
  const seen = new Set<string>();
  for (const it of data.menuItems as { id: string; image?: string; featured?: boolean }[]) {
    if (seen.has(it.id)) problems.push(`menuItems: duplicate id "${it.id}"`);
    seen.add(it.id);
    if (it.image !== undefined && !photoIds.has(it.image))
      problems.push(`menuItems "${it.id}": image "${it.image}" is not in photos`);
    if (it.featured && !it.image)
      problems.push(`menuItems "${it.id}": featured item needs an image`);
  }
  for (const s of data.specials as { day: number; flyer: string }[])
    if (!photoIds.has(s.flyer))
      problems.push(`specials day ${s.day}: flyer "${s.flyer}" is not in photos`);

  if (problems.length)
    throw new Error(`Content validation failed:\n- ${problems.join("\n- ")}`);
}
