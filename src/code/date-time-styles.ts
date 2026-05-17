/**
 * Individual style flags that control date/time parsing behavior.
 *
 * These flags can be combined using bitwise OR to create custom parsing rules.
 *
 * @example
 * ```typescript
 * const formatter = new DotNetDateTimeFormatter();
 *
 * // Combine multiple flags using bitwise OR
 * formatter.styles =
 *   DotNetDateTimeStyleFlags.allowLeadingWhite |
 *   DotNetDateTimeStyleFlags.allowTrailingWhite;
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

/**
 * The type representing possible values of {@link (DotNetDateTimeStyleFlags:variable)}.
 *
 * Flags can be combined using bitwise OR to create custom parsing behaviors.
 *
 * @public
 * @category DateTime Styles
 */
export type DotNetDateTimeStyleFlags =
  (typeof DotNetDateTimeStyleFlags)[keyof typeof DotNetDateTimeStyleFlags];

/**
 * Predefined date/time style combinations for common parsing scenarios.
 *
 * Contains individual {@link (DotNetDateTimeStyleFlags:variable)} as well as common combinations.
 *
 * @example
 * ```typescript
 * const formatter = new DotNetDateTimeFormatter();
 *
 * // Use a predefined combination
 * formatter.styles = DotNetDateTimeStyles.allowWhiteSpaces;
 *
 * // Or use individual flags
 * formatter.styles = DotNetDateTimeStyles.allowLeadingWhite;
 *
 * // Or combine flags manually
 * formatter.styles =
 *   DotNetDateTimeStyleFlags.allowLeadingWhite |
 *   DotNetDateTimeStyleFlags.noCurrentDateDefault;
 * ```
 *
 * @category DateTime Styles
 * @public
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

/**
 * The type representing possible values of {@link (DotNetDateTimeStyles:variable)}.
 *
 * This includes individual {@link (DotNetDateTimeStyleFlags:variable)} and predefined combinations.
 *
 * @public
 * @category DateTime Styles
 */
export type DotNetDateTimeStyles =
  (typeof DotNetDateTimeStyles)[keyof typeof DotNetDateTimeStyles];

// const flagEntries = Object.entries(DotNetDateTimeStyleFlags);
// const flagEntriesCount = flagEntries.length;

// type LowercaseKeys<T extends Record<string, number>> = {
//   [K in keyof T as Lowercase<string>]: T[K];
// };

// function lowercaseKeys<T extends Record<string, number>>(
//   obj: T,
// ): LowercaseKeys<T> {
//   const result = {} as Record<string, number>;
//   for (const key in obj) {
//     result[key.toLowerCase()] = obj[key];
//   }
//   return result as LowercaseKeys<T>;
// }

// const DotNetLowerCaseDateTimeStyleFlags: LowercaseKeys<
//   typeof DotNetDateTimeStyleFlags
// > = lowercaseKeys(DotNetDateTimeStyleFlags);

// /** @public */
// export class DotNetDateTimeStylesStringify {
//   static toString(styles: DotNetDateTimeStyles): string {
//     if (styles === DotNetDateTimeStyles.none) {
//       return "";
//     } else {
//       if (styles === DotNetDateTimeStyles.allowWhiteSpaces) {
//         return "allowWhiteSpaces";
//       } else {
//         // For other combinations, we convert the numeric value to the corresponding flags.
//         const keys = new Array<string>(flagEntriesCount);
//         let count = 0;
//         for (const [key, keyValue] of flagEntries) {
//           if ((styles & keyValue) === keyValue) {
//             keys[count++] = key;
//           }
//         }
//         keys.length = count;
//         return CommaText.fromStringArray(keys);
//       }
//     }
//   }

//   static tryFromString(value: string): Result<DotNetDateTimeStyles> {
//     const trimmedValue = value.trim();
//     if (trimmedValue.length === 0) {
//       return new Ok(DotNetDateTimeStyles.none);
//     } else {
//       const lowerCasedValue = trimmedValue.toLowerCase();
//       if (lowerCasedValue === "none") {
//         return new Ok(DotNetDateTimeStyles.none);
//       } else {
//         if (lowerCasedValue === "allowwhitespaces") {
//           return new Ok(DotNetDateTimeStyles.allowWhiteSpaces);
//         } else {
//           const toStringArrayResult = CommaText.tryToStringArray(value);
//           if (toStringArrayResult.isErr()) {
//             return new Err(`Invalid comma-separated list: ${value}`);
//           } else {
//             let result: DotNetDateTimeStyles = DotNetDateTimeStyles.none;
//             const lowercaseFlagXmlValues =
//               toStringArrayResult.value as (keyof typeof DotNetLowerCaseDateTimeStyleFlags)[];
//             for (const flagXmlValue of lowercaseFlagXmlValues) {
//               const flag = DotNetLowerCaseDateTimeStyleFlags[flagXmlValue];
//               if (flag !== undefined) {
//                 result |= flag;
//               } else {
//                 return new Err(`Invalid flag XmlValue: ${flagXmlValue}`);
//               }
//             }
//             return new Ok(result);
//           }
//         }
//       }
//     }
//   }
// }
