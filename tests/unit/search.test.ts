import { describe, expect, it } from "vitest";
import { matchesSearch, normalizeSearch } from "@/lib/search";

describe("normalizeSearch", () => {
  it("drops accents, punctuation and case", () => {
    expect(normalizeSearch("Fríjoles, ¡Mañana!")).toBe("frijoles manana");
    expect(normalizeSearch("  JUGO   de  Maracuyá ")).toBe("jugo de maracuya");
  });
});

describe("matchesSearch", () => {
  it("requires every token, ignoring accents and order", () => {
    expect(matchesSearch("cazuela de frijoles con pezuna", "PEZUÑA frijol")).toBe(true);
    expect(matchesSearch("jugo de mora", "jugo mango")).toBe(false);
    expect(matchesSearch("bandeja paisa", "paisa bandeja")).toBe(true);
  });
  it("matches everything for a blank query", () => {
    expect(matchesSearch("anything", "   ")).toBe(true);
  });
});
