import { test, expect } from "@playwright/test";
import { directionsUrl, telHref } from "../../src/lib/links";
import { restaurant } from "../../src/data/restaurant";

const mobilePages: [string, "es" | "en"][] = [
  ["/es/", "es"],
  ["/es/menu/", "es"],
  ["/en/visit/", "en"],
];

test.describe("mobile 390x844", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const [path, locale] of mobilePages) {
    test(`bottom bar on ${path}`, async ({ page }) => {
      await page.goto(path);
      const bar = page.getByTestId("bottom-bar");
      await expect(bar).toBeVisible();
      await expect(page.getByTestId("bottom-bar-directions")).toHaveAttribute("href", directionsUrl());
      await expect(page.getByTestId("bottom-bar-call")).toHaveAttribute("href", telHref());
      await expect(page.getByTestId("bottom-bar-menu")).toHaveAttribute("href", `/${locale}/menu/`);
      const barHeight = (await bar.boundingBox())!.height;
      const padding = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom));
      expect(padding).toBeGreaterThanOrEqual(barHeight);
    });
  }

  test("header has no phone or directions link on mobile", async ({ page }) => {
    await page.goto("/es/");
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: "Cómo llegar" })).toBeHidden();
    await expect(header.getByRole("link", { name: restaurant.phone.display })).toBeHidden();
  });

  test("menu button opens the nav dialog; Escape closes it and returns focus", async ({ page }) => {
    await page.goto("/es/");
    const button = page.getByTestId("menu-button");
    await button.click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Especiales" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(button).toBeFocused();
  });

  test("clicking a link in the open dialog closes it", async ({ page }) => {
    await page.goto("/es/");
    await page.getByTestId("menu-button").click();
    await page.locator("dialog[open]").getByRole("link", { name: "Galería" }).click();
    await expect(page).toHaveURL(/\/es\/gallery\/$/);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });
});

test.describe("mobile without JS", () => {
  test.use({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });

  test("footer nav reaches every section as plain links", async ({ page }) => {
    await page.goto("/es/");
    await page.getByRole("contentinfo").getByRole("link", { name: "Especiales" }).click();
    await expect(page).toHaveURL(/\/es\/specials\/$/);
    for (const [name, path] of [["Nuestra historia", "our-story"], ["Galería", "gallery"], ["Visítanos", "visit"]]) {
      await expect(page.getByRole("contentinfo").getByRole("link", { name })).toHaveAttribute("href", `/es/${path}/`);
    }
  });
});

test.describe("desktop 1280x800", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("bottom bar hidden; header has phone and directions", async ({ page }) => {
    await page.goto("/es/");
    await expect(page.getByTestId("bottom-bar")).toBeHidden();
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: restaurant.phone.display })).toHaveAttribute("href", telHref());
    await expect(header.getByRole("link", { name: "Cómo llegar" })).toHaveAttribute("href", directionsUrl());
  });
});

test("language switch keeps the page", async ({ page }) => {
  await page.goto("/es/menu/");
  await page.getByTestId("lang-switch").getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en\/menu\/$/);
  await page.goto("/es/");
  await page.getByTestId("lang-switch").getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await page.goto("/en/gallery/");
  await page.getByTestId("lang-switch").getByRole("link", { name: "ES" }).click();
  await expect(page).toHaveURL(/\/es\/gallery\/$/);
});

test("footer shows the facts and the delivery apps", async ({ page }) => {
  await page.goto("/es/");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("93-16B 37th Ave");
  await expect(footer).toContainText("(718) 672-3456");
  await expect(footer).toContainText("@lanuevadeliciarestaurante");
  for (const d of restaurant.delivery) {
    const link = footer.getByRole("link", { name: d.label });
    await expect(link).toHaveAttribute("href", d.url);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});

test("the skip link is first and moves focus to #main", async ({ page }) => {
  await page.goto("/es/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});


test.describe("header logo and wrapping across widths", () => {
  for (const locale of ["es", "en"] as const) {
    for (const width of [320, 768, 1024, 1280]) {
      test(`${locale} ${width}px: logo keeps its width, header items do not wrap`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(`/${locale}/`);
        const header = page.getByRole("banner");
        const logo = header.locator("a").first().locator("img");
        await expect(logo).toBeVisible();
        expect((await logo.boundingBox())!.width).toBeGreaterThanOrEqual(40);
        if (width >= 1024) {
          const phone = header.getByRole("link", { name: restaurant.phone.display });
          await expect(phone).toBeVisible();
          // min-h-11 is 44px; a wrapped phone number would be at least two 20px lines plus padding.
          expect((await phone.boundingBox())!.height).toBeLessThanOrEqual(48);
        } else {
          await expect(page.getByTestId("menu-button")).toBeVisible();
          await expect(page.getByTestId("bottom-bar")).toBeVisible();
        }
      });
    }
  }
});
