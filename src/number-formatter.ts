import {
  DotNetNumberStyleId,
  DotNetNumberStyleSet,
  DotNetNumberStyles,
} from "./dotnet-number-style";
import { FieldedTextLocaleSettings } from "./locale-settings";

type ParseResult<T> =
  | { success: true; value: T }
  | { success: false; errorText: string };

export class DotNetNumberFormatter {
  format = "";
  styles: DotNetNumberStyleSet = new Set(DotNetNumberStyles.number);
  localeSettings = FieldedTextLocaleSettings.current;
  parseErrorText = "";

  protected setParseErrorText(value: string): false {
    this.parseErrorText = value;
    return false;
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

  static tryHexToInt64(hex: string): ParseResult<bigint> {
    const trimmed = hex.trim();
    if (
      trimmed.length === 0 ||
      trimmed.length > 16 ||
      !/^[0-9a-fA-F]+$/.test(trimmed)
    ) {
      return { success: false, errorText: "Invalid hex format" };
    }

    try {
      return { success: true, value: BigInt(`0x${trimmed}`) };
    } catch {
      return { success: false, errorText: "Invalid hex format" };
    }
  }

  protected unstyleNumberString(
    value: string,
  ): ParseResult<{ unstyled: string; negated: boolean }> {
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
      return { success: false, errorText: "No digit character" };
    }

    if (/^\s/.test(unstyled)) {
      return {
        success: false,
        errorText: "Unallowed leading whitespace characters",
      };
    }

    if (/\s$/.test(unstyled)) {
      return {
        success: false,
        errorText: "Unallowed trailing whitespace characters",
      };
    }

    if (
      this.styles.has(DotNetNumberStyleId.AllowCurrencySymbol) &&
      unstyled.startsWith(this.localeSettings.currencyString)
    ) {
      unstyled = unstyled.slice(this.localeSettings.currencyString.length);
    }

    if (unstyled.length === 0) {
      return { success: false, errorText: "No digit character" };
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
      return { success: false, errorText: "No digit character" };
    }

    return { success: true, value: { unstyled, negated } };
  }
}

export class DotNetIntegerFormatter extends DotNetNumberFormatter {
  toString(value: bigint): string {
    return value.toString();
  }

  tryFromString(strValue: string): ParseResult<bigint> {
    const unstyled = this.unstyleNumberString(strValue);
    if (!unstyled.success) {
      return { success: false, errorText: unstyled.errorText };
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
      if (!hex.success) {
        return { success: false, errorText: "Invalid hex format" };
      }

      return { success: true, value: negated ? -hex.value : hex.value };
    }

    const hasLeadingSign = text.startsWith("+") || text.startsWith("-");
    if (
      !this.styles.has(DotNetNumberStyleId.AllowLeadingSign) &&
      hasLeadingSign
    ) {
      return { success: false, errorText: "Unallowed leading sign character" };
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
        return {
          success: false,
          errorText: "Invalid float format (for Integer field)",
        };
      }
      if (!Number.isInteger(floatValue)) {
        return { success: false, errorText: "Value has fractional component" };
      }
      return { success: true, value: BigInt(floatValue) };
    }

    if (!/^[+-]?\d+$/.test(text)) {
      return { success: false, errorText: "Invalid integer format" };
    }

    try {
      const value = BigInt(text);
      return { success: true, value: negated ? -value : value };
    } catch {
      return { success: false, errorText: "Invalid integer format" };
    }
  }
}

export class DotNetDoubleFormatter extends DotNetNumberFormatter {
  toString(value: number): string {
    return this.localeSettings.floatToStr(value);
  }

  tryFromString(strValue: string): ParseResult<number> {
    const unstyled = this.unstyleNumberString(strValue);
    if (!unstyled.success) {
      return { success: false, errorText: unstyled.errorText };
    }

    const { unstyled: text, negated } = unstyled.value;
    const hasLeadingSign = text.startsWith("+") || text.startsWith("-");

    if (
      !this.styles.has(DotNetNumberStyleId.AllowLeadingSign) &&
      hasLeadingSign
    ) {
      return { success: false, errorText: "Unallowed leading sign character" };
    }
    if (
      !this.styles.has(DotNetNumberStyleId.AllowExponent) &&
      this.hasExponentChar(text)
    ) {
      return { success: false, errorText: "Unallowed exponent character" };
    }
    if (
      !this.styles.has(DotNetNumberStyleId.AllowDecimalPoint) &&
      this.hasDecimalChar(text)
    ) {
      return { success: false, errorText: "Unallowed decimal point character" };
    }
    if (!this.hasDigitChar(text)) {
      return { success: false, errorText: "No digit character" };
    }

    const normalized = text.replace(this.localeSettings.decimalSeparator, ".");
    const parsed = Number.parseFloat(normalized);
    if (!Number.isFinite(parsed)) {
      return { success: false, errorText: "Invalid float format" };
    }

    return { success: true, value: negated ? -parsed : parsed };
  }
}

export class DotNetDecimalFormatter extends DotNetNumberFormatter {
  toString(value: number): string {
    return this.trimTrailingPadZeros(this.localeSettings.currToStrF(value, 18));
  }

  tryFromString(strValue: string): ParseResult<number> {
    const doubleFormatter = new DotNetDoubleFormatter();
    doubleFormatter.styles = this.styles;
    doubleFormatter.localeSettings = this.localeSettings;

    const parsed = doubleFormatter.tryFromString(strValue);
    if (!parsed.success) {
      return {
        success: false,
        errorText: parsed.errorText.replace("float", "decimal"),
      };
    }

    return parsed;
  }
}
