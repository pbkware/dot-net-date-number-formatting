import { describe, expect, it } from "vitest";
import { DotNetNumberStyleId } from "../src/code/dotnet-number-style";
import { FieldedTextLocaleSettings } from "../src/code/locale-settings";
import {
  DotNetDoubleFormatter,
  DotNetIntegerFormatter,
} from "../src/code/number-formatter";

describe("DotNetIntegerFormatter", () => {
  it("parses hex with leading sign when style allows", () => {
    const formatter = new DotNetIntegerFormatter();
    formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
    formatter.styles = new Set([
      DotNetNumberStyleId.AllowHexSpecifier,
      DotNetNumberStyleId.AllowLeadingSign,
    ]);

    const result = formatter.tryFromString("-1A");
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(-26n);
    }
  });

  it("rejects leading sign when not allowed", () => {
    const formatter = new DotNetIntegerFormatter();
    formatter.styles = new Set();

    const result = formatter.tryFromString("-12");
    expect(result.isOk()).toBe(false);
    if (result.isErr()) {
      expect(result.error).toContain("leading sign");
    }
  });
});

describe("DotNetDoubleFormatter", () => {
  it("parses trailing sign when style allows", () => {
    const formatter = new DotNetDoubleFormatter();
    formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
    formatter.styles = new Set([
      DotNetNumberStyleId.AllowDecimalPoint,
      DotNetNumberStyleId.AllowTrailingSign,
      DotNetNumberStyleId.AllowLeadingSign,
      DotNetNumberStyleId.AllowExponent,
    ]);

    const result = formatter.tryFromString("12.5-");
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(-12.5);
    }
  });
});
