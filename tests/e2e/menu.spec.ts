import { test, expect } from "@playwright/test";
import { categories, menuItems } from "../../src/data/menu";

const ordered = [...categories].sort((a, b) => a.order - b.order);
const available = menuItems.filter((i) => i.available !== false);

test("13 chips in spec order and 13 matching sections", async ({ page }) => {
  await page.goto("/es/menu/");
  const chips = page.getByTestId("menu-chips").getByRole("link");
  await expect(chips).toHaveCount(13);
  for (const [i, c] of ordered.entries()) {
    await expect(chips.nth(i)).toHaveAttribute("href", `#${c.id}`);
    await expect(chips.nth(i)).toHaveText(c.name.es);
  }
  const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(ordered.map((c) => c.id));
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

test("every available item appears once; photo cards come before rows", async ({ page }) => {
  await page.goto("/es/menu/");
  await expect(page.locator("main [data-item]")).toHaveCount(available.length);
  const withImage = available.filter((i) => i.image).length;
  await expect(page.locator("main [data-item='card']")).toHaveCount(withImage);
  // Within each group (a category, or a subcategory) the card list comes before the row list.
  const bad = await page.locator("main section").evaluateAll((secs) =>
    secs.flatMap((sec) =>
      [...sec.querySelectorAll("ul")]
        .filter((ul) => ul.querySelector("[data-item]"))
        .map((ul) => ({ ul, kind: ul.querySelector("[data-item]")!.getAttribute("data-item") }))
        .filter(({ ul, kind }) => kind === "card" && ul.previousElementSibling?.querySelector?.("[data-item='row']"))
        .map(() => sec.id),
    ),
  );
  expect(bad).toEqual([]);
});

test("option prices render for juices", async ({ page }) => {
  await page.goto("/es/menu/");
  const juices = page.locator("#bebidas [data-item]", { hasText: "Jugos naturales" }).first();
  await expect(juices).toContainText("$7");
  await expect(juices).toContainText("$6");
  await expect(juices).toContainText("En leche");
});

test("unpriced options carry no flavor label", async ({ page }) => {
  await page.goto("/es/menu/");
  const chuleta = page.locator("main [data-item]", { hasText: "Chuleta de cerdo a la parrilla o empanizada" }).first();
  await expect(chuleta).toContainText("A la parrilla");
  await expect(chuleta).not.toContainText("Sabores");
});

test("featured items carry the Favorito tag", async ({ page }) => {
  await page.goto("/es/menu/");
  await expect(page.locator("main [data-featured]")).toHaveCount(menuItems.filter((i) => i.featured).length);
  await expect(page.locator("main [data-featured]").first()).toContainText("Favorito");
  await page.goto("/en/menu/");
  await expect(page.locator("main [data-featured]").first()).toContainText("Favorite");
});

test("price note per locale", async ({ page }) => {
  await page.goto("/es/menu/");
  await expect(page.getByText("Precios en el restaurante")).toBeVisible();
  await page.goto("/en/menu/");
  await expect(page.getByText("In-restaurant prices")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Our menu");
});

type Pg = import("@playwright/test").Page;
const sticky = (page: Pg) =>
  page.evaluate(() => {
    const header = document.querySelector("header")!.getBoundingClientRect().bottom;
    const chips = document.querySelector("[data-testid=menu-chips]")!.getBoundingClientRect();
    const toolbar = document.querySelector("[data-testid=menu-toolbar]")!.getBoundingClientRect();
    return { header, chipsTop: chips.top, stack: Math.max(header, toolbar.bottom) };
  });

const setups: [string, (page: Pg) => Promise<void>, ((page: Pg) => Promise<void>)?][] = [
  ["desktop", async () => {}],
  ["320x640", async (page) => page.setViewportSize({ width: 320, height: 640 })],
  ["20px root font", async (page) => {
    await page.addInitScript(() => document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.fontSize = "20px"; }));
  }],
  [
    "390px after swiping chips",
    async (page) => page.setViewportSize({ width: 390, height: 844 }),
    async (page) => {
      await expect(page.getByRole("searchbox")).toBeVisible(); // hydrated: the scroll listener is attached
      await page.getByTestId("menu-chips").evaluate((n) => { n.scrollLeft = 150; });
      await expect(page.getByTestId("menu-swipe-hint")).toBeHidden();
      await page.getByTestId("menu-chips").getByRole("link", { name: "Cocktails" }).click();
    },
  ],
];
for (const [name, setup, after] of setups) {
  test(`Review Focus 4: deep link heading clears the sticky header and chips (${name})`, async ({ page }) => {
    await setup(page);
    if (after) {
      await page.goto("/en/menu/");
      await after(page);
    } else {
      await page.goto("/en/menu/#cocteles");
    }
    await page.waitForTimeout(500);
    const s = await sticky(page);
    expect(s.chipsTop).toBeGreaterThanOrEqual(s.header - 1);
    const top = (await page.locator("#cocteles h2").boundingBox())!.y;
    expect(top).toBeGreaterThanOrEqual(s.stack);
    // Upper bound: air (0.25rem) + the section's own top padding (up to 1.75rem); catches an offset that is too big.
    expect(top).toBeLessThan(s.stack + 40);
  });
}

test.describe("JS disabled", () => {
  test.use({ javaScriptEnabled: false });
  test("chip is a plain link that scrolls to its section", async ({ page }) => {
    await page.goto("/es/menu/");
    await page.getByTestId("menu-chips").getByRole("link", { name: "Postres" }).click();
    await expect(page).toHaveURL(/#postres$/);
    await expect(page.locator("#postres")).toBeInViewport();
  });
  test("390px: no search box, hint visible, 13 chip links", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es/menu/");
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await expect(page.getByTestId("menu-swipe-hint")).toBeVisible();
    await expect(page.getByTestId("menu-chips").getByRole("link")).toHaveCount(13);
  });
});

test.describe("390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("search box and swipe hint; hint styled like the category note; hides after swiping", async ({ page }) => {
    await page.goto("/es/menu/");
    const toolbar = page.getByTestId("menu-toolbar");
    await expect(toolbar.getByRole("searchbox", { name: "Buscar en el menú…" })).toBeVisible();
    const hint = page.getByTestId("menu-swipe-hint");
    await expect(hint).toHaveText("Desliza para ver más categorías →");
    const style = (sel: string) =>
      page.locator(sel).first().evaluate((e) => {
        const s = getComputedStyle(e);
        return [s.color, s.fontWeight, s.fontSize];
      });
    expect(await style("[data-testid=menu-swipe-hint]")).toEqual(await style("#desayunos h2 + p"));
    await page.getByTestId("menu-chips").evaluate((n) => { n.scrollLeft = 150; });
    await expect(hint).toBeHidden();
  });
  test("toolbar stays under the header after scrolling", async ({ page }) => {
    await page.goto("/es/menu/");
    await page.mouse.wheel(0, 2000);
    await expect(page.getByRole("searchbox")).toBeInViewport();
    // The header shrinks with a transition; wait until the toolbar sits right under it.
    await expect
      .poll(async () => {
        const s = await sticky(page);
        const top = await page.getByTestId("menu-toolbar").evaluate((e) => e.getBoundingClientRect().top);
        return Math.abs(top - s.header);
      })
      .toBeLessThanOrEqual(1);
  });
});
test("en: search box label", async ({ page }) => {
  await page.goto("/en/menu/");
  await expect(page.getByRole("searchbox", { name: "Search the menu…" })).toBeVisible();
});
test("desktop: no swipe hint", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/es/menu/");
  await expect(page.getByTestId("menu-swipe-hint")).toBeHidden();
});

test("JS on: chip for the section in view gets aria-current", async ({ page }) => {
  await page.goto("/es/menu/#mariscos");
  const chip = page.getByTestId("menu-chips").getByRole("link", { name: "Pescados y mariscos" });
  await expect(chip).toHaveAttribute("aria-current", "true");
});

test("no horizontal page scroll at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/es/menu/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
