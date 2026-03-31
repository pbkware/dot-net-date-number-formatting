import { CommaText } from "./comma-text";

export enum DotNetDateTimeStyleId {
  AllowLeadingWhite = "AllowLeadingWhite",
  AllowTrailingWhite = "AllowTrailingWhite",
  AllowInnerWhite = "AllowInnerWhite",
  NoCurrentDateDefault = "NoCurrentDateDefault",
  AdjustToUniversal = "AdjustToUniversal",
  AssumeLocal = "AssumeLocal",
  AssumeUniversal = "AssumeUniversal",
  RoundTripKind = "RoundTripKind",
}

export type DotNetDateTimeStyleSet = Set<DotNetDateTimeStyleId>;

export const DotNetDateTimeStyles = {
  none: new Set<DotNetDateTimeStyleId>(),
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

export class DotNetDateTimeStylesInfo {
  static toString(styles: DotNetDateTimeStyleSet): string {
    return this.toXmlValue(styles);
  }

  static toXmlValue(styles: DotNetDateTimeStyleSet): string {
    if (isSameSet(styles, DotNetDateTimeStyles.allowWhiteSpaces)) {
      return "AllowWhiteSpaces";
    }
    return CommaText.from(Array.from(styles.values()));
  }

  static tryFromString(
    value: string,
  ): { success: true; styles: DotNetDateTimeStyleSet } | { success: false } {
    return this.tryFromXmlValue(value);
  }

  static tryFromXmlValue(
    value: string,
  ): { success: true; styles: DotNetDateTimeStyleSet } | { success: false } {
    const normalized = value.trim();
    if (normalized.length === 0 || normalized.toLowerCase() === "none") {
      return { success: true, styles: new Set(DotNetDateTimeStyles.none) };
    }
    if (normalized.toLowerCase() === "allowwhitespaces") {
      return {
        success: true,
        styles: new Set(DotNetDateTimeStyles.allowWhiteSpaces),
      };
    }

    const split = CommaText.to(normalized);
    if (!split.success) return { success: false };

    const styles = new Set<DotNetDateTimeStyleId>();
    for (const item of split.values) {
      const match = Object.values(DotNetDateTimeStyleId).find(
        (x) => x.toLowerCase() === item.toLowerCase(),
      );
      if (match === undefined) return { success: false };
      styles.add(match);
    }
    return { success: true, styles };
  }
}
