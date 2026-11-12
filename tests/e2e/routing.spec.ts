import { test, expect } from "@playwright/test";

test("/ ends at /es/", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/es\/$/);
});

const h1: Record<string, string> = {
  es: "El sabor de Colombia, cerca de ti.",
  en: "The authentic taste of Colombia, close to home.",
};

for (const locale of ["es", "en"]) {
  test(`/${locale}/ returns 200 and shows the H1`, async ({ page }) => {
    const res = await page.goto(`/${locale}/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(h1[locale]);
  });
}

for (const path of ["/es/nope/", "/fr/"]) {
  test(`${path} is a real 404`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(404);
    expect(await res.text()).toContain("Página no encontrada");
  });
}
