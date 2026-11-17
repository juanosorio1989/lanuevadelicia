import { test, expect } from "@playwright/test";
import { mapsEmbedUrl, reviewsUrl, writeReviewUrl } from "../../src/lib/links";

const TUESDAY_NOON = new Date("2026-11-17T12:00:00-05:00");
const TUESDAY_LATE = new Date("2026-11-17T22:30:00-05:00");

test("H1 per locale", async ({ page }) => {
  await page.goto("/es/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("El sabor de Colombia, cerca de ti.");
  await page.goto("/en/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The authentic taste of Colombia, close to home.");
});

test("open status and today's special follow New York time (open)", async ({ page }) => {
  await page.clock.setFixedTime(TUESDAY_NOON);
  await page.goto("/es/");
  const status = page.getByTestId("open-status").first();
  await expect(status).toContainText("Abierto ahora");
  await expect(status).toContainText("9:00 p.m.");
  const today = page.getByTestId("today-special");
  await expect(today).toContainText("Ajiaco con arroz con pollo");
  await expect(today).toContainText("$13");
  await expect(today.getByRole("link")).toHaveAttribute("href", "/es/specials/");
});

test("open status reads closed late at night", async ({ page }) => {
  await page.clock.setFixedTime(TUESDAY_LATE);
  await page.goto("/es/");
  const status = page.getByTestId("open-status").first();
  await expect(status).toContainText("Cerrado");
  await expect(status).toContainText("9:00 a.m.");
});

test("favorites: 4 cards in featured order", async ({ page }) => {
  await page.goto("/es/");
  const cards = page.locator("#favorites li");
  await expect(cards).toHaveCount(4);
  await expect(cards.nth(0)).toContainText("Bandeja Paisa");
  await expect(cards.nth(1)).toContainText("Calentado");
  await expect(cards.nth(2)).toContainText("Arroz a la marinera");
  await expect(cards.nth(3)).toContainText("Picada doble");
  await expect(cards.nth(0)).toContainText("$23");
});

test("rating text and review links", async ({ page }) => {
  await page.goto("/es/");
  const band = page.getByTestId("reviews-band");
  await expect(band).toContainText("4.4");
  await expect(band).toContainText("450+");
  await expect(band.getByRole("link", { name: "Leer reseñas en Google" })).toHaveAttribute("href", reviewsUrl());
  await expect(band.getByRole("link", { name: "Dejar una reseña" })).toHaveAttribute("href", writeReviewUrl());
});

test("the map loads only after clicking", async ({ page }) => {
  await page.goto("/es/");
  const frame = page.locator('iframe[src*="google.com/maps"]');
  await expect(frame).toHaveCount(0);
  await page.getByRole("button", { name: "Ver mapa" }).click();
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute("src", mapsEmbedUrl());
  await expect(frame).toHaveAttribute("title", /.+/);
});

test("no placeholder in a production build", async ({ page }) => {
  await page.goto("/es/");
  await expect(page.locator("[data-placeholder]")).toHaveCount(0);
});

test("English home renders English copy", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("link", { name: "See the full menu" })).toHaveAttribute("href", "/en/menu/");
  await expect(page.getByTestId("reviews-band")).toContainText("on Google");
});

test.describe("JS disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("no status badge, no dish or price in the today block, links still work", async ({ page }) => {
    await page.goto("/es/");
    await expect(page.locator("main")).not.toContainText("Abierto");
    await expect(page.locator("main")).not.toContainText("Cerrado ·");
    await expect(page.getByTestId("open-status")).toHaveCount(0);
    const today = page.getByTestId("today-special");
    await expect(today).not.toContainText("$");
    await expect(today).not.toContainText("Ajiaco");
    await expect(today.getByRole("link")).toHaveAttribute("href", "/es/specials/");
    await expect(page.getByRole("link", { name: "Ver el menú completo" })).toHaveAttribute("href", "/es/menu/");
  });
});

test("home happy hour card shows its times, outside the hours table", async ({ page }) => {
  await page.goto("/es/");
  const card = page.getByTestId("happy-hour").first();
  await expect(card).toContainText("Happy hour");
  await expect(card).toContainText("cócteles a $8");
  await expect(card).toContainText("Lunes a viernes: 12:00 p.m. – 7:00 p.m.");
  await expect(card).toContainText("Sábado y domingo: 5:00 p.m. – 8:00 p.m.");
  await expect(page.locator("table").first()).not.toContainText("Happy hour");
});

test("320px: happy hour pill stays inside the card", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/es/");
  const card = page.getByTestId("happy-hour").first();
  await card.scrollIntoViewIfNeeded();
  const c = (await card.boundingBox())!;
  const p = (await card.locator("span.rounded-full").boundingBox())!;
  expect(p.x + p.width).toBeLessThanOrEqual(c.x + c.width);
});

test("home visit block has the phone-order block", async ({ page }) => {
  const cases = [
    { path: "/es/", title: "Pide por teléfono", range: "hasta 1 milla sin recargo", old: "¿Prefieres a domicilio?" },
    { path: "/en/", title: "Order by phone", range: "up to 1 mile at no extra charge", old: "Prefer delivery?" },
  ];
  for (const c of cases) {
    await page.goto(c.path);
    const order = page.getByTestId("phone-order");
    await expect(order).toBeVisible();
    await expect(order).toContainText(c.title);
    await expect(order).toContainText(c.range);
    for (const app of ["Uber Eats", "DoorDash", "Grubhub"]) {
      await expect(order.getByRole("link", { name: app })).toBeVisible();
    }
    await expect(order).not.toContainText(c.old);
  }
});

test("390px: happy hour card is separated from the directions button", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/es/");
  await expect(page.locator("main")).not.toContainText("Cerrado el");
  const card = page.getByTestId("happy-hour").first();
  const link = card.locator("xpath=following::a[normalize-space()='Cómo llegar'][1]");
  await link.scrollIntoViewIfNeeded();
  const n = (await card.boundingBox())!;
  const l = (await link.boundingBox())!;
  expect(l.y - (n.y + n.height)).toBeGreaterThanOrEqual(8);
});
