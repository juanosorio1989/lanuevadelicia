import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { buildMetadata, menuJsonLd, pageUrl, restaurantJsonLd } from "@/lib/seo";

describe("seo", () => {
  it("builds absolute urls with a trailing slash", () => {
    expect(pageUrl("es", "")).toBe("https://lanuevadelicia.com/es/");
    expect(pageUrl("en", "menu")).toBe("https://lanuevadelicia.com/en/menu/");
  });

  it("builds canonical, hreflang and social metadata", () => {
    const m = buildMetadata({ locale: "en", path: "menu", title: "t", description: "d" });
    expect(m.alternates?.canonical).toBe("https://lanuevadelicia.com/en/menu/");
    expect(m.alternates?.languages).toEqual({
      es: "https://lanuevadelicia.com/es/menu/",
      en: "https://lanuevadelicia.com/en/menu/",
      "x-default": "https://lanuevadelicia.com/es/menu/",
    });
    expect(m.openGraph).toMatchObject({ locale: "en_US", url: "https://lanuevadelicia.com/en/menu/" });
    expect(JSON.stringify(m.openGraph)).toContain("https://lanuevadelicia.com/og/home.jpg");
  });

  it("builds Restaurant JSON-LD from facts", () => {
    const r = restaurantJsonLd("es");
    expect(r["@type"]).toBe("Restaurant");
    expect(r).not.toHaveProperty("aggregateRating");
    expect(r).not.toHaveProperty("review");
    expect(r).not.toHaveProperty("geo");
    expect((r.address as { streetAddress: string }).streetAddress).toBe("93-16B 37th Ave");
    expect(r.telephone).toBe("+17186723456");
    expect(r.priceRange).toBe("$$");
    expect(r.servesCuisine).toBe("Colombian");
    expect(r.acceptsReservations).toBe(false);
    expect(r.hasMenu).toBe("https://lanuevadelicia.com/es/menu/");
    expect(r.openingHoursSpecification).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "21:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday", "Sunday"], opens: "09:00", closes: "22:00" },
    ]);
  });

  it("builds Menu JSON-LD with USD offers and no rating", () => {
    const s = JSON.stringify(menuJsonLd("es"));
    expect(s).toContain('"@type":"Menu"');
    expect(s).toContain('"@type":"MenuSection"');
    expect(s).toContain('"priceCurrency":"USD"');
    expect(s).not.toContain("aggregateRating");
  });

  it("sitemap lists 14 pages with es/en alternates", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(14);
    for (const e of entries) {
      expect(e.alternates?.languages).toHaveProperty("es");
      expect(e.alternates?.languages).toHaveProperty("en");
    }
  });
});
