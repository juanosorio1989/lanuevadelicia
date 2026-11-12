import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

const PAGES = ["", "menu", "specials", "our-story", "gallery", "visit", "privacy"];
const URLS = ["es", "en"].flatMap((l) => PAGES.map((p) => `/${l}/${p ? `${p}/` : ""}`));

test("the site has 14 URLs", () => {
  expect(URLS).toHaveLength(14);
});

for (const url of URLS) {
  test.describe(url, () => {
    test("axe: no serious or critical violations", async ({ page }) => {
      await page.goto(url);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const bad = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });

    test("no console errors, no CSP violations, no analytics request", async ({ page }) => {
      const problems: string[] = [];
      const gaRequests: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") problems.push(`console: ${m.text()}`);
      });
      page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
      page.on("request", (r) => {
        if (/googletagmanager\.com|google-analytics\.com/.test(r.url())) gaRequests.push(r.url());
      });
      await page.addInitScript(() => {
        document.addEventListener("securitypolicyviolation", (e) => {
          console.error(`CSP violation: ${e.violatedDirective} ${e.blockedURI}`);
        });
      });
      const res = await page.goto(url);
      expect(res?.headers()["content-security-policy"]).toContain("default-src 'self'");
      await page.waitForLoadState("networkidle");
      expect(problems).toEqual([]);
      // Without NEXT_PUBLIC_GA_ID the loader must not exist (npm run check:ga covers the build with the id).
      expect(gaRequests).toEqual([]);
    });

    test("one h1 and every image has alt text", async ({ page }) => {
      await page.goto(url);
      await expect(page.locator("h1")).toHaveCount(1);
      const missing = await page.locator("img").evaluateAll((imgs) =>
        imgs.filter((i) => !(i.getAttribute("alt") ?? "").trim()).map((i) => i.getAttribute("src")),
      );
      expect(missing).toEqual([]);
    });

    test("Review Focus 2: no horizontal scroll at 320x640", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });
  });
}

test("Review Focus 5: unknown URLs are a real 404 with the bilingual page", async ({ request }) => {
  for (const path of ["/menu/", "/fr/", "/es/nope/"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(404);
    const body = await res.text();
    expect(body, path).toContain("Página no encontrada");
    expect(body, path).toContain("Page not found");
  }
});

test.describe("visitor in another timezone (Asia/Tokyo)", () => {
  test.use({ timezoneId: "Asia/Tokyo" });

  // Tuesday noon in New York is already Wednesday 02:00 in Tokyo.
  test("home open status and today's special use America/New_York", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-17T12:00:00-05:00"));
    await page.goto("/es/");
    await expect(page.getByTestId("open-status").first()).toContainText("Abierto ahora");
    const today = page.getByTestId("today-special");
    await expect(today).toContainText("Ajiaco con arroz con pollo");
    await expect(today).not.toContainText("lentejas");
  });

  test("specials page marks New York's today", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-17T12:00:00-05:00"));
    await page.goto("/es/specials/");
    await expect(page.locator("#day-2")).toHaveAttribute("aria-current", "date");
    await expect(page.locator("[aria-current='date']")).toHaveCount(1);
  });
});

for (const [name, size] of [
  ["desktop", { width: 1280, height: 720 }],
  ["320x640", { width: 320, height: 640 }],
] as const) {
  test(`specials deep link #day-5 is not hidden under the sticky header (${name})`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/es/specials/#day-5");
    const measure = () =>
      page.evaluate(() => ({
        header: document.querySelector("header")!.getBoundingClientRect().bottom,
        top: document.querySelector("#day-5 h2, #day-5 h3")!.getBoundingClientRect().top,
      }));
    // Wait for the hash scroll to settle, then check the heading is below the sticky header.
    await expect.poll(async () => {
      const { header, top } = await measure();
      return top >= header;
    }).toBe(true);
  });
}
