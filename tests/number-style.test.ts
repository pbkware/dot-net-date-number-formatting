import { describe, expect, it } from "vitest";
import {
  DotNetNumberStyleId,
  DotNetNumberStyles,
  DotNetNumberStylesInfo,
} from "../src/dotnet-number-style";

describe("DotNetNumberStylesInfo", () => {
  it("serializes known presets", () => {
    expect(DotNetNumberStylesInfo.toXmlValue(DotNetNumberStyles.any)).toBe(
      "Any",
    );
    expect(DotNetNumberStylesInfo.toXmlValue(DotNetNumberStyles.float)).toBe(
      "Float",
    );
  });

  it("parses known preset", () => {
    const parsed = DotNetNumberStylesInfo.tryFromXmlValue("Number");
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.styles.has(DotNetNumberStyleId.AllowThousands)).toBe(true);
      expect(parsed.styles.has(DotNetNumberStyleId.AllowDecimalPoint)).toBe(
        true,
      );
    }
  });

  it("parses comma separated custom styles", () => {
    const parsed = DotNetNumberStylesInfo.tryFromXmlValue(
      "AllowLeadingSign,AllowDecimalPoint",
    );
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.styles.size).toBe(2);
      expect(parsed.styles.has(DotNetNumberStyleId.AllowLeadingSign)).toBe(
        true,
      );
      expect(parsed.styles.has(DotNetNumberStyleId.AllowDecimalPoint)).toBe(
        true,
      );
    }
  });
});
