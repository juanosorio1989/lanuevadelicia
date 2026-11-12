import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("design tokens", () => {
  it.each(["#A2471F", "#253D30", "#F4EBDD", "#E8DCC8", "#C85E36", "#252722", "#555555", "#E9B44C"])(
    "globals.css defines %s",
    (hex) => {
      expect(css.toUpperCase()).toContain(hex);
    },
  );

  it("keeps AA contrast for the text pairs", () => {
    expect(contrast("#FFFFFF", "#A2471F")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#A2471F", "#F4EBDD")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#252722", "#F4EBDD")).toBeGreaterThanOrEqual(4.5);
  });
});
