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

/** @public */
export class DotNetLocaleSettings {
  static readonly invariant = DotNetLocaleSettings.createInvariant();
  static readonly current = new DotNetLocaleSettings(undefined);

  readonly id: string;
  readonly name: string;
  readonly decimalSeparator: string;
  readonly thousandSeparator: string;
  readonly currencyString: string;
  readonly dateSeparator: string;
  readonly timeSeparator: string;

  readonly defaultFloat: Intl.NumberFormat;
  readonly defaultDecimal: Intl.NumberFormat;
  readonly defaultCurrency: Intl.NumberFormat;

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

  static create(localeName: string): DotNetLocaleSettings {
    return new DotNetLocaleSettings(localeName);
  }

  static createInvariant(): DotNetLocaleSettings {
    return new DotNetLocaleSettings(INVARIANT_LOCALE);
  }

  intToStr(value: number | bigint): string {
    return value.toString();
  }

  cardinalToStr(value: number): string {
    return Math.trunc(value >>> 0).toString();
  }

  uint64ToStr(value: bigint): string {
    return value.toString();
  }

  floatToStr(value: number): string {
    return new Intl.NumberFormat(this.name, {
      useGrouping: false,
      maximumFractionDigits: 20,
    }).format(value);
  }

  currToStr(value: number): string {
    return new Intl.NumberFormat(this.name, {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  currToStrF(value: number, digits: number): string {
    return new Intl.NumberFormat(this.name, {
      useGrouping: false,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }

  dateToStr(value: Date): string {
    return new Intl.DateTimeFormat(this.name, { dateStyle: "short" }).format(
      value,
    );
  }

  dateTimeToStr(value: Date): string {
    return new Intl.DateTimeFormat(this.name, {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(value);
  }

  boolToStr(value: boolean): string {
    return value ? "True" : "False";
  }

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

  tryStrToInt(value: string): Result<number> {
    if (!/^[+-]?\d+$/.test(value.trim())) {
      return new Err("Invalid integer string");
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed)
      ? new Err("Invalid integer string")
      : new Ok(parsed);
  }

  tryStrToInt64(value: string): Result<bigint> {
    if (!/^[+-]?\d+$/.test(value.trim())) {
      return new Err("Invalid integer string");
    }
    try {
      return new Ok(BigInt(value.trim()));
    } catch {
      return new Err("Invalid integer string");
    }
  }

  tryStrToFloat(value: string): Result<number> {
    const normalized = value
      .trim()
      .replaceAll(this.thousandSeparator, "")
      .replace(this.decimalSeparator, ".");
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed)
      ? new Err("Invalid float string")
      : new Ok(parsed);
  }

  tryStrToCurr(value: string): Result<number> {
    const withoutCurrency = value.replaceAll(this.currencyString, "");
    return this.tryStrToFloat(withoutCurrency);
  }

  tryStrToDate(value: string): Result<Date> {
    const parsed = parseDate(value.trim());
    return parsed === undefined
      ? new Err("Invalid date string")
      : new Ok(parsed);
  }

  tryStrToDateTime(value: string): Result<Date> {
    return this.tryStrToDate(value);
  }

  /**
   * Convert a single character to uppercase using culture-specific rules.
   * Handles special cases like Turkish 'i' → 'İ' vs 'I'.
   * @param char - The character to convert to uppercase
   * @returns The uppercased character
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
   * @param char - The character to convert to lowercase
   * @returns The lowercased character
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
