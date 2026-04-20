import { Err, Ok, Result } from "@pbkware/js-utils";

const INVARIANT_LOCALE = "en-US";

function parseDate(value: string): Date | undefined {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date;
}

function getSeparators(locale: string): {
  decimalSeparator: string;
  thousandSeparator: string;
  currencySymbol: string;
  dateSeparator: string;
  timeSeparator: string;
} {
  const numberParts = new Intl.NumberFormat(locale, {
    style: "decimal",
    useGrouping: true,
  }).formatToParts(12345.6);
  const currencyParts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).formatToParts(1);
  const dateParts = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(2024, 6, 5));
  const timeParts = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(2024, 6, 5, 13, 24, 35));

  const decimalSeparator =
    numberParts.find((x) => x.type === "decimal")?.value ?? ".";
  const thousandSeparator =
    numberParts.find((x) => x.type === "group")?.value ?? ",";
  const currencySymbol =
    currencyParts.find((x) => x.type === "currency")?.value ?? "$";
  const dateSeparator =
    dateParts.find((x) => x.type === "literal")?.value ?? "/";
  const timeSeparator =
    timeParts.find((x) => x.type === "literal")?.value ?? ":";

  return {
    decimalSeparator,
    thousandSeparator,
    currencySymbol,
    dateSeparator,
    timeSeparator,
  };
}

/**
 * Represents locale-specific formatting settings for dates, times, and numbers.
 *
 * Provides culture-specific separators and formatting options that determine how
 * numbers, currencies, dates, and times are formatted and parsed.
 *
 * @example
 * ```typescript
 * // Use invariant culture (en-US)
 * const invariant = DotNetLocaleSettings.createInvariant();
 *
 * // Use specific locale
 * const french = DotNetLocaleSettings.create('fr-FR');
 * console.log(french.decimalSeparator);  // ","
 * console.log(french.thousandSeparator);  // " "
 *
 * // Use current system locale
 * const current = DotNetLocaleSettings.current;
 * ```
 *
 * @public
 * @category Locale Settings
 */
export class DotNetLocaleSettings {
  /**
   * Singleton instance for invariant culture (en-US).
   * Provides consistent formatting across all systems.
   */
  static readonly invariant = DotNetLocaleSettings.createInvariant();

  /**
   * Singleton instance for current system locale.
   * Uses the locale settings from the runtime environment.
   */
  static readonly current = new DotNetLocaleSettings(undefined);

  /** The locale identifier (same as name). */
  readonly id: string;

  /** The locale name (e.g., "en-US", "fr-FR"). */
  readonly name: string;

  /** Character used for decimal point (e.g., "." or ","). */
  readonly decimalSeparator: string;

  /** Character used for thousands grouping (e.g., "," or "." or " "). */
  readonly thousandSeparator: string;

  /** Currency symbol for this locale (e.g., "$", "€", "£"). */
  readonly currencyString: string;

  /** Character used between date components (e.g., "/", "-", "."). */
  readonly dateSeparator: string;

  /** Character used between time components (typically ":"). */
  readonly timeSeparator: string;

  /** Pre-configured number formatter for floating-point values. */
  readonly defaultFloat: Intl.NumberFormat;

  /** Pre-configured number formatter for high-precision decimal values. */
  readonly defaultDecimal: Intl.NumberFormat;

  /** Pre-configured number formatter for currency values. */
  readonly defaultCurrency: Intl.NumberFormat;

  /**
   * Creates a new DotNetLocaleSettings instance.
   *
   * @param localeName - Optional locale name (e.g., "en-US", "fr-FR").
   *                     If undefined, uses the system's current locale.
   *
   * @example
   * ```typescript
   * // System locale
   * const settings = new DotNetLocaleSettings(undefined);
   *
   * // Specific locale
   * const french = new DotNetLocaleSettings('fr-FR');
   * ```
   */
  constructor(localeName?: string) {
    this.name = localeName ?? Intl.DateTimeFormat().resolvedOptions().locale;
    this.id = this.name;
    const separators = getSeparators(this.name || INVARIANT_LOCALE);
    this.decimalSeparator = separators.decimalSeparator;
    this.thousandSeparator = separators.thousandSeparator;
    this.currencyString = separators.currencySymbol;
    this.dateSeparator = separators.dateSeparator;
    this.timeSeparator = separators.timeSeparator;

    this.defaultFloat = new Intl.NumberFormat(this.name, {
      useGrouping: false,
      maximumFractionDigits: 20,
    });
    this.defaultCurrency = new Intl.NumberFormat(this.name, {
      style: "currency",
      currency: "USD",
    });
    this.defaultDecimal = new Intl.NumberFormat(this.name, {
      useGrouping: false,
      minimumFractionDigits: 18,
      maximumFractionDigits: 18,
    });
  }

  /**
   * Creates a DotNetLocaleSettings instance for the specified locale.
   *
   * @param localeName - The locale name (e.g., "en-US", "fr-FR", "de-DE").
   * @returns A new DotNetLocaleSettings instance configured for the specified locale.
   *
   * @example
   * ```typescript
   * const usSettings = DotNetLocaleSettings.create('en-US');
   * const frSettings = DotNetLocaleSettings.create('fr-FR');
   * ```
   */
  static create(localeName: string): DotNetLocaleSettings {
    return new DotNetLocaleSettings(localeName);
  }

  /**
   * Creates a DotNetLocaleSettings instance for the invariant culture (en-US).
   * The invariant culture provides consistent formatting across all systems.
   *
   * @returns A new DotNetLocaleSettings instance configured for invariant culture.
   *
   * @example
   * ```typescript
   * const settings = DotNetLocaleSettings.createInvariant();
   * console.log(settings.decimalSeparator);  // "."
   * console.log(settings.thousandSeparator);  // ","
   * ```
   */
  static createInvariant(): DotNetLocaleSettings {
    return new DotNetLocaleSettings(INVARIANT_LOCALE);
  }

  /**
   * Converts a number or bigint to a string using locale-specific formatting.
   *
   * @param value - The number or bigint to format.
   * @param options - Optional Intl.NumberFormatOptions for custom formatting.
   * @returns The formatted number string.
   *
   * @example
   * ```typescript
   * const settings = DotNetLocaleSettings.create('en-US');
   * settings.numberToStr(1234.56);  // "1,234.56"
   * settings.numberToStr(1234.56, { minimumFractionDigits: 2 });  // "1,234.56"
   * ```
   */
  numberToStr(
    value: number | bigint,
    options?: Intl.NumberFormatOptions,
  ): string {
    return new Intl.NumberFormat(this.name, options).format(value);
  }

  /**
   * Converts a Date to a string using locale-specific formatting.
   *
   * @param value - The Date to format.
   * @param options - Optional Intl.DateTimeFormatOptions for custom formatting.
   * @returns The formatted date string.
   *
   * @example
   * ```typescript
   * const settings = DotNetLocaleSettings.create('en-US');
   * settings.dateToStr(new Date(2024, 6, 5), { dateStyle: 'short' });  // "7/5/2024"
   * ```
   */
  dateToStr(value: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.name, options).format(value);
  }

  /**
   * Converts a boolean to a string.
   *
   * @param value - The boolean value.
   * @returns "true" or "false".
   *
   * @example
   * ```typescript
   * settings.boolToStr(true);   // "true"
   * settings.boolToStr(false);  // "false"
   * ```
   */
  boolToStr(value: boolean): string {
    return value ? "true" : "false";
  }

  /**
   * Attempts to parse a boolean value from a string.
   *
   * @param value - The string to parse. Accepts: "true", "1", "yes" (case-insensitive) for true,
   *                and "false", "0", "no" for false.
   * @returns A Result containing the boolean value if successful, or an error if parsing fails.
   *
   * @example
   * ```typescript
   * settings.tryStrToBool('yes');    // Ok(true)
   * settings.tryStrToBool('false');  // Ok(false)
   * settings.tryStrToBool('invalid');  // Err("Invalid boolean string")
   * ```
   */
  tryStrToBool(value: string): Result<boolean> {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) {
      return new Ok(true);
    }
    if (["false", "0", "no"].includes(normalized)) {
      return new Ok(false);
    }
    return new Err("Invalid boolean string");
  }

  /**
   * Attempts to parse an integer from a string.
   *
   * @param value - The string to parse. Must contain only digits and an optional leading +/- sign.
   * @returns A Result containing the parsed integer if successful, or an error if parsing fails.
   *
   * @example
   * ```typescript
   * settings.tryStrToInt('123');    // Ok(123)
   * settings.tryStrToInt('-456');   // Ok(-456)
   * settings.tryStrToInt('12.34');  // Err("Invalid integer string")
   * ```
   */
  tryStrToInt(value: string): Result<number> {
    if (!/^[+-]?\d+$/.test(value.trim())) {
      return new Err("Invalid integer string");
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed)
      ? new Err("Invalid integer string")
      : new Ok(parsed);
  }

  /**
   * Attempts to parse a BigInt from a string.
   *
   * @param value - The string to parse. Must contain only digits and an optional leading +/- sign.
   * @returns A Result containing the parsed BigInt if successful, or an error if parsing fails.
   *
   * @example
   * ```typescript
   * settings.tryStrToBigInt('12345678901234567890');  // Ok(12345678901234567890n)
   * settings.tryStrToBigInt('-999');  // Ok(-999n)
   * ```
   */
  tryStrToBigInt(value: string): Result<bigint> {
    if (!/^[+-]?\d+$/.test(value.trim())) {
      return new Err("Invalid integer string");
    }
    try {
      return new Ok(BigInt(value.trim()));
    } catch {
      return new Err("Invalid integer string");
    }
  }

  /**
   * Attempts to parse a number from a string using locale-specific formatting.
   * Handles currency symbols, thousands separators, and locale-specific decimal separators.
   *
   * @param value - The string to parse.
   * @returns A Result containing the parsed number if successful, or an error if parsing fails.
   *
   * @example
   * ```typescript
   * const usSettings = DotNetLocaleSettings.create('en-US');
   * usSettings.tryStrToNumber('1,234.56');  // Ok(1234.56)
   * usSettings.tryStrToNumber('$1,234.56');  // Ok(1234.56)
   *
   * const frSettings = DotNetLocaleSettings.create('fr-FR');
   * frSettings.tryStrToNumber('1 234,56');  // Ok(1234.56)
   * ```
   */
  tryStrToNumber(value: string): Result<number> {
    const normalized = value
      .trim()
      .replaceAll(this.currencyString, "")
      .replaceAll(this.thousandSeparator, "")
      .replace(this.decimalSeparator, ".");
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed)
      ? new Err("Invalid float string")
      : new Ok(parsed);
  }

  /**
   * Attempts to parse a Date from a string.
   *
   * @param value - The string to parse. Accepts various date formats understood by JavaScript Date constructor.
   * @returns A Result containing the parsed Date if successful, or an error if parsing fails.
   *
   * @example
   * ```typescript
   * settings.tryStrToDate('2024-07-05');  // Ok(Date)
   * settings.tryStrToDate('July 5, 2024');  // Ok(Date)
   * settings.tryStrToDate('invalid');  // Err("Invalid date string")
   * ```
   */
  tryStrToDate(value: string): Result<Date> {
    const parsed = parseDate(value.trim());
    return parsed === undefined
      ? new Err("Invalid date string")
      : new Ok(parsed);
  }

  /**
   * Convert a single character to uppercase using culture-specific rules.
   * Handles special cases like Turkish 'i' → 'İ' vs standard 'i' → 'I'.
   *
   * @param char - The character to convert to uppercase.
   * @returns The uppercased character.
   *
   * @example
   * ```typescript
   * const usSettings = DotNetLocaleSettings.create('en-US');
   * usSettings.toUpperChar('i');  // "I"
   *
   * const trSettings = DotNetLocaleSettings.create('tr-TR');
   * trSettings.toUpperChar('i');  // "İ" (Turkish dotted I)
   * ```
   */
  toUpperChar(char: string): string {
    if (char.length === 0) {
      return char;
    }

    // For single character conversion, use Intl.Collator with locale-specific rules
    // Most locales follow standard Unicode case mapping
    const single = char[0];

    // Turkish locale has special rules for 'i' and 'ı'
    if (this.name.startsWith("tr")) {
      // Turkish lowercase: i (U+0069) -> Turkish uppercase: İ (U+0130)
      // Turkish lowercase: ı (U+0131) -> Turkish uppercase: I (U+0049)
      if (single === "i") {
        return "İ";
      }
      if (single === "ı") {
        return "I";
      }
    }

    // For other locales, use standard toUpperCase
    return single.toUpperCase();
  }

  /**
   * Convert a single character to lowercase using culture-specific rules.
   * Handles special cases like Turkish 'I' → 'ı' vs Turkish 'İ' → 'i'.
   *
   * @param char - The character to convert to lowercase.
   * @returns The lowercased character.
   *
   * @example
   * ```typescript
   * const usSettings = DotNetLocaleSettings.create('en-US');
   * usSettings.toLowerChar('I');  // "i"
   *
   * const trSettings = DotNetLocaleSettings.create('tr-TR');
   * trSettings.toLowerChar('I');  // "ı" (Turkish dotless i)
   * trSettings.toLowerChar('İ');  // "i" (Turkish dotted i)
   * ```
   */
  toLowerChar(char: string): string {
    if (char.length === 0) {
      return char;
    }

    const single = char[0];

    // Turkish locale has special rules for 'I' and 'İ'
    if (this.name.startsWith("tr")) {
      // Turkish uppercase: I (U+0049) -> Turkish lowercase: ı (U+0131)
      // Turkish uppercase: İ (U+0130) -> Turkish lowercase: i (U+0069)
      if (single === "I") {
        return "ı";
      }
      if (single === "İ") {
        return "i";
      }
    }

    // For other locales, use standard toLowerCase
    return single.toLowerCase();
  }
}
