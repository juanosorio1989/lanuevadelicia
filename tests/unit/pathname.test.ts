import { describe, expect, it } from "vitest";
import { localizedPathname } from "@/i18n/pathname";

describe("localizedPathname", () => {
  it("maps the root to the default locale home", () => expect(localizedPathname("/")).toBe("/es/"));
  it("maps an empty path to the default locale home", () => expect(localizedPathname("")).toBe("/es/"));
  it("keeps locale paths", () => {
    expect(localizedPathname("/es/")).toBe("/es/");
    expect(localizedPathname("/en/menu/")).toBe("/en/menu/");
    expect(localizedPathname("/es/menu")).toBe("/es/menu");
  });
});
