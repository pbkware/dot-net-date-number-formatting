import { describe, expect, it } from "vitest";
import { DotNetDateTimeFormatter } from "../src/datetime-formatter";
import { FieldedTextLocaleSettings } from "../src/locale-settings";

describe("DotNetDateTimeFormatter", () => {
  it("sets and formats a custom pattern", () => {
    const formatter = new DotNetDateTimeFormatter();
    formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

    const setResult = formatter.trySetFormat("yyyy-MM-dd HH:mm:ss");
    expect(setResult.success).toBe(true);

    const value = new Date(2024, 6, 5, 14, 3, 9, 120);
    const formatted = formatter.toString(value);
    expect(formatted).toBe("2024-07-05 14:03:09");
  });

  it("parses a custom pattern back to Date components", () => {
    const formatter = new DotNetDateTimeFormatter();
    formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

    const setResult = formatter.trySetFormat("yyyy-MM-dd HH:mm:ss");
    expect(setResult.success).toBe(true);

    const parsed = formatter.tryFromString("2024-07-05 14:03:09");
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.value.getFullYear()).toBe(2024);
      expect(parsed.value.getMonth()).toBe(6);
      expect(parsed.value.getDate()).toBe(5);
      expect(parsed.value.getHours()).toBe(14);
      expect(parsed.value.getMinutes()).toBe(3);
      expect(parsed.value.getSeconds()).toBe(9);
    }
  });

  it("rejects invalid custom format text", () => {
    const formatter = new DotNetDateTimeFormatter();
    const result = formatter.trySetFormat("yyyyyyyy");

    expect(result.success).toBe(false);
  });
});
