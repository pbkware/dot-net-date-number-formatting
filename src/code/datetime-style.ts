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
export const DotNetDateTimeStyleFlags = {
  /** Allow leading whitespace characters. */
  allowLeadingWhite: 1,

  /** Allow trailing whitespace characters. */
  allowTrailingWhite: 2,

  /** Allow whitespace within the date/time string. */
  allowInnerWhite: 4,

  /** Do not use current date for missing date components. */
  noCurrentDateDefault: 8,

  /** Adjust date/time to UTC (not implemented). */
  adjustToUniversal: 16,

  /** Assume local time zone if not specified (not implemented). */
  assumeLocal: 32,

  /** Assume UTC time zone if not specified (not implemented). */
  assumeUniversal: 64,

  /** Preserve DateTimeKind when parsing (not implemented). */
  roundTripKind: 128,
} as const;

const flagEntries = Object.entries(DotNetDateTimeStyleFlags);
const flagEntriesCount = flagEntries.length;

/**
 * A set of {@link DotNetDateTimeStyleFlags} flags.
 *
 * @public
 * @category DateTime Styles
 */
export type DotNetDateTimeStyleFlags =
  (typeof DotNetDateTimeStyleFlags)[keyof typeof DotNetDateTimeStyleFlags];

type LowercaseKeys<T> = {
  [K in keyof T as Lowercase<string>]: T[K];
};

function lowercaseKeys<T extends Record<string, number>>(
  obj: T,
): LowercaseKeys<T> {
  const result = {} as Record<string, number>;
  for (const key in obj) {
    result[key.toLowerCase()] = obj[key];
  }
  return result as LowercaseKeys<T>;
}

const DotNetLowerCaseDateTimeStyleFlags: LowercaseKeys<
  typeof DotNetDateTimeStyleFlags
> = lowercaseKeys(DotNetDateTimeStyleFlags);

/**
 * Predefined date/time style combinations for common parsing scenarios.
 *
 * @internal
 * @category DateTime Styles
 */
export const DotNetDateTimeStyles = {
  /** No styles - strict parsing. */
  none: 0,

  allowLeadingWhite: DotNetDateTimeStyleFlags.allowLeadingWhite,
  allowTrailingWhite: DotNetDateTimeStyleFlags.allowTrailingWhite,
  allowInnerWhite: DotNetDateTimeStyleFlags.allowInnerWhite,

  /**
   * Allow whitespace in date/time strings.
   * Includes: allowLeadingWhite, allowTrailingWhite, allowInnerWhite.
   */
  allowWhiteSpaces:
    DotNetDateTimeStyleFlags.allowLeadingWhite |
    DotNetDateTimeStyleFlags.allowTrailingWhite |
    DotNetDateTimeStyleFlags.allowInnerWhite,

  noCurrentDateDefault: DotNetDateTimeStyleFlags.noCurrentDateDefault,

  /** Adjust date/time to UTC (not implemented). */
  adjustToUniversal: DotNetDateTimeStyleFlags.adjustToUniversal,

  /** Assume local time zone if not specified (not implemented). */
  assumeLocal: DotNetDateTimeStyleFlags.assumeLocal,

  /** Assume UTC time zone if not specified (not implemented). */
  assumeUniversal: DotNetDateTimeStyleFlags.assumeUniversal,

  /** Preserve DateTimeKind when parsing (not implemented). */
  roundTripKind: DotNetDateTimeStyleFlags.roundTripKind,
} as const;

export type DotNetDateTimeStyles =
  (typeof DotNetDateTimeStyles)[keyof typeof DotNetDateTimeStyles];

/** @internal */
export class DotNetDateTimeStylesUtils {
  static toString(styles: DotNetDateTimeStyles): string {
    return this.toXmlValue(styles);
  }

  static toXmlValue(styles: DotNetDateTimeStyles): string {
    if (styles === DotNetDateTimeStyles.none) {
      return "";
    } else {
      if (styles === DotNetDateTimeStyles.allowWhiteSpaces) {
        return "AllowWhiteSpaces";
      } else {
        // For other combinations, we convert the numeric value to the corresponding flags.
        const keys = new Array<string>(flagEntriesCount);
        let count = 0;
        for (const [key, keyValue] of flagEntries) {
          if ((styles & keyValue) === keyValue) {
            keys[count++] = key;
          }
        }
        keys.length = count;
        return CommaText.fromStringArray(keys);
      }
    }
  }

  static tryFromString(value: string): Result<DotNetDateTimeStyles> {
    return this.tryFromXmlValue(value);
  }

  static tryFromXmlValue(value: string): Result<DotNetDateTimeStyles> {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      return new Ok(DotNetDateTimeStyles.none);
    } else {
      const lowerCasedValue = trimmedValue.toLowerCase();
      if (lowerCasedValue === "none") {
        return new Ok(DotNetDateTimeStyles.none);
      } else {
        if (lowerCasedValue === "allowwhitespaces") {
          return new Ok(DotNetDateTimeStyles.allowWhiteSpaces);
        } else {
          const toStringArrayResult = CommaText.tryToStringArray(value);
          if (toStringArrayResult.isErr()) {
            return new Err(`Invalid comma-separated list: ${value}`);
          } else {
            let result: DotNetDateTimeStyles = DotNetDateTimeStyles.none;
            const lowercaseFlagXmlValues =
              toStringArrayResult.value as (keyof typeof DotNetLowerCaseDateTimeStyleFlags)[];
            for (const flagXmlValue of lowercaseFlagXmlValues) {
              const flag = DotNetLowerCaseDateTimeStyleFlags[flagXmlValue];
              if (flag !== undefined) {
                result |= flag;
              } else {
                return new Err(`Invalid flag XmlValue: ${flagXmlValue}`);
              }
            }
            return new Ok(result);
          }
        }
      }
    }
  }
}
