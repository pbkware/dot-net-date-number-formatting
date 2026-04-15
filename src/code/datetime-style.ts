import { CommaText, Err, Ok, Result } from "@pbkware/js-utils";

/** @public */
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

/** @public */
export type DotNetDateTimeStyleSet = Set<DotNetDateTimeStyleId>;

/** @internal */
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
