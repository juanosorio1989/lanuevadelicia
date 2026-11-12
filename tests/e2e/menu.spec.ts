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

test("Review Focus 4: deep link heading clears the sticky header and chips", async ({ page }) => {
  await page.goto("/en/menu/#cocteles");
  await page.waitForTimeout(400);
  const stack = await page.evaluate(() => {
    const header = document.querySelector("header")!.getBoundingClientRect().bottom;
    const chips = document.querySelector("[data-testid=menu-chips]")!.getBoundingClientRect().bottom;
    return Math.max(header, chips);
  });
  const top = (await page.locator("#cocteles h2").boundingBox())!.y;
  expect(top).toBeGreaterThanOrEqual(stack);
});

test.describe("JS disabled", () => {
  test.use({ javaScriptEnabled: false });
  test("chip is a plain link that scrolls to its section", async ({ page }) => {
    await page.goto("/es/menu/");
    await page.getByTestId("menu-chips").getByRole("link", { name: "Postres" }).click();
    await expect(page).toHaveURL(/#postres$/);
    await expect(page.locator("#postres")).toBeInViewport();
  });
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
