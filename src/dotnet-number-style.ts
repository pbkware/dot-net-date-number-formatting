import { CommaText } from "./comma-text";

export enum DotNetNumberStyleId {
  AllowCurrencySymbol = "AllowCurrencySymbol",
  AllowDecimalPoint = "AllowDecimalPoint",
  AllowExponent = "AllowExponent",
  AllowHexSpecifier = "AllowHexSpecifier",
  AllowLeadingSign = "AllowLeadingSign",
  AllowLeadingWhite = "AllowLeadingWhite",
  AllowParentheses = "AllowParentheses",
  AllowThousands = "AllowThousands",
  AllowTrailingSign = "AllowTrailingSign",
  AllowTrailingWhite = "AllowTrailingWhite",
}

export type DotNetNumberStyleSet = Set<DotNetNumberStyleId>;

export const DotNetNumberStyles = {
  none: new Set<DotNetNumberStyleId>(),
  any: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowCurrencySymbol,
    DotNetNumberStyleId.AllowDecimalPoint,
    DotNetNumberStyleId.AllowExponent,
    DotNetNumberStyleId.AllowLeadingSign,
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowParentheses,
    DotNetNumberStyleId.AllowThousands,
    DotNetNumberStyleId.AllowTrailingSign,
    DotNetNumberStyleId.AllowTrailingWhite,
  ]),
  currency: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowCurrencySymbol,
    DotNetNumberStyleId.AllowDecimalPoint,
    DotNetNumberStyleId.AllowLeadingSign,
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowParentheses,
    DotNetNumberStyleId.AllowThousands,
    DotNetNumberStyleId.AllowTrailingSign,
    DotNetNumberStyleId.AllowTrailingWhite,
  ]),
  float: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowTrailingWhite,
    DotNetNumberStyleId.AllowLeadingSign,
    DotNetNumberStyleId.AllowDecimalPoint,
    DotNetNumberStyleId.AllowExponent,
  ]),
  hexNumber: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowTrailingWhite,
    DotNetNumberStyleId.AllowHexSpecifier,
  ]),
  integer: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowTrailingWhite,
    DotNetNumberStyleId.AllowLeadingSign,
  ]),
  number: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowTrailingWhite,
    DotNetNumberStyleId.AllowLeadingSign,
    DotNetNumberStyleId.AllowTrailingSign,
    DotNetNumberStyleId.AllowDecimalPoint,
    DotNetNumberStyleId.AllowThousands,
  ]),
};

const isSameSet = (
  left: DotNetNumberStyleSet,
  right: DotNetNumberStyleSet,
): boolean => {
  if (left.size !== right.size) {
    return false;
  }
  for (const value of left) {
    if (!right.has(value)) {
      return false;
    }
  }
  return true;
};

export class DotNetNumberStylesInfo {
  static toString(styles: DotNetNumberStyleSet): string {
    return this.toXmlValue(styles);
  }

  static toXmlValue(styles: DotNetNumberStyleSet): string {
    if (isSameSet(styles, DotNetNumberStyles.any)) return "Any";
    if (isSameSet(styles, DotNetNumberStyles.currency)) return "Currency";
    if (isSameSet(styles, DotNetNumberStyles.float)) return "Float";
    if (isSameSet(styles, DotNetNumberStyles.hexNumber)) return "HexNumber";
    if (isSameSet(styles, DotNetNumberStyles.integer)) return "Integer";
    if (isSameSet(styles, DotNetNumberStyles.number)) return "Number";

    return CommaText.from(Array.from(styles.values()));
  }

  static tryFromString(
    value: string,
  ): { success: true; styles: DotNetNumberStyleSet } | { success: false } {
    return this.tryFromXmlValue(value);
  }

  static tryFromXmlValue(
    value: string,
  ): { success: true; styles: DotNetNumberStyleSet } | { success: false } {
    const normalized = value.trim();
    if (normalized.length === 0 || normalized.toLowerCase() === "none") {
      return { success: true, styles: new Set(DotNetNumberStyles.none) };
    }

    const canonical = normalized.toLowerCase();
    if (canonical === "any")
      return { success: true, styles: new Set(DotNetNumberStyles.any) };
    if (canonical === "currency")
      return { success: true, styles: new Set(DotNetNumberStyles.currency) };
    if (canonical === "float")
      return { success: true, styles: new Set(DotNetNumberStyles.float) };
    if (canonical === "hexnumber")
      return { success: true, styles: new Set(DotNetNumberStyles.hexNumber) };
    if (canonical === "integer")
      return { success: true, styles: new Set(DotNetNumberStyles.integer) };
    if (canonical === "number")
      return { success: true, styles: new Set(DotNetNumberStyles.number) };

    const split = CommaText.to(normalized);
    if (!split.success) {
      return { success: false };
    }

    const result = new Set<DotNetNumberStyleId>();
    for (const part of split.values) {
      const match = Object.values(DotNetNumberStyleId).find(
        (x) => x.toLowerCase() === part.toLowerCase(),
      );
      if (match === undefined) {
        return { success: false };
      }
      result.add(match);
    }

    return { success: true, styles: result };
  }

  static tryFromXmlValueWithDefault(
    value: string,
    defaultStyles: DotNetNumberStyleSet,
  ): { success: true; styles: DotNetNumberStyleSet } | { success: false } {
    if (value.trim().length === 0) {
      return { success: true, styles: new Set(defaultStyles) };
    }
    return this.tryFromXmlValue(value);
  }
}
