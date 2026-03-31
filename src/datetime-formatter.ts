import {
  DotNetDateTimeStyleId,
  DotNetDateTimeStyleSet,
  DotNetDateTimeStyles,
} from "./dotnet-datetime-style";
import { FieldedTextLocaleSettings } from "./locale-settings";

type ParseResult<T> =
  | { success: true; value: T }
  | { success: false; errorText: string };

type ElementType =
  | "standard"
  | "day"
  | "day2"
  | "dayNameShort"
  | "dayNameLong"
  | "month"
  | "month2"
  | "monthNameShort"
  | "monthNameLong"
  | "year2"
  | "year3"
  | "year4"
  | "year5"
  | "hour12"
  | "hour12_2"
  | "hour24"
  | "hour24_2"
  | "minute"
  | "minute2"
  | "second"
  | "second2"
  | "fraction"
  | "fractionTrim"
  | "amPm1"
  | "amPm2"
  | "dateSep"
  | "timeSep"
  | "literal";

interface Element {
  type: ElementType;
  len?: number;
  text?: string;
}

const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayNamesLong = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNamesShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthNamesLong = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(value: number, len: number): string {
  return value.toString().padStart(len, "0");
}

function formatStandard(token: string, date: Date, locale: string): string {
  switch (token) {
    case "d":
      return new Intl.DateTimeFormat(locale, { dateStyle: "short" }).format(
        date,
      );
    case "D":
      return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(
        date,
      );
    case "f":
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeStyle: "short",
      }).format(date);
    case "F":
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeStyle: "medium",
      }).format(date);
    case "g":
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    case "G":
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(date);
    case "M":
    case "m":
      return `${monthNamesLong[date.getMonth()]} ${date.getDate()}`;
    case "O":
    case "o":
      return date.toISOString();
    case "s":
      return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}T${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}`;
    case "t":
      return new Intl.DateTimeFormat(locale, { timeStyle: "short" }).format(
        date,
      );
    case "T":
      return new Intl.DateTimeFormat(locale, { timeStyle: "medium" }).format(
        date,
      );
    case "u":
      return date.toISOString().replace("T", " ").replace("Z", "Z");
    case "Y":
    case "y":
      return `${pad(date.getFullYear(), 4)} ${monthNamesLong[date.getMonth()]}`;
    default:
      return "?";
  }
}

function tokenizeCustom(format: string): ParseResult<Element[]> {
  const elements: Element[] = [];
  let index = 0;

  const pushLiteral = (text: string) => {
    if (text.length > 0) {
      elements.push({ type: "literal", text });
    }
  };

  while (index < format.length) {
    const current = format[index];

    if (current === "'" || current === '"') {
      const quote = current;
      index += 1;
      let literal = "";
      while (index < format.length && format[index] !== quote) {
        literal += format[index];
        index += 1;
      }
      if (index >= format.length) {
        return {
          success: false,
          errorText: "Unterminated quoted literal in format",
        };
      }
      index += 1;
      pushLiteral(literal);
      continue;
    }

    if (current === "\\") {
      index += 1;
      if (index >= format.length) {
        return {
          success: false,
          errorText: "Single-char literal escape at end of format",
        };
      }
      pushLiteral(format[index]);
      index += 1;
      continue;
    }

    if (current === "%") {
      index += 1;
      continue;
    }

    let runLength = 1;
    while (
      index + runLength < format.length &&
      format[index + runLength] === current
    ) {
      runLength += 1;
    }

    const consume = () => {
      index += runLength;
    };

    switch (current) {
      case "d":
        if (runLength === 1) elements.push({ type: "day" });
        else if (runLength === 2) elements.push({ type: "day2" });
        else if (runLength === 3) elements.push({ type: "dayNameShort" });
        else if (runLength === 4) elements.push({ type: "dayNameLong" });
        else
          return {
            success: false,
            errorText: "Too many repeated d characters",
          };
        consume();
        break;
      case "M":
        if (runLength === 1) elements.push({ type: "month" });
        else if (runLength === 2) elements.push({ type: "month2" });
        else if (runLength === 3) elements.push({ type: "monthNameShort" });
        else if (runLength === 4) elements.push({ type: "monthNameLong" });
        else
          return {
            success: false,
            errorText: "Too many repeated M characters",
          };
        consume();
        break;
      case "y":
        if (runLength === 1 || runLength === 2)
          elements.push({ type: "year2" });
        else if (runLength === 3) elements.push({ type: "year3" });
        else if (runLength === 4) elements.push({ type: "year4" });
        else if (runLength === 5) elements.push({ type: "year5" });
        else
          return {
            success: false,
            errorText: "Too many repeated y characters",
          };
        consume();
        break;
      case "h":
        elements.push({ type: runLength === 1 ? "hour12" : "hour12_2" });
        consume();
        break;
      case "H":
        elements.push({ type: runLength === 1 ? "hour24" : "hour24_2" });
        consume();
        break;
      case "m":
        elements.push({ type: runLength === 1 ? "minute" : "minute2" });
        consume();
        break;
      case "s":
        elements.push({ type: runLength === 1 ? "second" : "second2" });
        consume();
        break;
      case "f":
        elements.push({ type: "fraction", len: Math.min(runLength, 7) });
        consume();
        break;
      case "F":
        elements.push({ type: "fractionTrim", len: Math.min(runLength, 7) });
        consume();
        break;
      case "t":
        elements.push({ type: runLength === 1 ? "amPm1" : "amPm2" });
        consume();
        break;
      case "/":
        elements.push({ type: "dateSep" });
        consume();
        break;
      case ":":
        elements.push({ type: "timeSep" });
        consume();
        break;
      default:
        pushLiteral(current.repeat(runLength));
        consume();
        break;
    }
  }

  return { success: true, value: elements };
}

export class DotNetDateTimeFormatter {
  static readonly unsupportedStyles = new Set<DotNetDateTimeStyleId>([
    DotNetDateTimeStyleId.AdjustToUniversal,
    DotNetDateTimeStyleId.AssumeLocal,
    DotNetDateTimeStyleId.AssumeUniversal,
    DotNetDateTimeStyleId.RoundTripKind,
  ]);

  private format = "";
  styles: DotNetDateTimeStyleSet = new Set(DotNetDateTimeStyles.none);
  localeSettings = FieldedTextLocaleSettings.current;

  private formatIsStandard = false;
  private elements: Element[] = [];

  parseErrorText = "";

  trySetFormat(value: string): ParseResult<void> {
    if (value.length === 0) {
      return { success: false, errorText: "Format text cannot be empty" };
    }

    this.format = value;
    this.formatIsStandard = value.length === 1;

    if (this.formatIsStandard) {
      this.elements = [{ type: "standard", text: value }];
      return { success: true, value: undefined };
    }

    const parsed = tokenizeCustom(value);
    if (!parsed.success) {
      return parsed;
    }

    this.elements = parsed.value;
    return { success: true, value: undefined };
  }

  toString(value: Date): string {
    if (this.formatIsStandard) {
      return formatStandard(this.format, value, this.localeSettings.name);
    }

    let result = "";
    const hour = value.getHours();
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    for (const element of this.elements) {
      switch (element.type) {
        case "day":
          result += value.getDate().toString();
          break;
        case "day2":
          result += pad(value.getDate(), 2);
          break;
        case "dayNameShort":
          result += dayNamesShort[value.getDay()];
          break;
        case "dayNameLong":
          result += dayNamesLong[value.getDay()];
          break;
        case "month":
          result += (value.getMonth() + 1).toString();
          break;
        case "month2":
          result += pad(value.getMonth() + 1, 2);
          break;
        case "monthNameShort":
          result += monthNamesShort[value.getMonth()];
          break;
        case "monthNameLong":
          result += monthNamesLong[value.getMonth()];
          break;
        case "year2":
          result += (value.getFullYear() % 100).toString();
          break;
        case "year3":
          result += pad(value.getFullYear(), 3);
          break;
        case "year4":
          result += pad(value.getFullYear(), 4);
          break;
        case "year5":
          result += pad(value.getFullYear(), 5);
          break;
        case "hour12":
          result += hour12.toString();
          break;
        case "hour12_2":
          result += pad(hour12, 2);
          break;
        case "hour24":
          result += hour.toString();
          break;
        case "hour24_2":
          result += pad(hour, 2);
          break;
        case "minute":
          result += value.getMinutes().toString();
          break;
        case "minute2":
          result += pad(value.getMinutes(), 2);
          break;
        case "second":
          result += value.getSeconds().toString();
          break;
        case "second2":
          result += pad(value.getSeconds(), 2);
          break;
        case "fraction": {
          const ms = pad(value.getMilliseconds(), 3);
          result += (ms + "0000000").slice(0, element.len ?? 3);
          break;
        }
        case "fractionTrim": {
          const ms = pad(value.getMilliseconds(), 3);
          result += (ms + "0000000")
            .slice(0, element.len ?? 3)
            .replace(/0+$/, "");
          break;
        }
        case "amPm1":
          result += hour < 12 ? "A" : "P";
          break;
        case "amPm2":
          result += hour < 12 ? "AM" : "PM";
          break;
        case "dateSep":
          result += this.localeSettings.dateSeparator;
          break;
        case "timeSep":
          result += this.localeSettings.timeSeparator;
          break;
        case "literal":
          result += element.text ?? "";
          break;
        case "standard":
          result += formatStandard(
            element.text ?? "",
            value,
            this.localeSettings.name,
          );
          break;
      }
    }

    return result;
  }

  tryFromString(strValue: string): ParseResult<Date> {
    let parseText = strValue;

    if (
      this.styles.has(DotNetDateTimeStyleId.AllowLeadingWhite) &&
      this.styles.has(DotNetDateTimeStyleId.AllowTrailingWhite)
    ) {
      parseText = parseText.trim();
    } else if (this.styles.has(DotNetDateTimeStyleId.AllowLeadingWhite)) {
      parseText = parseText.trimStart();
    } else if (this.styles.has(DotNetDateTimeStyleId.AllowTrailingWhite)) {
      parseText = parseText.trimEnd();
    }

    if (parseText.length === 0) {
      return { success: false, errorText: "DateTime string is empty" };
    }

    if (this.formatIsStandard) {
      const parsed = new Date(parseText);
      if (Number.isNaN(parsed.getTime())) {
        return { success: false, errorText: "Invalid Date string" };
      }
      return { success: true, value: parsed };
    }

    const regexParts: string[] = ["^"];
    const setters: Array<
      (
        match: string,
        state: {
          y: number;
          m: number;
          d: number;
          hh: number;
          mm: number;
          ss: number;
          ms: number;
          ampm: number;
        },
      ) => void
    > = [];

    for (const element of this.elements) {
      switch (element.type) {
        case "day":
        case "day2":
          regexParts.push("(\\d{1,2})");
          setters.push((v, s) => {
            s.d = Number.parseInt(v, 10);
          });
          break;
        case "month":
        case "month2":
          regexParts.push("(\\d{1,2})");
          setters.push((v, s) => {
            s.m = Number.parseInt(v, 10);
          });
          break;
        case "year2":
          regexParts.push("(\\d{1,2})");
          setters.push((v, s) => {
            const yr = Number.parseInt(v, 10);
            s.y = yr < 50 ? 2000 + yr : 1900 + yr;
          });
          break;
        case "year3":
        case "year4":
        case "year5":
          regexParts.push("(\\d{3,5})");
          setters.push((v, s) => {
            s.y = Number.parseInt(v, 10);
          });
          break;
        case "hour12":
        case "hour12_2":
          regexParts.push("(\\d{1,2})");
          setters.push((v, s) => {
            s.hh = Number.parseInt(v, 10);
          });
          break;
        case "hour24":
        case "hour24_2":
          regexParts.push("(\\d{1,2})");
          setters.push((v, s) => {
            s.hh = Number.parseInt(v, 10);
          });
          break;
        case "minute":
        case "minute2":
          regexParts.push("(\\d{1,2})");
          setters.push((v, s) => {
            s.mm = Number.parseInt(v, 10);
          });
          break;
        case "second":
        case "second2":
          regexParts.push("(\\d{1,2})");
          setters.push((v, s) => {
            s.ss = Number.parseInt(v, 10);
          });
          break;
        case "fraction":
        case "fractionTrim":
          regexParts.push("(\\d{1,7})");
          setters.push((v, s) => {
            s.ms = Number.parseInt((v + "000").slice(0, 3), 10);
          });
          break;
        case "amPm1":
          regexParts.push("([APap])");
          setters.push((v, s) => {
            s.ampm = v.toUpperCase() === "P" ? 2 : 1;
          });
          break;
        case "amPm2":
          regexParts.push("(AM|PM|am|pm)");
          setters.push((v, s) => {
            s.ampm = v.toUpperCase() === "PM" ? 2 : 1;
          });
          break;
        case "dayNameShort":
          regexParts.push(`(${dayNamesShort.join("|")})`);
          setters.push(() => undefined);
          break;
        case "dayNameLong":
          regexParts.push(`(${dayNamesLong.join("|")})`);
          setters.push(() => undefined);
          break;
        case "monthNameShort":
          regexParts.push(`(${monthNamesShort.join("|")})`);
          setters.push((v, s) => {
            s.m =
              monthNamesShort.findIndex(
                (x) => x.toLowerCase() === v.toLowerCase(),
              ) + 1;
          });
          break;
        case "monthNameLong":
          regexParts.push(`(${monthNamesLong.join("|")})`);
          setters.push((v, s) => {
            s.m =
              monthNamesLong.findIndex(
                (x) => x.toLowerCase() === v.toLowerCase(),
              ) + 1;
          });
          break;
        case "dateSep":
          regexParts.push(
            this.localeSettings.dateSeparator.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            ),
          );
          break;
        case "timeSep":
          regexParts.push(
            this.localeSettings.timeSeparator.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            ),
          );
          break;
        case "literal":
          regexParts.push(
            (element.text ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          );
          break;
        case "standard":
          break;
      }
    }

    regexParts.push("$");
    const re = new RegExp(regexParts.join(""));
    const match = re.exec(parseText);
    if (match === null) {
      return {
        success: false,
        errorText: "DateTime string does not match all Format specifiers",
      };
    }

    const state = { y: 1, m: 1, d: 1, hh: 0, mm: 0, ss: 0, ms: 0, ampm: 0 };
    let group = 1;
    for (const setter of setters) {
      setter(match[group], state);
      group += 1;
    }

    if (state.ampm > 0) {
      if (state.hh === 12) state.hh = 0;
      if (state.ampm === 2) state.hh += 12;
    }

    const value = new Date(
      state.y,
      state.m - 1,
      state.d,
      state.hh,
      state.mm,
      state.ss,
      state.ms,
    );
    if (Number.isNaN(value.getTime())) {
      return { success: false, errorText: "Year, Month or Day is invalid" };
    }

    return { success: true, value };
  }
}
