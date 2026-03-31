import { describe, expect, it } from "vitest";
import { CommaText } from "../src/comma-text";

describe("CommaText", () => {
  it("round-trips csv-like values with quotes", () => {
    const source = ["a", "b, c", 'd"e'];
    const csv = CommaText.from(source);
    const parsed = CommaText.to(csv);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.values).toEqual(source);
    }
  });

  it("returns error for unterminated quote", () => {
    const parsed = CommaText.to('"abc');
    expect(parsed.success).toBe(false);
  });
});
