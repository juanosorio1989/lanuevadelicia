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

  it("calls gtag with the event and params", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    track("click_call", { location: "hero" });
    expect(gtag).toHaveBeenCalledWith("event", "click_call", { location: "hero" });
  });

  it("swallows errors thrown by gtag", () => {
    vi.stubGlobal("window", {
      gtag: () => {
        throw new Error("boom");
      },
    });
    expect(() => track("click_call", {})).not.toThrow();
  });
});
