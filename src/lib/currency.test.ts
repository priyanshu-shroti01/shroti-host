import { describe, expect, it } from "vitest";
import { convertFromInr, formatPrice } from "./currency";

describe("convertFromInr", () => {
  it("leaves INR untouched", () => {
    expect(convertFromInr(1169, "INR")).toBe(1169);
  });

  it("keeps two decimals below 100 so cheap plans never show as $0", () => {
    expect(convertFromInr(39, "USD")).toBe(0.47);
    expect(convertFromInr(39, "EUR")).toBe(0.43);
  });

  it("rounds to whole units at or above 100", () => {
    expect(convertFromInr(9000, "USD")).toBe(108);
    expect(Number.isInteger(convertFromInr(12000, "EUR"))).toBe(true);
  });
});

describe("formatPrice", () => {
  it("formats INR with the rupee symbol and grouping", () => {
    expect(formatPrice(1169, "INR")).toBe("₹1,169");
  });

  it("formats small foreign amounts with cents", () => {
    expect(formatPrice(39, "USD")).toBe("$0.47");
  });

  it("drops cents on whole foreign amounts", () => {
    expect(formatPrice(9000, "USD")).toBe("$108");
  });
});
