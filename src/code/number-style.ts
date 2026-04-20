import { CommaText, Err, Ok, Result } from "@pbkware/js-utils";

/**
 * Individual style flags that control which number formats are allowed during parsing.
 *
 * These flags can be combined to create custom parsing behavior.
 *
 * @example
 * ```typescript
 * // Combine individual flags
 * formatter.styles = new Set([
 *   DotNetNumberStyleId.AllowLeadingSign,
 *   DotNetNumberStyleId.AllowDecimalPoint,
 *   DotNetNumberStyleId.AllowThousands
 * ]);
 * ```
 *
 * @public
 * @category Number Styles
 */
export enum DotNetNumberStyleId {
  /** Allow currency symbol in the number string. */
  AllowCurrencySymbol = "AllowCurrencySymbol",

  /** Allow decimal point in the number string. */
  AllowDecimalPoint = "AllowDecimalPoint",

  /** Allow exponential notation (e.g., 1.23e+10). */
  AllowExponent = "AllowExponent",

  /** Parse the number as hexadecimal. */
  AllowHexSpecifier = "AllowHexSpecifier",

  /** Allow a leading plus (+) or minus (-) sign. */
  AllowLeadingSign = "AllowLeadingSign",

  /** Allow leading whitespace characters. */
  AllowLeadingWhite = "AllowLeadingWhite",

  /** Allow parentheses to indicate negative numbers. */
  AllowParentheses = "AllowParentheses",

  /** Allow thousands separator characters. */
  AllowThousands = "AllowThousands",

  /** Allow a trailing plus (+) or minus (-) sign. */
  AllowTrailingSign = "AllowTrailingSign",

  /** Allow trailing whitespace characters. */
  AllowTrailingWhite = "AllowTrailingWhite",
}

/**
 * A set of {@link DotNetNumberStyleId} flags.
 *
 * @public
 * @category Number Styles
 */
export type DotNetNumberStyleSet = Set<DotNetNumberStyleId>;

/**
 * Predefined number style combinations for common parsing scenarios.
 *
 * @example
 * ```typescript
 * // Use predefined style
 * formatter.styles = DotNetNumberStyles.number;
 * formatter.tryFromString('1,234.56');  // Parses successfully
 *
 * // Use currency style
 * formatter.styles = DotNetNumberStyles.currency;
 * formatter.tryFromString('$1,234.56');  // Parses successfully
 * ```
 *
 * @internal
 * @category Number Styles
 */
export const DotNetNumberStyles = {
  /** No styles - only basic digits allowed. */
  none: new Set<DotNetNumberStyleId>(),

  /**
   * All styles allowed (except hex).
   * Includes: AllowCurrencySymbol, AllowDecimalPoint, AllowExponent, AllowLeadingSign,
   * AllowLeadingWhite, AllowParentheses, AllowThousands, AllowTrailingSign, AllowTrailingWhite.
   */
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

  /**
   * Currency parsing style.
   * Includes: AllowCurrencySymbol, AllowDecimalPoint, AllowLeadingSign, AllowLeadingWhite,
   * AllowParentheses, AllowThousands, AllowTrailingSign, AllowTrailingWhite.
   */
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

  /**
   * Floating-point parsing style.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign,
   * AllowDecimalPoint, AllowExponent.
   */
  float: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowTrailingWhite,
    DotNetNumberStyleId.AllowLeadingSign,
    DotNetNumberStyleId.AllowDecimalPoint,
    DotNetNumberStyleId.AllowExponent,
  ]),

  /**
   * Hexadecimal parsing style.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowHexSpecifier.
   */
  hexNumber: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowTrailingWhite,
    DotNetNumberStyleId.AllowHexSpecifier,
  ]),

  /**
   * Basic integer parsing style.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign.
   */
  integer: new Set<DotNetNumberStyleId>([
    DotNetNumberStyleId.AllowLeadingWhite,
    DotNetNumberStyleId.AllowTrailingWhite,
    DotNetNumberStyleId.AllowLeadingSign,
  ]),

  /**
   * Standard number parsing style.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign, AllowTrailingSign,
   * AllowDecimalPoint, AllowThousands.
   */
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
