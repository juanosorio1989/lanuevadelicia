import { test, expect } from "@playwright/test";
import { restaurant } from "../../src/data/restaurant";

test("menu: card opens the dish dialog with photo and order buttons; Escape closes and returns focus", async ({ page }) => {
  await page.goto("/es/menu/");
  const card = page.locator("[data-item='card']").first();
  const heading = (await card.locator("h3, h4").first().innerText()).trim();
  const link = card.locator("a[data-dish]");
  await card.click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cerrar" })).toBeFocused();
  await expect(dialog.locator("h2")).toContainText(heading.replace(/\s*Favorito$/, ""));
  await expect(dialog.locator("img").first()).toBeVisible();
  expect(await dialog.locator("img").first().getAttribute("alt")).toBeTruthy();
  for (const d of restaurant.delivery) {
    const a = dialog.getByRole("link", { name: d.label });
    await expect(a).toHaveAttribute("href", d.url);
    await expect(a).toHaveAttribute("target", "_blank");
  }
  await expect(dialog.locator("a[href^='tel:']")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(link).toBeFocused();
});

test("menu: backdrop click closes the dialog", async ({ page }) => {
  await page.goto("/es/menu/");
  await page.locator("[data-item='card']").first().click();
  await expect(page.locator("dialog[open]")).toBeVisible();
  await page.mouse.click(2, 2);
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});

test("home (en): Favorites card opens the dialog; close button closes it", async ({ page }) => {
  await page.goto("/en/");
  const card = page.locator("#favorites article").first();
  const name = (await card.locator("h3").innerText()).trim();
  await card.click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("h2")).toHaveText(name);
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});

test("menu: card links point to the photo with JS off", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4173/es/menu/");
  const href = await page.locator("[data-item='card'] a[data-dish]").first().getAttribute("href");
  expect(href).toMatch(/^\/images\/.+\.jpg$/);
  await ctx.close();
});

test("menu: ricuras dish dialog shows the category note", async ({ page }) => {
  await page.goto("/es/menu/");
  await page.waitForLoadState("networkidle");
  await page.locator("a[data-dish='entrana']").first().click();
  await expect(page.locator("dialog[open]")).toContainText("Todos vienen con arroz");
});
