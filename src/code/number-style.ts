import { CommaText, Err, Ok, Result } from "@pbkware/js-utils";

/** @public */
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

/** @public */
export type DotNetNumberStyleSet = Set<DotNetNumberStyleId>;

/** @internal */
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

/** @internal */
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

    return CommaText.fromStringArray(Array.from(styles.values()));
  }

  static tryFromString(value: string): Result<DotNetNumberStyleSet> {
    return this.tryFromXmlValue(value);
  }

  static tryFromXmlValue(value: string): Result<DotNetNumberStyleSet> {
    const normalized = value.trim();
    if (normalized.length === 0 || normalized.toLowerCase() === "none") {
      return new Ok(new Set(DotNetNumberStyles.none));
    }

    const canonical = normalized.toLowerCase();
    if (canonical === "any") return new Ok(new Set(DotNetNumberStyles.any));
    if (canonical === "currency")
      return new Ok(new Set(DotNetNumberStyles.currency));
    if (canonical === "float") return new Ok(new Set(DotNetNumberStyles.float));
    if (canonical === "hexnumber")
      return new Ok(new Set(DotNetNumberStyles.hexNumber));
    if (canonical === "integer")
      return new Ok(new Set(DotNetNumberStyles.integer));
    if (canonical === "number")
      return new Ok(new Set(DotNetNumberStyles.number));

    const commaTextResult = CommaText.tryToStringArray(normalized);
    if (commaTextResult.isErr()) {
      return commaTextResult.createOuter(
        "Invalid comma-separated styles string",
      );
    }

    const result = new Set<DotNetNumberStyleId>();
    for (const part of commaTextResult.value) {
      const match = Object.values(DotNetNumberStyleId).find(
        (x) => x.toLowerCase() === part.toLowerCase(),
      );
      if (match === undefined) {
        return new Err(`Invalid style: ${part}`);
      }
      result.add(match);
    }

    return new Ok(result);
  }

  static tryFromXmlValueWithDefault(
    value: string,
    defaultStyles: DotNetNumberStyleSet,
  ): Result<DotNetNumberStyleSet> {
    if (value.trim().length === 0) {
      return new Ok(new Set(defaultStyles));
    }
    return this.tryFromXmlValue(value);
  }
}
