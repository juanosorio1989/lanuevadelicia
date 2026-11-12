import { test, expect } from "@playwright/test";

const FRIDAY_NOON = new Date("2026-11-20T12:00:00-05:00");

const MAINS = [
  "Sopa de cebada con pollo al horno",
  "Ajiaco con arroz con pollo",
  "Sopa de lentejas con carne molida",
  "Mondongo con chuleta de cerdo",
  "Cazuela de mariscos con patacones y arroz",
  "Sancocho de gallina con gallina guisada",
  "Cazuela de fríjoles con pezuña, acompañada con chicharrón",
];
const PRICES = ["$13", "$13", "$13", "$13", "$15", "$15", "$15"];

test("7 day sections, Monday first, flyer and main dish text", async ({
  page,
}) => {
  await page.goto("/es/specials/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  for (let d = 1; d <= 7; d++) {
    const day = page.locator(`#day-${d}`);
    await expect(day).toHaveCount(1);
    await expect(day).toContainText(MAINS[d - 1]);
    await expect(day).toContainText(PRICES[d - 1]);
    const img = day.locator("img");
    await expect(img).toHaveCount(1);
    expect(await img.getAttribute("alt")).toContain(MAINS[d - 1].split(" ")[0]);
  }
  const ids = await page
    .locator("section[id^='day-']")
    .evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual([
    "day-1",
    "day-2",
    "day-3",
    "day-4",
    "day-5",
    "day-6",
    "day-7",
  ]);
});

test("Thursday shows both dishes, alternative has no price but the note", async ({
  page,
}) => {
  await page.goto("/es/specials/");
  const thu = page.locator("#day-4");
  await expect(thu).toContainText("Mondongo con chuleta de cerdo");
  await expect(thu).toContainText("Sancocho de pescado con mojarra frita");
  await expect(thu).toContainText(
    "el precio puede cambiar según la elección de la carne",
  );
  await expect(thu.getByTestId("alt-dish")).not.toContainText("$");
  await expect(page.locator("#day-1")).not.toContainText(
    "el precio puede cambiar",
  );
});

test("extra large soup price is shown", async ({ page }) => {
  await page.goto("/es/specials/");
  await expect(page.getByText("Sopa grande adicional")).toBeVisible();
  await expect(page.getByTestId("extra-soup")).toContainText("$6");
});

test("English page", async ({ page }) => {
  await page.goto("/en/specials/");
  await expect(page.locator("#day-1")).toContainText(
    "Barley soup with oven-baked chicken",
  );
  await expect(page.locator("#day-4")).toContainText(
    "Fish sancocho with fried tilapia",
  );
});

test("today is highlighted in New York time (Friday)", async ({ page }) => {
  await page.clock.setFixedTime(FRIDAY_NOON);
  await page.goto("/es/specials/");
  const fri = page.locator("#day-5");
  await expect(fri).toHaveAttribute("aria-current", "date");
  await expect(fri.getByText("Hoy", { exact: true })).toBeVisible();
  await expect(page.locator("[aria-current='date']")).toHaveCount(1);
});

test.describe("no JS", () => {
  test.use({ javaScriptEnabled: false });
  test("no day is marked as today", async ({ page }) => {
    await page.goto("/es/specials/");
    await expect(page.locator("#day-1")).toBeVisible();
    await expect(page.locator("section[id^='day-'][aria-current]")).toHaveCount(0);
  });
});
