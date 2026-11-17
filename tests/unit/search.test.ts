import { describe, expect, it } from "vitest";
import { isTrackableSearchTerm, matchesSearch, normalizeSearch } from "@/lib/search";

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

describe("isTrackableSearchTerm", () => {
  it("accepts dish searches", () => {
    expect(isTrackableSearchTerm("bandeja")).toBe(true);
    expect(isTrackableSearchTerm("jugo de mora")).toBe(true);
    expect(isTrackableSearchTerm("combo 2")).toBe(true);
  });
  it("rejects emails and phone numbers", () => {
    expect(isTrackableSearchTerm("a@b.co")).toBe(false);
    expect(isTrackableSearchTerm("7186723456")).toBe(false);
    expect(isTrackableSearchTerm("718 672 3456")).toBe(false);
    expect(isTrackableSearchTerm("12345")).toBe(false);
  });
});
