import { Button } from "@/components/ui/Button";
import type { Locale, MenuCategory, MenuItem } from "@/types/content";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemRow, type ItemHeading, type MenuLabels } from "./MenuItemRow";

type Props = { category: MenuCategory; items: MenuItem[]; locale: Locale; labels: MenuLabels; specialsLink?: { href: string; label: string } };

function Group({ items, locale, labels, heading }: { items: MenuItem[]; locale: Locale; labels: MenuLabels; heading: ItemHeading }) {
  const cards = items.filter((i) => i.image);
  const rows = items.filter((i) => !i.image);
  return (
    <>
      {cards.length > 0 && (
        <ul className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4">
          {cards.map((i) => (
            <MenuItemCard key={i.id} item={i} locale={locale} labels={labels} heading={heading} />
          ))}
        </ul>
      )}
      {rows.length > 0 && (
        <ul className="mt-4 grid md:grid-cols-2 md:gap-x-10">
          {rows.map((i) => (
            <MenuItemRow key={i.id} item={i} locale={locale} labels={labels} heading={heading} />
          ))}
        </ul>
      )}
    </>
  );
}

/** One category: H2, optional note, photo cards first, then the text rows (grouped by subcategory when present). */
export function MenuCategorySection({ category, items, locale, labels, specialsLink }: Props) {
  const groups: { title?: string; items: MenuItem[] }[] = [];
  for (const item of items) {
    const title = item.subcategory?.[locale];
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.items.push(item);
    else groups.push({ title, items: [item] });
  }
  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-title`}
      className="scroll-mt-[var(--menu-sticky-offset)] py-5 md:py-7"
    >
      <h2 id={`${category.id}-title`} className="text-[1.375rem] md:text-[1.75rem]">
        {category.name[locale]}
      </h2>
      {category.note && <p className="mt-1 text-[0.8125rem] font-bold text-terra-700">{category.note[locale]}</p>}
      {specialsLink && (
        <div className="mt-3">
          <Button href={specialsLink.href} variant="outline">
            {specialsLink.label}
          </Button>
        </div>
      )}
      {groups.map((g) => (
        <div key={g.title ?? "all"} className="mt-2">
          {g.title && <h3 className="mt-4 text-lg">{g.title}</h3>}
          <Group items={g.items} locale={locale} labels={labels} heading={g.title ? "h4" : "h3"} />
        </div>
      ))}
    </section>
  );
}
