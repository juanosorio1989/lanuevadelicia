import { describe, expect, it } from "vitest";
import { dayRange } from "@/lib/format";

describe("dayRange", () => {
  it("names a single day", () => {
    expect(dayRange([1], "es")).toBe("lunes");
    expect(dayRange([1], "en")).toBe("Monday");
  });
  it("joins a two-day range with y / and", () => {
    expect(dayRange([6, 7], "es")).toBe("sábado y domingo");
    expect(dayRange([6, 7], "en")).toBe("Saturday and Sunday");
  });
  it("joins longer ranges with a / to", () => {
    expect(dayRange([1, 2, 3, 4, 5], "es")).toBe("lunes a viernes");
    expect(dayRange([1, 2, 3, 4, 5], "en")).toBe("Monday to Friday");
    expect(dayRange([1, 2, 3], "en")).toBe("Monday to Wednesday");
  });
});
