import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "@/lib/analytics";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("track", () => {
  it("does not throw without window.gtag", () => {
    vi.stubGlobal("window", {});
    expect(() => track("click_call", { location: "hero" })).not.toThrow();
  });

  it("does not throw without window at all", () => {
    expect(() => track("click_call", { location: "hero" })).not.toThrow();
  });

  it("adds the page locale to click_call", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    vi.stubGlobal("document", { documentElement: { lang: "es" } });
    track("click_call", { location: "hero" });
    expect(gtag).toHaveBeenCalledWith("event", "click_call", { locale: "es", location: "hero" });
  });

  it("keeps event params next to the locale", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    vi.stubGlobal("document", { documentElement: { lang: "en" } });
    track("load_map", { page: "visit" });
    expect(gtag).toHaveBeenCalledWith("event", "load_map", { locale: "en", page: "visit" });
  });

  it("still sends the event when document is unavailable", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    track("click_call", { location: "hero" });
    expect(gtag).toHaveBeenCalledWith("event", "click_call", { locale: "", location: "hero" });
  });

  it("swallows errors thrown by gtag", () => {
    vi.stubGlobal("window", {
      gtag: () => {
        throw new Error("boom");
      },
    });
    expect(() => track("click_call", { location: "hero" })).not.toThrow();
  });
});
