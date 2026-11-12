import { test, expect } from "@playwright/test";

const paths = ["", "menu/", "specials/", "our-story/", "gallery/", "visit/", "privacy/"];
const urls = ["es", "en"].flatMap((l) => paths.map((p) => `/${l}/${p}`));
const ORIGIN = "https://lanuevadelicia.com";

test("every page has unique title, description, canonical, hreflang and OG", async ({ page }) => {
  const titles = new Set<string>();
  for (const url of urls) {
    await page.goto(url);
    await expect(page.locator("head > title")).toHaveCount(1);
    const title = await page.title();
    expect(title.length, url).toBeGreaterThan(10);
    expect(titles.has(title), `duplicate title ${title}`).toBe(false);
    titles.add(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${ORIGIN}${url}`);
    await expect(page.locator("link[hreflang]")).toHaveCount(3);
    const locale = url.startsWith("/es/") ? "es_US" : "en_US";
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", locale);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  }
});

test("x-default points to the Spanish version of the same page", async ({ page }) => {
  await page.goto("/en/menu/");
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute("href", `${ORIGIN}/es/menu/`);
});

test("JSON-LD: Restaurant on home and visit, Menu on menu", async ({ page }) => {
  for (const [url, type] of [["/es/", "Restaurant"], ["/en/visit/", "Restaurant"], ["/es/menu/", "Menu"]]) {
    await page.goto(url);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks, url).toHaveLength(1);
    expect(JSON.parse(blocks[0])["@type"]).toBe(type);
    expect(blocks[0]).not.toContain("aggregateRating");
  }
});

test("robots.txt and sitemap.xml", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/User-Agent: \*/i);
  expect(robots).toMatch(/Allow: \//i);
  expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml.startsWith("<?xml")).toBe(true);
  expect(xml.match(/<url>/g)).toHaveLength(14);
  expect(xml).not.toContain("404");
});

test("404 is noindex", async ({ request }) => {
  const html = await (await request.get("/404.html")).text();
  expect(html).toMatch(/<meta name="robots" content="noindex/);
});
