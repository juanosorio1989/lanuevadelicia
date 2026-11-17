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
    await page.locator("dialog[open]").getByRole("link", { name: "Visítanos" }).click();
    await expect(page).toHaveURL(/\/es\/visit\/$/);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });
});

test.describe("mobile without JS", () => {
  test.use({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });

  test("footer nav reaches every section as plain links", async ({ page }) => {
    await page.goto("/es/");
    await page.getByRole("contentinfo").getByRole("link", { name: "Especiales" }).click();
    await expect(page).toHaveURL(/\/es\/specials\/$/);
    for (const [name, path] of [["Nuestra historia", "our-story"], ["Visítanos", "visit"]]) {
      await expect(page.getByRole("contentinfo").getByRole("link", { name })).toHaveAttribute("href", `/es/${path}/`);
    }
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Galería" })).toHaveCount(0);
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
  await expect(footer).not.toContainText("Cerrado el");
  await expect(footer).toContainText("@lanuevadeliciarestaurante");
  for (const d of restaurant.delivery) {
    const link = footer.getByRole("link", { name: d.label });
    await expect(link).toHaveAttribute("href", d.url);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});

test("footer has no closed-date note in English", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("contentinfo")).not.toContainText("Closed on");
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

for (const [width, height, expected] of [[390, 844, 64], [1280, 800, 80]] as const) {
  test(`logo is ${expected}px at ${width}px wide, 40px after scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/es/");
    const header = page.getByRole("banner");
    const logo = header.locator("a").first().locator("img");
    await expect(logo).toBeVisible();
    await expect.poll(async () => Math.round((await logo.boundingBox())!.height)).toBe(expected);
    await page.mouse.wheel(0, 800);
    await expect(header).toHaveAttribute("data-scrolled", "");
    await expect.poll(async () => Math.round((await logo.boundingBox())!.height)).toBe(40);
  });
}

test.describe("header scroll state does not flicker", () => {
  for (const [width, height] of [[390, 844], [1280, 800]] as const) {
    for (const delta of [30, 60]) {
      test(`${width}px, wheel ${delta}px on /es/menu/: data-scrolled changes at most once`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto("/es/menu/");
        await page.evaluate(() => {
          const header = document.querySelector("header")!;
          (window as unknown as { __toggles: number }).__toggles = 0;
          new MutationObserver((records) => {
            for (const r of records) if (r.attributeName === "data-scrolled") (window as unknown as { __toggles: number }).__toggles++;
          }).observe(header, { attributes: true });
        });
        await page.mouse.move(200, 400);
        await page.mouse.wheel(0, delta);
        await page.waitForTimeout(1000);
        const toggles = await page.evaluate(() => (window as unknown as { __toggles: number }).__toggles);
        expect(toggles).toBeLessThanOrEqual(1);
      });
    }
  }
});

test.describe("footer at tablet width", () => {
  for (const [locale, label] of [["es", "Pide a domicilio"], ["en", "Order delivery"]] as const) {
    test(`${locale} 768px: Instagram handle does not overlap the delivery column`, async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 800 });
      await page.goto(`/${locale}/`);
      const footer = page.getByRole("contentinfo");
      const handle = await footer.getByRole("link", { name: restaurant.instagram.handle }).boundingBox();
      const delivery = await footer.getByText(label, { exact: true }).locator("..").boundingBox();
      expect(handle).not.toBeNull();
      expect(delivery).not.toBeNull();
      const overlaps =
        handle!.x < delivery!.x + delivery!.width &&
        delivery!.x < handle!.x + handle!.width &&
        handle!.y < delivery!.y + delivery!.height &&
        delivery!.y < handle!.y + handle!.height;
      expect(overlaps).toBe(false);
      const noScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      expect(noScroll).toBe(true);
    });
  }
});

test("gallery is hidden from navigation in both languages", async ({ page }) => {
  for (const locale of ["es", "en"]) {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/${locale}/`);
      if (width === 390) {
        await page.getByTestId("menu-button").click();
        await expect(page.locator("dialog[open]")).toBeVisible();
      }
      await expect(page.locator('a[href*="/gallery/"]')).toHaveCount(0);
    }
  }
});
