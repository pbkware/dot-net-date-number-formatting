export type ParseResult<T> = { success: true; value: T } | { success: false };

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

export class FieldedTextLocaleSettings {
  static readonly invariant = FieldedTextLocaleSettings.createInvariant();
  static readonly current = new FieldedTextLocaleSettings(undefined);

  readonly id: string;
  readonly name: string;
  readonly decimalSeparator: string;
  readonly thousandSeparator: string;
  readonly currencyString: string;
  readonly dateSeparator: string;
  readonly timeSeparator: string;

  constructor(localeName?: string) {
    this.name = localeName ?? Intl.DateTimeFormat().resolvedOptions().locale;
    this.id = this.name;
    const separators = getSeparators(this.name || INVARIANT_LOCALE);
    this.decimalSeparator = separators.decimalSeparator;
    this.thousandSeparator = separators.thousandSeparator;
    this.currencyString = separators.currencySymbol;
    this.dateSeparator = separators.dateSeparator;
    this.timeSeparator = separators.timeSeparator;
  }

  static create(localeName: string): FieldedTextLocaleSettings {
    return new FieldedTextLocaleSettings(localeName);
  }

  static createInvariant(): FieldedTextLocaleSettings {
    return new FieldedTextLocaleSettings(INVARIANT_LOCALE);
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

  tryStrToBool(value: string): ParseResult<boolean> {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) {
      return { success: true, value: true };
    }
    if (["false", "0", "no"].includes(normalized)) {
      return { success: true, value: false };
    }
    return { success: false };
  }

  tryStrToInt(value: string): ParseResult<number> {
    if (!/^[+-]?\d+$/.test(value.trim())) {
      return { success: false };
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed)
      ? { success: false }
      : { success: true, value: parsed };
  }

  tryStrToInt64(value: string): ParseResult<bigint> {
    if (!/^[+-]?\d+$/.test(value.trim())) {
      return { success: false };
    }
    try {
      return { success: true, value: BigInt(value.trim()) };
    } catch {
      return { success: false };
    }
  }

  tryStrToFloat(value: string): ParseResult<number> {
    const normalized = value
      .trim()
      .replaceAll(this.thousandSeparator, "")
      .replace(this.decimalSeparator, ".");
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed)
      ? { success: false }
      : { success: true, value: parsed };
  }

  tryStrToCurr(value: string): ParseResult<number> {
    const withoutCurrency = value.replaceAll(this.currencyString, "");
    return this.tryStrToFloat(withoutCurrency);
  }

  tryStrToDate(value: string): ParseResult<Date> {
    const parsed = parseDate(value.trim());
    return parsed === undefined
      ? { success: false }
      : { success: true, value: parsed };
  }

  tryStrToDateTime(value: string): ParseResult<Date> {
    return this.tryStrToDate(value);
  }
}
