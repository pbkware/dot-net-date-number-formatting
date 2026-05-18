/**
 * Individual style flags that control which number formats are allowed during parsing.
 *
 * These flags can be combined to create custom parsing behavior.
 *
 * @example
 * ```typescript
 * // Combine individual flags
 * formatter.styles =
 *   DotNetNumberStyleFlags.allowLeadingSign |
 *   DotNetNumberStyleFlags.allowDecimalPoint |
 *   DotNetNumberStyleFlags.allowThousands;
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
