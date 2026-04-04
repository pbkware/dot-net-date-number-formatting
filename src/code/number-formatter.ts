import { Err, Ok, Result } from "@pbkware/js-utils";
import {
  DotNetNumberStyleId,
  DotNetNumberStyleSet,
  DotNetNumberStyles,
} from "./dotnet-number-style";
import { FieldedTextLocaleSettings } from "./locale-settings";

type ElementType =
  | "standard"
  | "zero"
  | "digit"
  | "decimal"
  | "thousands"
  | "percent"
  | "permille"
  | "exponent"
  | "literal"
  | "section";

interface Element {
  type: ElementType;
  text?: string;
  count?: number;
  exponentCase?: "upper" | "lower";
  exponentSign?: "+" | "-" | "none";
  exponentDigits?: number;
}

interface FormatSection {
  elements: Element[];
  hasDecimal: boolean;
  integerDigits: number;
  decimalDigits: number;
  scale: number; // Number of ,, dividers
}

/** @public */
export class DotNetNumberFormatter {
  protected format = "";
  private formatIsStandard = false;
  private precision = 0;
  private sections: FormatSection[] = [];

  styles: DotNetNumberStyleSet = new Set(DotNetNumberStyles.number);
  localeSettings = FieldedTextLocaleSettings.current;
  parseErrorText = "";

  protected setParseErrorText(value: string): false {
    this.parseErrorText = value;
    return false;
  }

  trySetFormat(value: string): Result<void> {
    if (value.length === 0) {
      return new Err("Format string cannot be empty");
    }

    this.format = value;
    this.formatIsStandard =
      value.length === 1 ||
      (value.length === 2 && /^\w\d$/.test(value)) ||
      (value.length === 3 && /^\w\d\d$/.test(value));

    if (this.formatIsStandard) {
      // Parse standard format: C, C2, D, D5, etc.
      const formatChar = value[0]; // Keep original case
      const formatCharUpper = formatChar.toUpperCase();
      const precisionStr = value.length > 1 ? value.slice(1) : "";
      this.precision = precisionStr ? parseInt(precisionStr, 10) || 0 : -1; // -1 means no precision specified

      // Validate standard format specifiers
      if (!"BCDEFGNPRX".includes(formatCharUpper)) {
        return new Err(`Unknown standard format specifier: ${formatChar}`);
      }

      this.sections = [
        {
          elements: [{ type: "standard", text: formatChar }], // Store original case
          hasDecimal: false,
          integerDigits: 0,
          decimalDigits: 0,
          scale: 0,
        },
      ];
      return new Ok(undefined);
    }

    // Parse custom format
    const parsed = this.parseCustomFormat(value);
    if (parsed.isErr()) {
      return parsed.createType<void>();
    }

    this.sections = parsed.value;
    return new Ok(undefined);
  }

  private parseCustomFormat(format: string): Result<FormatSection[]> {
    const sections: FormatSection[] = [];
    let currentSection: Element[] = [];
    let i = 0;

    while (i < format.length) {
      const char = format[i];

      if (char === ";") {
        sections.push(this.analyzeSection(currentSection));
        currentSection = [];
        i++;
        continue;
      }

      if (char === "\\") {
        // Escape character
        if (i + 1 < format.length) {
          currentSection.push({ type: "literal", text: format[i + 1] });
          i += 2;
        } else {
          return new Err("Trailing escape character");
        }
        continue;
      }

      if (char === '"' || char === "'") {
        // Literal string
        const endQuote = format.indexOf(char, i + 1);
        if (endQuote === -1) {
          return new Err(
            `Unterminated string literal starting at position ${i}`,
          );
        }
        const literal = format.slice(i + 1, endQuote);
        if (literal.length > 0) {
          currentSection.push({ type: "literal", text: literal });
        }
        i = endQuote + 1;
        continue;
      }

      if (char === "0") {
        let count = 1;
        while (i + count < format.length && format[i + count] === "0") {
          count++;
        }
        currentSection.push({ type: "zero", count });
        i += count;
        continue;
      }

      if (char === "#") {
        let count = 1;
        while (i + count < format.length && format[i + count] === "#") {
          count++;
        }
        currentSection.push({ type: "digit", count });
        i += count;
        continue;
      }

      if (char === ".") {
        currentSection.push({ type: "decimal" });
        i++;
        continue;
      }

      if (char === ",") {
        currentSection.push({ type: "thousands" });
        i++;
        continue;
      }

      if (char === "%") {
        currentSection.push({ type: "percent" });
        i++;
        continue;
      }

      if (char === "‰") {
        currentSection.push({ type: "permille" });
        i++;
        continue;
      }

      if (char === "E" || char === "e") {
        // Exponential notation: E+0, E-0, e+00, etc.
        const exponentCase = char === "E" ? "upper" : "lower";
        let exponentSign: "+" | "-" | "none" = "none";
        let j = i + 1;

        if (j < format.length && (format[j] === "+" || format[j] === "-")) {
          exponentSign = format[j] as "+" | "-";
          j++;
        }

        let exponentDigits = 0;
        while (j < format.length && format[j] === "0") {
          exponentDigits++;
          j++;
        }

        if (exponentDigits > 0) {
          currentSection.push({
            type: "exponent",
            exponentCase,
            exponentSign,
            exponentDigits,
          });
          i = j;
          continue;
        }
      }

      // Any other character is treated as literal
      currentSection.push({ type: "literal", text: char });
      i++;
    }

    if (currentSection.length > 0) {
      sections.push(this.analyzeSection(currentSection));
    }

    if (sections.length === 0) {
      return new Err("Empty format string");
    }

    return new Ok(sections);
  }

  private analyzeSection(elements: Element[]): FormatSection {
    let hasDecimal = false;
    let decimalIndex = -1;
    let integerDigits = 0;
    let decimalDigits = 0;
    let scale = 0;

    for (let i = 0; i < elements.length; i++) {
      const elem = elements[i];
      if (elem.type === "decimal") {
        hasDecimal = true;
        decimalIndex = i;
      }
    }

    // Count scale (number of ,, at the end before decimal or at end)
    let scaleCheckIdx =
      decimalIndex >= 0 ? decimalIndex - 1 : elements.length - 1;
    while (scaleCheckIdx >= 0 && elements[scaleCheckIdx].type === "thousands") {
      scale++;
      scaleCheckIdx--;
    }

    // Count integer and decimal digit placeholders
    for (let i = 0; i < elements.length; i++) {
      const elem = elements[i];
      if (elem.type === "zero" || elem.type === "digit") {
        if (hasDecimal && i > decimalIndex) {
          decimalDigits += elem.count || 1;
        } else if (!hasDecimal || i < decimalIndex) {
          integerDigits += elem.count || 1;
        }
      }
    }

    return { elements, hasDecimal, integerDigits, decimalDigits, scale };
  }

  protected formatNumber(
    value: number | bigint,
    allowDecimal: boolean = true,
  ): string {
    if (this.format === "") {
      return value.toString();
    }

    const numValue = typeof value === "bigint" ? Number(value) : value;

    if (this.formatIsStandard) {
      return this.formatStandard(numValue, allowDecimal);
    }

    return this.formatCustom(numValue, allowDecimal);
  }

  private formatStandard(value: number, allowDecimal: boolean): string {
    const formatChar = this.sections[0].elements[0].text || "G";
    const precision = this.precision;

    switch (formatChar.toUpperCase()) {
      case "C": // Currency
        return this.formatCurrency(value, precision);
      case "D": // Decimal (integers only)
        return this.formatDecimal(value, precision);
      case "E": // Exponential
        return this.formatExponential(value, precision, formatChar === "E");
      case "F": // Fixed-point
        return this.formatFixedPoint(value, precision);
      case "G": // General
        return this.formatGeneral(value, precision, formatChar === "G");
      case "N": // Number with group separators
        return this.formatNumber_(value, precision);
      case "P": // Percent
        return this.formatPercent(value, precision);
      case "R": // Round-trip
        return value.toString();
      case "X": // Hexadecimal
        return this.formatHex(value, precision, formatChar === "X");
      case "B": // Binary
        return this.formatBinary(value, precision, formatChar === "B");
      default:
        return value.toString();
    }
  }

  private formatCurrency(value: number, precision: number): string {
    const p = precision > 0 ? precision : 2;
    const formatted = new Intl.NumberFormat(this.localeSettings.name, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: p,
      maximumFractionDigits: p,
    }).format(value);
    return formatted.replace("$", this.localeSettings.currencyString);
  }

  private formatDecimal(value: number, precision: number): string {
    const intValue = Math.trunc(value);
    const str = Math.abs(intValue).toString();
    const p = this.precision >= 0 ? this.precision : 0;
    const padded = p > 0 ? str.padStart(p, "0") : str;
    return intValue < 0 ? "-" + padded : padded;
  }

  private formatExponential(
    value: number,
    precision: number,
    uppercase: boolean,
  ): string {
    const p = this.precision >= 0 ? this.precision : 6;
    const formatted = value.toExponential(p);
    return uppercase ? formatted.toUpperCase() : formatted.toLowerCase();
  }

  private formatFixedPoint(value: number, precision: number): string {
    const p = this.precision >= 0 ? this.precision : 2;
    return value.toFixed(p).replace(".", this.localeSettings.decimalSeparator);
  }

  private formatGeneral(
    value: number,
    precision: number,
    uppercase: boolean,
  ): string {
    // General format uses the more compact of fixed-point or scientific
    const absValue = Math.abs(value);
    if (absValue === 0) {
      return "0";
    }

    const exp = Math.floor(Math.log10(absValue));
    const p = precision > 0 ? precision : 15;

    // Use scientific notation if exponent is < -4 or >= 10
    if (exp < -4 || exp >= 10) {
      const formatted = value.toExponential(Math.max(0, p - 1));
      let result = uppercase
        ? formatted.toUpperCase()
        : formatted.toLowerCase();
      // Remove trailing zeros from mantissa
      result = result.replace(/(\..+?)0+([eE])/, "$1$2");
      return result;
    }

    // Use fixed-point
    let formatted = value.toPrecision(p);
    // Remove trailing zeros after decimal point
    if (formatted.includes(".")) {
      formatted = formatted.replace(/\.?0+$/, "");
    }
    return formatted.replace(".", this.localeSettings.decimalSeparator);
  }

  private formatNumber_(value: number, precision: number): string {
    const p = this.precision >= 0 ? this.precision : 2;
    return new Intl.NumberFormat(this.localeSettings.name, {
      minimumFractionDigits: p,
      maximumFractionDigits: p,
      useGrouping: true,
    }).format(value);
  }

  private formatPercent(value: number, precision: number): string {
    const p = precision >= 0 ? precision : 2;
    return new Intl.NumberFormat(this.localeSettings.name, {
      style: "percent",
      minimumFractionDigits: p,
      maximumFractionDigits: p,
    }).format(value);
  }

  private formatHex(
    value: number,
    precision: number,
    uppercase: boolean,
  ): string {
    const intValue = Math.trunc(value);
    let hex = Math.abs(intValue).toString(16);
    if (precision > 0) {
      hex = hex.padStart(precision, "0");
    }
    return uppercase ? hex.toUpperCase() : hex.toLowerCase();
  }

  private formatBinary(
    value: number,
    precision: number,
    uppercase: boolean,
  ): string {
    const intValue = Math.trunc(value);
    let binary = (intValue >>> 0).toString(2);
    if (precision > 0) {
      binary = binary.padStart(precision, "0");
    }
    return binary;
  }

  private formatCustom(value: number, allowDecimal: boolean): string {
    // Determine which section to use based on value
    let section: FormatSection;
    if (this.sections.length === 1) {
      section = this.sections[0];
    } else if (this.sections.length === 2) {
      section = value >= 0 ? this.sections[0] : this.sections[1];
      value = Math.abs(value);
    } else {
      // 3 sections: positive, negative, zero
      if (value > 0) {
        section = this.sections[0];
      } else if (value < 0) {
        section = this.sections[1];
        value = Math.abs(value);
      } else {
        section = this.sections[2];
      }
    }

    return this.formatWithSection(value, section, allowDecimal);
  }

  private formatWithSection(
    value: number,
    section: FormatSection,
    allowDecimal: boolean,
  ): string {
    let workingValue = value;
    let hasPercent = false;
    let hasPermille = false;
    let hasExponent = false;

    // Check for percent/permille/exponent
    for (const elem of section.elements) {
      if (elem.type === "percent") {
        hasPercent = true;
        workingValue *= 100;
      } else if (elem.type === "permille") {
        hasPermille = true;
        workingValue *= 1000;
      } else if (elem.type === "exponent") {
        hasExponent = true;
      }
    }

    // Apply scaling
    if (section.scale > 0) {
      workingValue /= Math.pow(1000, section.scale);
    }

    // Format based on whether we have exponential notation
    if (hasExponent) {
      return this.formatCustomExponential(workingValue, section);
    }

    // Round to appropriate decimal places
    const absValue = Math.abs(workingValue);
    const rounded =
      section.hasDecimal && section.decimalDigits > 0
        ? absValue.toFixed(section.decimalDigits)
        : Math.round(absValue).toString();

    const [intPart, fracPart] = rounded.split(".");
    const intStr = intPart || "0";
    const fracStr = fracPart || "";

    // Build the result by processing elements in order
    let result = "";
    let intPrinted = false;
    let fracPrinted = false;

    // Find decimal position
    let decimalPos = -1;
    let hasThousands = false;
    for (let i = 0; i < section.elements.length; i++) {
      if (section.elements[i].type === "decimal") {
        decimalPos = i;
      }
      if (section.elements[i].type === "thousands") {
        hasThousands = true;
      }
    }

    for (let i = 0; i < section.elements.length; i++) {
      const elem = section.elements[i];

      if (elem.type === "literal") {
        result += elem.text || "";
      } else if (elem.type === "decimal") {
        if (allowDecimal && (fracStr.length > 0 || section.decimalDigits > 0)) {
          result += this.localeSettings.decimalSeparator;
        }
      } else if (elem.type === "percent") {
        result += "%";
      } else if (elem.type === "permille") {
        result += "‰";
      } else if (
        (elem.type === "zero" || elem.type === "digit") &&
        !intPrinted &&
        (decimalPos === -1 || i < decimalPos)
      ) {
        // This is the first integer placeholder - format entire integer part
        let formattedInt = intStr;

        // Add thousands separators if needed
        if (hasThousands && formattedInt.length > 3) {
          const parts: string[] = [];
          for (let j = formattedInt.length; j > 0; j -= 3) {
            const start = Math.max(0, j - 3);
            parts.unshift(formattedInt.slice(start, j));
          }
          formattedInt = parts.join(this.localeSettings.thousandSeparator);
        }

        result += formattedInt;
        intPrinted = true;
      } else if (
        (elem.type === "zero" || elem.type === "digit") &&
        !fracPrinted &&
        decimalPos >= 0 &&
        i > decimalPos
      ) {
        // This is the first fractional placeholder - format entire fractional part
        result += fracStr;
        fracPrinted = true;
      }
      // Skip thousands separators as they're handled above
    }

    return result;
  }

  private formatCustomExponential(
    value: number,
    section: FormatSection,
  ): string {
    // Find exponent element
    let exponentElem: Element | undefined;
    for (const elem of section.elements) {
      if (elem.type === "exponent") {
        exponentElem = elem;
        break;
      }
    }

    if (!exponentElem) {
      return value.toString();
    }

    const exp = value === 0 ? 0 : Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exp);

    // Format mantissa using the format elements before 'E'
    const mantissaSection = { ...section };
    mantissaSection.elements = section.elements.filter(
      (e) => e.type !== "exponent",
    );

    let result = this.formatWithSection(mantissa, mantissaSection, true);

    // Add exponent
    const expChar = exponentElem.exponentCase === "upper" ? "E" : "e";
    const expSign = exp >= 0 ? "+" : "-";
    const absExp = Math.abs(exp);
    const expStr = absExp
      .toString()
      .padStart(exponentElem.exponentDigits || 1, "0");

    if (exponentElem.exponentSign === "+") {
      result += expChar + expSign + expStr;
    } else if (exponentElem.exponentSign === "-") {
      result += expChar + (exp < 0 ? "-" : "") + expStr;
    } else {
      result += expChar + expStr;
    }

    return result;
  }

  protected trimTrailingPadZeros(value: string): string {
    const decimal = this.localeSettings.decimalSeparator;
    const decimalIdx = value.indexOf(decimal);
    if (decimalIdx < 0) {
      return value;
    }

    let firstPadZeroIdx = -1;
    for (let idx = decimalIdx + 1; idx < value.length; idx += 1) {
      if (value[idx] !== "0") {
        firstPadZeroIdx = -1;
      } else if (firstPadZeroIdx < 0) {
        firstPadZeroIdx = idx;
      }
    }

    if (firstPadZeroIdx < 0) {
      return value;
    }

    if (firstPadZeroIdx === decimalIdx + 1) {
      return value.slice(0, decimalIdx);
    }

    return value.slice(0, firstPadZeroIdx);
  }

  hasExponentChar(value: string): boolean {
    return value.includes("E") || value.includes("e");
  }

  hasDecimalChar(value: string): boolean {
    return (
      value.includes(this.localeSettings.decimalSeparator) ||
      value.includes(".")
    );
  }

  hasDigitChar(value: string): boolean {
    return /\d/.test(value);
  }

  static tryHexToInt64(hex: string): Result<bigint> {
    const trimmed = hex.trim();
    if (
      trimmed.length === 0 ||
      trimmed.length > 16 ||
      !/^[0-9a-fA-F]+$/.test(trimmed)
    ) {
      return new Err("Invalid hex format");
    }

    try {
      return new Ok(BigInt(`0x${trimmed}`));
    } catch {
      return new Err("Invalid hex format");
    }
  }

  protected unstyleNumberString(
    value: string,
  ): Result<{ unstyled: string; negated: boolean }> {
    let unstyled = value;

    if (
      this.styles.has(DotNetNumberStyleId.AllowLeadingWhite) &&
      this.styles.has(DotNetNumberStyleId.AllowTrailingWhite)
    ) {
      unstyled = unstyled.trim();
    } else if (this.styles.has(DotNetNumberStyleId.AllowLeadingWhite)) {
      unstyled = unstyled.trimStart();
    } else if (this.styles.has(DotNetNumberStyleId.AllowTrailingWhite)) {
      unstyled = unstyled.trimEnd();
    }

    if (this.styles.has(DotNetNumberStyleId.AllowThousands)) {
      unstyled = unstyled.split(this.localeSettings.thousandSeparator).join("");
    }

    if (unstyled.length === 0) {
      return new Err("No digit character");
    }

    if (/^\s/.test(unstyled)) {
      return new Err("Unallowed leading whitespace characters");
    }

    if (/\s$/.test(unstyled)) {
      return new Err("Unallowed trailing whitespace characters");
    }

    if (
      this.styles.has(DotNetNumberStyleId.AllowCurrencySymbol) &&
      unstyled.startsWith(this.localeSettings.currencyString)
    ) {
      unstyled = unstyled.slice(this.localeSettings.currencyString.length);
    }

    if (unstyled.length === 0) {
      return new Err("No digit character");
    }

    let negated = false;
    if (
      this.styles.has(DotNetNumberStyleId.AllowParentheses) &&
      unstyled.startsWith("(") &&
      unstyled.endsWith(")")
    ) {
      unstyled = unstyled.slice(1, -1);
      negated = true;
    } else if (this.styles.has(DotNetNumberStyleId.AllowTrailingSign)) {
      if (unstyled.endsWith("+")) {
        unstyled = unstyled.slice(0, -1);
        negated = false;
      } else if (unstyled.endsWith("-")) {
        unstyled = unstyled.slice(0, -1);
        negated = true;
      }
    }

    if (unstyled.length === 0) {
      return new Err("No digit character");
    }

    return new Ok({ unstyled, negated });
  }
}

/** @public */
export class DotNetIntegerFormatter extends DotNetNumberFormatter {
  toString(value: bigint): string {
    if (this.format === "") {
      return value.toString();
    }
    return this.formatNumber(value, false);
  }

  tryFromString(strValue: string): Result<bigint> {
    const unstyled = this.unstyleNumberString(strValue);
    if (unstyled.isErr()) {
      return unstyled.createOuter("Invalid number format");
    }

    let { unstyled: text, negated } = unstyled.value;

    if (this.styles.has(DotNetNumberStyleId.AllowHexSpecifier)) {
      if (this.styles.has(DotNetNumberStyleId.AllowLeadingSign)) {
        if (text.startsWith("+")) {
          text = text.slice(1);
        } else if (text.startsWith("-")) {
          text = text.slice(1);
          negated = true;
        }
      }

      const hex = DotNetNumberFormatter.tryHexToInt64(text);
      if (hex.isErr()) {
        return hex.createOuter("Invalid hex format");
      }

      return new Ok(negated ? -hex.value : hex.value);
    }

    const hasLeadingSign = text.startsWith("+") || text.startsWith("-");
    if (
      !this.styles.has(DotNetNumberStyleId.AllowLeadingSign) &&
      hasLeadingSign
    ) {
      return new Err("Unallowed leading sign character");
    }

    const parseAsFloat =
      (this.styles.has(DotNetNumberStyleId.AllowExponent) &&
        this.hasExponentChar(text)) ||
      (this.styles.has(DotNetNumberStyleId.AllowDecimalPoint) &&
        this.hasDecimalChar(text));

    if (parseAsFloat) {
      const normalized = text.replace(
        this.localeSettings.decimalSeparator,
        ".",
      );
      const floatValue = Number.parseFloat(normalized);
      if (!Number.isFinite(floatValue)) {
        return new Err("Invalid float format (for Integer field)");
      }
      if (!Number.isInteger(floatValue)) {
        return new Err("Value has fractional component");
      }
      return new Ok(BigInt(floatValue));
    }

    if (!/^[+-]?\d+$/.test(text)) {
      return new Err("Invalid integer format");
    }

    try {
      const value = BigInt(text);
      return new Ok(negated ? -value : value);
    } catch {
      return new Err("Invalid integer format");
    }
  }
}

/** @public */
export class DotNetFloatFormatter extends DotNetNumberFormatter {
  toString(value: number): string {
    if (this.format === "") {
      return this.localeSettings.floatToStr(value);
    }
    return this.formatNumber(value, true);
  }

  tryFromString(strValue: string): Result<number> {
    const unstyled = this.unstyleNumberString(strValue);
    if (unstyled.isErr()) {
      return unstyled.createOuter("Invalid number format");
    }

    const { unstyled: text, negated } = unstyled.value;
    const hasLeadingSign = text.startsWith("+") || text.startsWith("-");

    if (
      !this.styles.has(DotNetNumberStyleId.AllowLeadingSign) &&
      hasLeadingSign
    ) {
      return new Err("Unallowed leading sign character");
    }
    if (
      !this.styles.has(DotNetNumberStyleId.AllowExponent) &&
      this.hasExponentChar(text)
    ) {
      return new Err("Unallowed exponent character");
    }
    if (
      !this.styles.has(DotNetNumberStyleId.AllowDecimalPoint) &&
      this.hasDecimalChar(text)
    ) {
      return new Err("Unallowed decimal point character");
    }
    if (!this.hasDigitChar(text)) {
      return new Err("No digit character");
    }

    const normalized = text.replace(this.localeSettings.decimalSeparator, ".");
    const parsed = Number.parseFloat(normalized);
    if (!Number.isFinite(parsed)) {
      return new Err("Invalid float format");
    }

    return new Ok(negated ? -parsed : parsed);
  }
}

/** @public */
export class DotNetDecimalFormatter extends DotNetNumberFormatter {
  toString(value: number): string {
    if (this.format === "") {
      return this.trimTrailingPadZeros(
        this.localeSettings.currToStrF(value, 18),
      );
    }
    return this.formatNumber(value, true);
  }

  tryFromString(strValue: string): Result<number> {
    const doubleFormatter = new DotNetFloatFormatter();
    doubleFormatter.styles = this.styles;
    doubleFormatter.localeSettings = this.localeSettings;

    const parsed = doubleFormatter.tryFromString(strValue);
    if (parsed.isErr()) {
      return parsed.createOuter(parsed.error.replace("float", "decimal"));
    }

    return parsed;
  }
}
