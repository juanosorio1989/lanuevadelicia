import { describe, expect, it } from "vitest";
import { dayRange, formatClosedDates, formatMonthDay } from "@/lib/format";

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

describe("formatMonthDay", () => {
  it("formats es and en from fixed month names", () => {
    expect(formatMonthDay({ month: 1, day: 1 }, "es")).toBe("1 de enero");
    expect(formatMonthDay({ month: 1, day: 1 }, "en")).toBe("January 1");
    expect(formatMonthDay({ month: 12, day: 25 }, "es")).toBe("25 de diciembre");
    expect(formatMonthDay({ month: 12, day: 25 }, "en")).toBe("December 25");
  });
});

describe("formatClosedDates", () => {
  const dates = [{ month: 1, day: 1 }, { month: 12, day: 25 }];
  it("joins with the locale's pair word", () => {
    expect(formatClosedDates(dates.slice(0, 1), "es")).toBe("1 de enero");
    expect(formatClosedDates(dates, "es")).toBe("1 de enero y 25 de diciembre");
    expect(formatClosedDates(dates, "en")).toBe("January 1 and December 25");
  });
});
