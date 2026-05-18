/**
 * Individual style flags that control which number formats are allowed during parsing.
 *
 * These flags can be combined to create custom parsing behavior.
 *
 * @example
 * ```typescript
 * // Combine individual flags
 * formatter.styles = new Set([
 *   DotNetNumberStyleFlags.AllowLeadingSign,
 *   DotNetNumberStyleFlags.AllowDecimalPoint,
 *   DotNetNumberStyleFlags.AllowThousands
 * ]);
 * ```
 *
 * @public
 * @category Number Styles
 */
export const DotNetNumberStyleFlags = {
  /** Allow leading whitespace characters. */
  allowLeadingWhite: 1,

  /** Allow trailing whitespace characters. */
  allowTrailingWhite: 2,

  /** Allow a leading plus (+) or minus (-) sign. */
  allowLeadingSign: 4,

  /** Allow a trailing plus (+) or minus (-) sign. */
  allowTrailingSign: 8,

  /** Allow parentheses to indicate negative numbers. */
  allowParentheses: 16,

  /** Allow decimal point in the number string. */
  allowDecimalPoint: 32,

  /** Allow thousands separator characters. */
  allowThousands: 64,

  /** Allow exponential notation (e.g., 1.23e+10). */
  allowExponent: 128,

  /** Allow currency symbol in the number string. */
  allowCurrencySymbol: 256,

  /** Parse the number as hexadecimal. */
  allowHexSpecifier: 512,
} as const;

/**
 * A set of {@link (DotNetNumberStyleFlags:variable)} flags.
 *
 * @public
 * @category Number Styles
 */
export type DotNetNumberStyleFlags =
  (typeof DotNetNumberStyleFlags)[keyof typeof DotNetNumberStyleFlags];

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
 * @public
 * @category Number Styles
 */
export const DotNetNumberStyles = {
  /** No styles - only basic digits allowed. */
  none: 0,

  allowLeadingWhite: DotNetNumberStyleFlags.allowLeadingWhite,

  /** Allow trailing whitespace characters. */
  allowTrailingWhite: DotNetNumberStyleFlags.allowTrailingWhite,

  /** Allow a leading plus (+) or minus (-) sign. */
  allowLeadingSign: DotNetNumberStyleFlags.allowLeadingSign,

  /** Allow a trailing plus (+) or minus (-) sign. */
  allowTrailingSign: DotNetNumberStyleFlags.allowTrailingSign,

  /** Allow parentheses to indicate negative numbers. */
  allowParentheses: DotNetNumberStyleFlags.allowParentheses,

  /** Allow decimal point in the number string. */
  allowDecimalPoint: DotNetNumberStyleFlags.allowDecimalPoint,

  /** Allow thousands separator characters. */
  allowThousands: DotNetNumberStyleFlags.allowThousands,

  /** Allow exponential notation (e.g., 1.23e+10). */
  allowExponent: DotNetNumberStyleFlags.allowExponent,

  /** Allow currency symbol in the number string. */
  allowCurrencySymbol: DotNetNumberStyleFlags.allowCurrencySymbol,

  /** Parse the number as hexadecimal. */
  allowHexSpecifier: DotNetNumberStyleFlags.allowHexSpecifier,

  /**
   * All styles allowed (except hex).
   * Includes: AllowCurrencySymbol, AllowDecimalPoint, AllowExponent, AllowLeadingSign,
   * AllowLeadingWhite, AllowParentheses, AllowThousands, AllowTrailingSign, AllowTrailingWhite.
   */
  any:
    DotNetNumberStyleFlags.allowCurrencySymbol |
    DotNetNumberStyleFlags.allowDecimalPoint |
    DotNetNumberStyleFlags.allowExponent |
    DotNetNumberStyleFlags.allowLeadingSign |
    DotNetNumberStyleFlags.allowLeadingWhite |
    DotNetNumberStyleFlags.allowParentheses |
    DotNetNumberStyleFlags.allowThousands |
    DotNetNumberStyleFlags.allowTrailingSign |
    DotNetNumberStyleFlags.allowTrailingWhite,

  /**
   * Currency parsing style.
   * Includes: AllowCurrencySymbol, AllowDecimalPoint, AllowLeadingSign, AllowLeadingWhite,
   * AllowParentheses, AllowThousands, AllowTrailingSign, AllowTrailingWhite.
   */
  currency:
    DotNetNumberStyleFlags.allowCurrencySymbol |
    DotNetNumberStyleFlags.allowDecimalPoint |
    DotNetNumberStyleFlags.allowLeadingSign |
    DotNetNumberStyleFlags.allowLeadingWhite |
    DotNetNumberStyleFlags.allowParentheses |
    DotNetNumberStyleFlags.allowThousands |
    DotNetNumberStyleFlags.allowTrailingSign |
    DotNetNumberStyleFlags.allowTrailingWhite,

  /**
   * Floating-point parsing style.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign,
   * AllowDecimalPoint, AllowExponent.
   */
  float:
    DotNetNumberStyleFlags.allowLeadingWhite |
    DotNetNumberStyleFlags.allowTrailingWhite |
    DotNetNumberStyleFlags.allowLeadingSign |
    DotNetNumberStyleFlags.allowDecimalPoint |
    DotNetNumberStyleFlags.allowExponent,

  /**
   * Hexadecimal parsing style.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowHexSpecifier.
   */
  hexNumber:
    DotNetNumberStyleFlags.allowLeadingWhite |
    DotNetNumberStyleFlags.allowTrailingWhite |
    DotNetNumberStyleFlags.allowHexSpecifier,

  /**
   * Basic integer parsing style.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign.
   */
  integer:
    DotNetNumberStyleFlags.allowLeadingWhite |
    DotNetNumberStyleFlags.allowTrailingWhite |
    DotNetNumberStyleFlags.allowLeadingSign,

  /**
   * Standard number parsing style.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign, AllowTrailingSign,
   * AllowDecimalPoint, AllowThousands.
   */
  number:
    DotNetNumberStyleFlags.allowLeadingWhite |
    DotNetNumberStyleFlags.allowTrailingWhite |
    DotNetNumberStyleFlags.allowLeadingSign |
    DotNetNumberStyleFlags.allowTrailingSign |
    DotNetNumberStyleFlags.allowDecimalPoint |
    DotNetNumberStyleFlags.allowThousands,
} as const;

/**
 * The type representing possible values of {@link (DotNetNumberStyles:variable)}.
 *
 * This includes individual {@link (DotNetNumberStyleFlags:variable)} and predefined combinations.
 *
 * @public
 * @category Number Styles
 */
export type DotNetNumberStyles =
  (typeof DotNetNumberStyles)[keyof typeof DotNetNumberStyles];

// /** @internal */
// export class DotNetNumberStylesInfo {
//   static toString(styles: DotNetNumberStyleFlags): string {
//     return this.toXmlValue(styles);
//   }

//   static toXmlValue(styles: DotNetNumberStyleFlags): string {
//     if (isSameSet(styles, DotNetNumberStyles.any)) return "Any";
//     if (isSameSet(styles, DotNetNumberStyles.currency)) return "Currency";
//     if (isSameSet(styles, DotNetNumberStyles.float)) return "Float";
//     if (isSameSet(styles, DotNetNumberStyles.hexNumber)) return "HexNumber";
//     if (isSameSet(styles, DotNetNumberStyles.integer)) return "Integer";
//     if (isSameSet(styles, DotNetNumberStyles.number)) return "Number";

//     return CommaText.fromStringArray(Array.from(styles.values()));
//   }

//   static tryFromString(value: string): Result<DotNetNumberStyleFlags> {
//     return this.tryFromXmlValue(value);
//   }

//   static tryFromXmlValue(value: string): Result<DotNetNumberStyleFlags> {
//     const normalized = value.trim();
//     if (normalized.length === 0 || normalized.toLowerCase() === "none") {
//       return new Ok(new Set(DotNetNumberStyles.none));
//     }

//     const canonical = normalized.toLowerCase();
//     if (canonical === "any") return new Ok(new Set(DotNetNumberStyles.any));
//     if (canonical === "currency")
//       return new Ok(new Set(DotNetNumberStyles.currency));
//     if (canonical === "float") return new Ok(new Set(DotNetNumberStyles.float));
//     if (canonical === "hexnumber")
//       return new Ok(new Set(DotNetNumberStyles.hexNumber));
//     if (canonical === "integer")
//       return new Ok(new Set(DotNetNumberStyles.integer));
//     if (canonical === "number")
//       return new Ok(new Set(DotNetNumberStyles.number));

//     const commaTextResult = CommaText.tryToStringArray(normalized);
//     if (commaTextResult.isErr()) {
//       return commaTextResult.createOuter(
//         "Invalid comma-separated styles string",
//       );
//     }

//     const result = new Set<DotNetNumberStyleFlags>();
//     for (const part of commaTextResult.value) {
//       const match = Object.values(DotNetNumberStyleFlags).find(
//         (x) => x.toLowerCase() === part.toLowerCase(),
//       );
//       if (match === undefined) {
//         return new Err(`Invalid style: ${part}`);
//       }
//       result.add(match);
//     }

//     return new Ok(result);
//   }

//   static tryFromXmlValueWithDefault(
//     value: string,
//     defaultStyles: DotNetNumberStyleFlags,
//   ): Result<DotNetNumberStyleFlags> {
//     if (value.trim().length === 0) {
//       return new Ok(new Set(defaultStyles));
//     }
//     return this.tryFromXmlValue(value);
//   }
// }
