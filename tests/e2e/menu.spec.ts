import { test, expect } from "@playwright/test";
import { categories, menuItems } from "../../src/data/menu";
import { matchesSearch, normalizeSearch } from "../../src/lib/search";
import { telHref } from "../../src/lib/links";

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

// The section box (not its heading, whose distance depends on section padding) sits 0.25rem under the stack.
async function expectSectionClearsStack(page: Pg, selector: string, stack: number) {
  const rootPx = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
  const secTop = (await page.locator(selector).boundingBox())!.y;
  expect(secTop).toBeGreaterThanOrEqual(stack - 1);
  expect(secTop).toBeLessThanOrEqual(stack + rootPx * 0.25 + 2);
}

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
    await expectSectionClearsStack(page, "#cocteles", s.stack);
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
    await expect(page.getByTestId("menu-chips-fade")).toBeVisible();
  });
  test("390px: static offset fallback clears the toolbar on a deep link", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/menu/#cocteles");
    await page.waitForTimeout(300);
    await expectSectionClearsStack(page, "#cocteles", (await sticky(page)).stack);
  });
});

test("malformed hash does not crash the page", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (e) => errors.push(e));
  await page.goto("/es/menu/#%E0");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("searchbox")).toBeVisible();
  expect(errors).toEqual([]);
});

test("390px: swipe hint does not come back after a deep link to the last category", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/es/menu/#${ordered[ordered.length - 1].id}`); // centering puts the row at its end
  await expect(page.getByRole("searchbox")).toBeVisible();
  const hint = page.getByTestId("menu-swipe-hint");
  await expect(hint).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await expect(hint).toBeHidden();
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

test.describe("search", () => {
  type Loc = "es" | "en";
  const expected = (locale: Loc, q: string) =>
    available.filter((i) =>
      matchesSearch(normalizeSearch(`${i.name[locale]} ${i.description?.[locale] ?? ""}`), q),
    ).length;
  const open = async (page: import("@playwright/test").Page, path = "/es/menu/") => {
    await page.goto(path);
    const box = page.getByRole("searchbox");
    await expect(box).toBeVisible();
    return box;
  };
  const visibleItems = (page: import("@playwright/test").Page) => page.locator("main li[data-item]:visible");

  test("filters by name, ignoring accents and case (es)", async ({ page }) => {
    const box = await open(page);
    await box.fill("FRIJOLES");
    const n = expected("es", "frijoles");
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(available.length);
    await expect(visibleItems(page)).toHaveCount(n);
    const visibleSections = await page.locator("main section[id]:visible").evaluateAll((els) => els.map((e) => e.id));
    const chips = page.getByTestId("menu-chips").getByRole("link");
    for (const c of ordered) {
      const chip = chips.filter({ hasText: c.name.es }).first();
      if (visibleSections.includes(c.id)) await expect(chip).toBeVisible();
      else await expect(chip).toBeHidden();
    }
    expect(visibleSections.length).toBeGreaterThan(0);
  });

  test("en matches English text", async ({ page }) => {
    const box = await open(page, "/en/menu/");
    await box.fill("beans");
    const n = expected("en", "beans");
    expect(n).toBeGreaterThan(0);
    await expect(visibleItems(page)).toHaveCount(n);
  });

  test("every word must match", async ({ page }) => {
    const box = await open(page);
    await box.fill("jugo mora");
    await expect(visibleItems(page)).toHaveCount(expected("es", "jugo mora"));
  });

  test("subcategory heading stays with its hit", async ({ page }) => {
    const multi = ordered.filter(
      (c) => new Set(available.filter((i) => i.category === c.id && i.subcategory).map((i) => i.subcategory!.es)).size >= 2,
    );
    const item = available.find((i) => i.subcategory && multi.some((c) => c.id === i.category))!;
    const box = await open(page);
    await box.fill(item.name.es);
    const section = page.locator(`#${item.category}`);
    await expect(section.getByRole("heading", { name: item.subcategory!.es, exact: true })).toBeVisible();
    const others = await section.locator("[data-search-group]").evaluateAll(
      (groups, title) => groups.filter((g) => g.querySelector("h3")?.textContent !== title).map((g) => !(g as HTMLElement).offsetParent),
      item.subcategory!.es,
    );
    expect(others.length).toBeGreaterThan(0);
    expect(others.every(Boolean)).toBe(true);
    const emptyLists = await page.locator("main [data-search-list]:visible").evaluateAll(
      (els) => els.filter((e) => !e.querySelector("li[data-item]:not([hidden])")).length,
    );
    expect(emptyLists).toBe(0);
  });

  test("no results offers the phone", async ({ page }) => {
    const box = await open(page);
    await box.fill("zzzz");
    const msg = page.getByTestId("menu-no-results");
    await expect(msg).toBeVisible();
    await expect(msg).toHaveText("No encontramos ese plato. Llámanos al (718) 672-3456.");
    await expect(msg.getByRole("link")).toHaveAttribute("href", telHref());
    await expect(page.locator("main section[id]:visible")).toHaveCount(0);
    await expect(page.getByRole("status")).toHaveText("No encontramos ese plato.");
  });

  test("clear and Escape restore the full menu; chips still work", async ({ page }) => {
    const box = await open(page);
    const chips = page.getByTestId("menu-chips").getByRole("link");
    const clear = page.getByRole("button", { name: "Borrar búsqueda" });
    await expect(clear).toBeHidden();
    await box.fill("pollo");
    await expect(visibleItems(page)).toHaveCount(expected("es", "pollo"));
    await clear.click();
    await expect(visibleItems(page)).toHaveCount(available.length);
    await expect(chips.locator("visible=true")).toHaveCount(13);
    await expect(clear).toBeHidden();
    await expect(box).toBeFocused();
    await box.fill("pollo");
    await box.press("Escape");
    await expect(visibleItems(page)).toHaveCount(available.length);
    await expect(chips.locator("visible=true")).toHaveCount(13);
    await expect(box).toBeFocused();
    await expect(box).toHaveValue("");
    await chips.filter({ hasText: "Postres" }).click();
    await expect(chips.filter({ hasText: "Postres" })).toHaveAttribute("aria-current", "true");
    await expect(page.locator("#postres")).toBeInViewport();
  });

  test.describe("390px", () => {
    test.use({ viewport: { width: 390, height: 844 } });
    test("hint and fade hide when few chips remain; fade returns after clearing", async ({ page }) => {
      const box = await open(page);
      const fade = page.getByTestId("menu-chips-fade");
      await expect(fade).not.toHaveClass(/opacity-0/);
      await box.fill("bandeja");
      await expect(page.getByTestId("menu-swipe-hint")).toBeHidden();
      await expect(fade).toHaveClass(/opacity-0/);
      await box.fill("");
      await expect(fade).not.toHaveClass(/opacity-0/);
      await expect(page.getByTestId("menu-swipe-hint")).toBeHidden();
    });
    test("typing deep in the page brings results into view", async ({ page }) => {
      const box = await open(page);
      await page.evaluate(() => window.scrollTo(0, 4000));
      await box.fill("bandeja");
      const first = visibleItems(page).first();
      await expect(first).toBeInViewport();
      await expect
        .poll(async () => {
          const bar = await page.getByTestId("menu-toolbar").evaluate((e) => e.getBoundingClientRect().bottom);
          const top = await first.evaluate((e) => e.getBoundingClientRect().top);
          return top >= bar - 1;
        })
        .toBe(true);
    });
  });

  test("searchbox name excludes the clear button", async ({ page }) => {
    const box = await open(page);
    await box.fill("bandeja");
    await expect(page.getByRole("button", { name: "Borrar búsqueda" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Buscar en el menú…", exact: true })).toBeVisible();
  });

  test("live region counts dishes", async ({ page }) => {
    const box = await open(page);
    await box.fill("bandeja");
    const n = expected("es", "bandeja");
    await expect(page.getByRole("status")).toHaveText(n === 1 ? "1 plato" : `${n} platos`);
  });

  test("sends one search event after a pause", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __ev: unknown[][]; gtag: (...a: unknown[]) => void };
      w.__ev = [];
      w.gtag = (...a) => w.__ev.push(a);
    });
    const box = await open(page);
    await box.pressSequentially("b");
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => (window as unknown as { __ev: unknown[][] }).__ev.filter((e) => e[1] === "search"))).toEqual([]);
    await box.pressSequentially("andeja");
    await page.waitForTimeout(1200);
    const events = await page.evaluate(() => (window as unknown as { __ev: unknown[][] }).__ev.filter((e) => e[1] === "search"));
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(["event", "search", expect.objectContaining({ search_term: "bandeja" })]);
  });
});
