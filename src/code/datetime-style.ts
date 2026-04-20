import { CommaText, Err, Ok, Result } from "@pbkware/js-utils";

/**
 * Individual style flags that control date/time parsing behavior.
 *
 * These flags can be combined to create custom parsing rules.
 *
 * @example
 * ```typescript
 * // Combine individual flags
 * formatter.styles = new Set([
 *   DotNetDateTimeStyleId.AllowLeadingWhite,
 *   DotNetDateTimeStyleId.AllowTrailingWhite
 * ]);
 * ```
 *
 * @public
 * @category DateTime Styles
 */
export enum DotNetDateTimeStyleId {
  /** Allow leading whitespace characters. */
  AllowLeadingWhite = "AllowLeadingWhite",

  /** Allow trailing whitespace characters. */
  AllowTrailingWhite = "AllowTrailingWhite",

  /** Allow whitespace within the date/time string. */
  AllowInnerWhite = "AllowInnerWhite",

  /** Do not use current date for missing date components. */
  NoCurrentDateDefault = "NoCurrentDateDefault",

  /** Adjust date/time to UTC (not implemented). */
  AdjustToUniversal = "AdjustToUniversal",

  /** Assume local time zone if not specified (not implemented). */
  AssumeLocal = "AssumeLocal",

  /** Assume UTC time zone if not specified (not implemented). */
  AssumeUniversal = "AssumeUniversal",

  /** Preserve DateTimeKind when parsing (not implemented). */
  RoundTripKind = "RoundTripKind",
}

/**
 * A set of {@link DotNetDateTimeStyleId} flags.
 *
 * @public
 * @category DateTime Styles
 */
export type DotNetDateTimeStyleSet = Set<DotNetDateTimeStyleId>;

/**
 * Predefined date/time style combinations for common parsing scenarios.
 *
 * @internal
 * @category DateTime Styles
 */
export const DotNetDateTimeStyles = {
  /** No styles - strict parsing. */
  none: new Set<DotNetDateTimeStyleId>(),

  /**
   * Allow whitespace in date/time strings.
   * Includes: AllowLeadingWhite, AllowTrailingWhite, AllowInnerWhite.
   */
  allowWhiteSpaces: new Set<DotNetDateTimeStyleId>([
    DotNetDateTimeStyleId.AllowLeadingWhite,
    DotNetDateTimeStyleId.AllowTrailingWhite,
    DotNetDateTimeStyleId.AllowInnerWhite,
  ]),
};

const isSameSet = (
  left: DotNetDateTimeStyleSet,
  right: DotNetDateTimeStyleSet,
): boolean => {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
};

/** @internal */
export class DotNetDateTimeStylesInfo {
  static toString(styles: DotNetDateTimeStyleSet): string {
    return this.toXmlValue(styles);
  }

  static toXmlValue(styles: DotNetDateTimeStyleSet): string {
    if (isSameSet(styles, DotNetDateTimeStyles.allowWhiteSpaces)) {
      return "AllowWhiteSpaces";
    }
    return CommaText.fromStringArray(Array.from(styles.values()));
  }

  static tryFromString(value: string): Result<DotNetDateTimeStyleSet> {
    return this.tryFromXmlValue(value);
  }

  static tryFromXmlValue(value: string): Result<DotNetDateTimeStyleSet> {
    const normalized = value.trim();
    if (normalized.length === 0 || normalized.toLowerCase() === "none") {
      return new Ok(new Set(DotNetDateTimeStyles.none));
    }
    if (normalized.toLowerCase() === "allowwhitespaces") {
      return new Ok(new Set(DotNetDateTimeStyles.allowWhiteSpaces));
    }

    const commaTextResult = CommaText.tryToStringArray(normalized);
    if (commaTextResult.isErr())
      return commaTextResult.createOuter(
        "Invalid comma-separated styles string",
      );

    const styles = new Set<DotNetDateTimeStyleId>();
    for (const item of commaTextResult.value) {
      const match = Object.values(DotNetDateTimeStyleId).find(
        (x) => x.toLowerCase() === item.toLowerCase(),
      );
      if (match === undefined) return new Err(`Invalid style: ${item}`);
      styles.add(match);
    }
    return new Ok(styles);
  }
}
