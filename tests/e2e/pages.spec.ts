import { test, expect } from "@playwright/test";
import es from "../../messages/es.json";

const STORY_ES =
  "La Nueva Delicia lleva más de tres décadas sirviendo comida colombiana en el corazón de Queens. Nuestras raíces están en Caldas, en el Eje Cafetero, y se sienten en cada plato: recetas caseras, ingredientes frescos y todo preparado en su punto. Nuestro equipo atiende con cariño, porque lo que más nos importa es que cada persona que entra se sienta como en casa.";

test("our story (es): approved text, expectations, CTAs, no owner or nationality wording", async ({ page }) => {
  await page.goto("/es/our-story/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(es.home.story.title);
  const text = await page.locator("main").innerText();
  expect(text.replace(/\s+/g, " ")).toContain(STORY_ES);
  expect(text).toContain("Más de 30 años de sabor colombiano en Jackson Heights.");
  for (const item of ["Comida casera", "Ingredientes frescos", "Atención cálida"]) {
    expect(text).toContain(item);
  }
  expect(text).not.toMatch(/colombian(o|a)s? (team|equipo)|equipo colombiano|dueñ/i);
  await expect(page.locator("main").getByRole("link", { name: "Cómo llegar" })).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: "Ver menú" })).toHaveAttribute("href", "/es/menu/");
});

test("gallery: groups, dialog opens with alt text, Escape closes and focus returns", async ({ page }) => {
  await page.goto("/es/gallery/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Comida" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bebidas" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "El restaurante" })).toHaveCount(0);
  const thumb = page.locator("main ul a").first();
  await thumb.waitFor();
  const alt = await thumb.locator("img").getAttribute("alt");
  expect(alt).toBeTruthy();
  await thumb.click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toHaveAttribute("alt", alt!);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(thumb).toBeFocused();
});

test("gallery thumbnails are plain links to the image with JS off", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4173/es/gallery/");
  const href = await page.locator("main ul a").first().getAttribute("href");
  expect(href).toMatch(/^\/images\/.+\.jpg$/);
  await ctx.close();
});

test("visit (es): address, hours, breakfast, happy hour, delivery, events, note, no transit", async ({ page }) => {
  await page.goto("/es/visit/");
  await expect(page.locator("h1")).toHaveCount(1);
  const main = page.locator("main");
  await expect(main).toContainText("93-16B 37th Ave, Jackson Heights, NY 11372");
  const table = main.locator("table");
  await expect(table).toContainText("9:00 a.m. – 9:00 p.m.");
  await expect(table).toContainText("9:00 a.m. – 10:00 p.m.");
  await expect(table).toContainText("Desayunos");
  await expect(table).toContainText("Happy hour");
  for (const app of ["Uber Eats", "DoorDash", "Grubhub"]) {
    const link = main.getByRole("link", { name: app });
    await expect(link).toBeVisible();
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(main).toContainText("¿Evento o grupo grande? Llámanos.");
  await expect(main).toContainText("El domicilio a más de una milla tiene un cargo extra.");
  expect(await main.innerText()).not.toMatch(/metro|subway|bus\b|tren|train|\b7\b line/i);
  await expect(main.getByRole("button", { name: "Ver mapa" })).toBeVisible();
});

for (const [locale, title] of [["es", "Privacidad"], ["en", "Privacy"]] as const) {
  test(`privacy (${locale}) mentions Google Analytics and the contact email`, async ({ page }) => {
    await page.goto(`/${locale}/privacy/`);
    await expect(page.locator("h1")).toHaveText(title);
    const text = await page.locator("main").innerText();
    expect(text).toContain("Google Analytics");
    expect(text).toContain("info@lanuevadelicia.com");
  });
}

test("404 is styled, bilingual and its 4 links point to menu and visit", async ({ request, page }) => {
  const res = await request.get("/es/nope/");
  expect(res.status()).toBe(404);
  await page.goto("/404.html");
  await expect(page.getByRole("heading", { name: "Página no encontrada" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  for (const href of ["/es/menu/", "/es/visit/", "/en/menu/", "/en/visit/"]) {
    await expect(page.locator(`main a[href="${href}"]`)).toBeVisible();
  }
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).not.toBe("rgba(0, 0, 0, 0)");
  expect(bg).not.toBe("rgb(255, 255, 255)");
});
