// Project: TFieldedText
// Licence: Public Domain
// Web Home Page: http://www.xilytix.com/FieldedTextComponent.html
// Initial Developer: Paul Klink (http://paul.klink.id.au)

unit Xilytix.FieldedText.DotNet;

interface

uses
  {$IFDEF MSWINDOWS}
  WinApi.Windows,
  {$ENDIF}
  System.Types,
  System.SysUtils;

{$ZEROBASEDSTRINGS ON}

type
  TFieldedTextLocaleSettings = record
  public
    const
      {$IFDEF MSWINDOWS}
      InvariantLocaleId = LOCALE_INVARIANT;
      {$ELSE}
      InvariantLocaleId = nil;
      {$ENDIF}

  strict private
    class var
      FInvariant: TFieldedTextLocaleSettings;
      FCurrent: TFieldedTextLocaleSettings;

    var
      FId: TLocaleID;
      FName: string;
      FSettings: TFormatSettings;

    class constructor Create;

    procedure SetId(Value: TLocaleID);
    procedure SetName(const Value: string);
  public
    class function Create(LocaleId: TLocaleID): TFieldedTextLocaleSettings; overload; static;
    class function Create(const MyName: string): TFieldedTextLocaleSettings; overload; static;
    class function CreateInvariant: TFieldedTextLocaleSettings; overload; static;
//    class function Create(const MySettings: TFormatSettings): TFieldedTextLocaleSettings; overload; static;
    procedure SetInvariant;

    property Id: TLocaleID read FId write SetId;
    property Name: string read FName write SetName;
    property Settings: TFormatSettings read FSettings;

    procedure Assign(Src: TFieldedTextLocaleSettings);

    function IntToStr(const Value: Integer): string; overload;
    function TryStrToInt(const StrValue: string; out IntValue: Integer): Boolean;
    function IntToStr(const Value: Int64): string; overload;
    function TryStrToInt64(const StrValue: string; out IntValue: Int64): Boolean;
    function CardinalToStr(const Value: Cardinal): string;
    function UInt64ToStr(const Value: UInt64): string;
    function FloatToStr(const Value: Double): string;
    function TryStrToFloat(const StrValue: string; out FloatValue: Double): Boolean;
    function CurrToStr(const Value: Currency): string;
    function TryStrToCurr(const StrValue: string; out CurrValue: Currency): Boolean;
    function CurrToStrF(const Value: Currency; Format: TFloatFormat; Digits: Integer): string;
    function DateToStr(const Value: TDateTime): string;
    function TryStrToDate(const StrValue: string; out DateValue: TDateTime): Boolean;
    function DateTimeToStr(const Value: TDateTime): string;
    function TryStrToDateTime(const StrValue: string; out DateTimeValue: TDateTime): Boolean;
    function BoolToStr(const Value: Boolean): string;
    function TryStrToBool(const StrValue: string; out BoolValue: Boolean): Boolean;

//    function CompareString(const Value1, Value2: string; IgnoreCase: Boolean = False): Integer;
//    function SameString(const Value1, Value2: string; IgnoreCase: Boolean = False): Boolean;

    class property Invariant: TFieldedTextLocaleSettings read FInvariant;
    class property Current: TFieldedTextLocaleSettings read FCurrent;
  end;

  TDotNetNumberStyle = record
  public
    type
      TId = (dnnsAllowCurrencySymbol,
             dnnsAllowDecimalPoint,
             dnnsAllowExponent,
             dnnsAllowHexSpecifier,
             dnnsAllowLeadingSign,
             dnnsAllowLeadingWhite,
             dnnsAllowParentheses,
             dnnsAllowThousands,
             dnnsAllowTrailingSign,
             dnnsAllowTrailingWhite);

      TIds = set of TId;

    const
      dnncNone = [];
      dnncAny = [dnnsAllowCurrencySymbol,
                 dnnsAllowDecimalPoint,
                 dnnsAllowExponent,
                 dnnsAllowLeadingSign,
                 dnnsAllowLeadingWhite,
                 dnnsAllowParentheses,
                 dnnsAllowThousands,
                 dnnsAllowTrailingSign,
                 dnnsAllowTrailingWhite];
      dnncCurrency = [dnnsAllowCurrencySymbol,
                      dnnsAllowDecimalPoint,
                      dnnsAllowLeadingSign,
                      dnnsAllowLeadingWhite,
                      dnnsAllowParentheses,
                      dnnsAllowThousands,
                      dnnsAllowTrailingSign,
                      dnnsAllowTrailingWhite];
      dnncFloat = [dnnsAllowLeadingWhite,
                   dnnsAllowTrailingWhite,
                   dnnsAllowLeadingSign,
                   dnnsAllowDecimalPoint,
                   dnnsAllowExponent];
      dnncHexNumber = [dnnsAllowLeadingWhite,
                       dnnsAllowTrailingWhite,
                       dnnsAllowHexSpecifier];
      dnncInteger = [dnnsAllowLeadingWhite,
                     dnnsAllowTrailingWhite,
                     dnnsAllowLeadingSign];
      dnncNumber = [dnnsAllowLeadingWhite,
                    dnnsAllowTrailingWhite,
                    dnnsAllowLeadingSign,
                    dnnsAllowTrailingSign,
                    dnnsAllowDecimalPoint,
                    dnnsAllowThousands];

  strict private
    type
      TInfo = record
        Id: TId;
        Name: string;
        XmlValue: string;
      end;
      TInfos = array[TId] of TInfo;

    const
      Infos: TInfos =
      (
        (Id: dnnsAllowCurrencySymbol; Name: 'AllowCurrencySymbol'; XmlValue: 'AllowCurrencySymbol'),
        (Id: dnnsAllowDecimalPoint; Name: 'AllowDecimalPoint'; XmlValue: 'AllowDecimalPoint'),
        (Id: dnnsAllowExponent; Name: 'AllowExponent'; XmlValue: 'AllowExponent'),
        (Id: dnnsAllowHexSpecifier; Name: 'AllowHexSpecifier'; XmlValue: 'AllowHexSpecifier'),
        (Id: dnnsAllowLeadingSign; Name: 'AllowLeadingSign'; XmlValue: 'AllowLeadingSign'),
        (Id: dnnsAllowLeadingWhite; Name: 'AllowLeadingWhite'; XmlValue: 'AllowLeadingWhite'),
        (Id: dnnsAllowParentheses; Name: 'AllowParentheses'; XmlValue: 'AllowParentheses'),
        (Id: dnnsAllowThousands; Name: 'AllowThousands'; XmlValue: 'AllowThousands'),
        (Id: dnnsAllowTrailingSign; Name: 'AllowTrailingSign'; XmlValue: 'AllowTrailingSign'),
        (Id: dnnsAllowTrailingWhite; Name: 'AllowTrailingWhite'; XmlValue: 'AllowTrailingWhite')
      );

    class constructor Create;

    class function GetCount: Integer; static;

  public
    class function IdToName(Value: TId): string; static;
    class function TryNameToId(const Name: string; out IdValue: TId): Boolean; static;

    class function IdToXmlValue(Value: TId): string; static;
    class function TryXmlValueToId(const XmlValue: string; out IdValue: TId): Boolean; static;

    class property Count: Integer read GetCount;
  end;

  TDotNetNumberStylesInfo = record
  strict private
    const
      XmlValue_None = 'None';
      XmlValue_Any = 'Any';
      XmlValue_Currency = 'Currency';
      XmlValue_Float = 'Float';
      XmlValue_HexNumber = 'HexNumber';
      XmlValue_Integer = 'Integer';
      XmlValue_Number = 'Number';
  public
    class function ToString(Value: TDotNetNumberStyle.TIds): string; static;
    class function TryFromString(const StrValue: string; out StylesValue: TDotNetNumberStyle.TIds): Boolean; static;

    class function ToXmlValue(const Value: TDotNetNumberStyle.TIds): string; static;
    class function TryFromXmlValue(XmlValue: string; out IdsValue: TDotNetNumberStyle.TIds): Boolean; overload; static;
    class function TryFromXmlValue(const XmlValue: string; const DefaultStylesValue: TDotNetNumberStyle.TIds;
                                   out StylesValue: TDotNetNumberStyle.TIds): Boolean; overload; static;
  end;

  TDotNetDateTimeStyle = record
  public
    type
      TId = (dndsAllowLeadingWhite,
             dndsAllowTrailingWhite,
             dndsAllowInnerWhite,
             dndsNoCurrentDateDefault,
             dndsAdjustToUniversal,
             dndsAssumeLocal,
             dndsAssumeUniversal,
             dndsRoundTripKind);
      TIds = set of TId;

    const
      dndcNone = [];
      dndcAllowWhiteSpaces = [dndsAllowLeadingWhite,
                              dndsAllowTrailingWhite,
                              dndsAllowInnerWhite];

  strict private
    type
      TInfo = record
        Id: TId;
        Name: string;
        XmlValue: string;
      end;
      TInfos = array[TId] of TInfo;

    const
      StyleRecs: TInfos =
      (
        (Id: dndsAllowLeadingWhite; Name: 'AllowLeadingWhite'; XmlValue: 'AllowLeadingWhite'),
        (Id: dndsAllowTrailingWhite; Name: 'AllowTrailingWhite'; XmlValue: 'AllowTrailingWhite'),
        (Id: dndsAllowInnerWhite; Name: 'AllowInnerWhite'; XmlValue: 'AllowInnerWhite'),
        (Id: dndsNoCurrentDateDefault; Name: 'NoCurrentDateDefault'; XmlValue: 'NoCurrentDateDefault'),
        (Id: dndsAdjustToUniversal; Name: 'AdjustToUniversal'; XmlValue: 'AdjustToUniversal'),
        (Id: dndsAssumeLocal; Name: 'AssumeLocal'; XmlValue: 'AssumeLocal'),
        (Id: dndsAssumeUniversal; Name: 'AssumeUniversal'; XmlValue: 'AssumeUniversal'),
        (Id: dndsRoundTripKind; Name: 'RoundTripKind'; XmlValue: 'RoundTripKind')
      );

    class constructor Create;

    class function GetCount: Integer; static;

  public
    class function ToName(Value: TId): string; static;
    class function TryFromName(const Name: string; out StyleValue: TId): Boolean; static;

    class function ToXmlValue(Value: TId): string; static;
    class function TryFromXmlValue(const XmlValue: string; out StyleValue: TId): Boolean; static;

    class property Count: Integer read GetCount;
  end;

  TDotNetDateTimeStylesInfo = record
  strict private
    const
      XmlValue_None = 'None';
      XmlValue_AllowWhiteSpaces = 'AllowWhiteSpaces';
  public
    class function ToString(Value: TDotNetDateTimeStyle.TIds): string; static;
    class function TryFromString(const StrValue: string; out StylesValue: TDotNetDateTimeStyle.TIds): Boolean; static;

    class function ToXmlValue(const Value: TDotNetDateTimeStyle.TIds): string; static;
    class function TryFromXmlValue(XmlValue: string; out StylesValue: TDotNetDateTimeStyle.TIds): Boolean; static;
  end;

  TDotNetNumberFormatter = class
  strict private
    var
      FFormat: string;
      FStyles: TDotNetNumberStyle.TIds;

  strict protected
    var
      FLocaleSettings: TFieldedTextLocaleSettings;
      FParseErrorText: string;

    function TrimTrailingPadZeros(const Value: string): string;

    function SetParseErrorText(const Value: string): Boolean;
    function UnstyleNumberString(const Value: string; out UnstyledStr: string; out Negated: Boolean): Boolean;
  public
    property Format: string read FFormat write FFormat;
    property Styles: TDotNetNumberStyle.TIds read FStyles write FStyles;
    property LocaleSettings: TFieldedTextLocaleSettings read FLocaleSettings write FLocaleSettings;

    property ParseErrorText: string read FParseErrorText;

    function HasExponentChar(const Value: string): Boolean;
    function HasDecimalChar(const Value: string): Boolean;
    function HasDigitChar(const Value: string): Boolean;

    class function TryHexToInt64(const Hex: string; out Value: Int64): Boolean;
  end;

  TDotNetIntegerFormatter = class(TDotNetNumberFormatter)
  public
    function TryFromString(const StrValue: string; out IntValue: Int64): Boolean;
    function ToString(const Value: Int64): string; reintroduce;
  end;

  TDotNetDoubleFormatter = class(TDotNetNumberFormatter)
  public
    function TryFromString(const StrValue: string; out DblValue: Double): Boolean;
    function ToString(const Value: Double): string; reintroduce;
  end;

  TDotNetDecimalFormatter = class(TDotNetNumberFormatter)
  public
    function TryFromString(const StrValue: string; out CurrValue: Currency): Boolean;
    function ToString(const Value: Currency): string; reintroduce;
  end;

  TDotNetDateTimeFormatter = class
  strict private
    const
      AsciiCharCount = 128;

    type
      TAmpm = (ampmNonSet, ampmAm, ampmPm);

      TToken = (ftShortDate, // d
                ftLongDate, // D
                ftFullDateTime_ShortTime, // f
                ftFullDateTime_LongTime, // F
                ftGeneralDateTime_ShortTime, // g
                ftGeneralDateTime_LongTime, // G
                ftMonthDay, // M m
                ftRoundTripDateTime, // O o
                ftRfc1123, // R r
                ftSortableDateTime, // s
                ftShortTime, // t
                ftLongTime, // T
                ftUniversalSortableDateTime, // u
                ftUniversalFullDateTime, // U
                ftYearMonth, // Y y
                // Custom
                ftDayOfMonth_NoLeading0, // d
                ftDayOfMonth_Leading0, // dd
                ftAbbreviatedNameOfDayOfWeek, // ddd
                ftFullNameOfDayOfWeek, // dddd
                ft10thOfSecond_Trailing0, // f
                ft100thOfSecond_Trailing0, // ff
                ft1000thOfSecond_Trailing0, // fff
                ft10000thOfSecond_Trailing0, // ffff
                ft100000thOfSecond_Trailing0, // fffff
                ft1000000thOfSecond_Trailing0, // ffffff
                ft10000000thOfSecond_Trailing0, // fffffff
                ft10thOfSecond_NoTrailing0, // F
                ft100thOfSecond_NoTrailing0, // FF
                ft1000thOfSecond_NoTrailing0, // FFF
                ft10000thOfSecond_NoTrailing0, // FFFF
                ft100000thOfSecond_NoTrailing0, // FFFFF
                ft1000000thOfSecond_NoTrailing0, // FFFFFF
                ft10000000thOfSecond_NoTrailing0, // FFFFFFF
                ftEra, // g gg
                ftHour_12_NoLeading0, // h
                ftHour_12_Leading0, // hh
                ftHour_24_NoLeading0, // H
                ftHour_24_Leading0, // HH
                ftTimeZoneInformation, // K
                ftMinute_NoLeading0, // m
                ftMinute_Leading0, // mm
                ftMonth_NoLeading0, // M
                ftMonth_Leading0, // MM
                ftAbbreviatedNameOfMonth, // MMM
                ftFullNameOfMonth, // MMMM
                ftSecond_NoLeading0, // s
                ftSecond_Leading0, // ss
                ftOneCharAmPmDesignator, // t
                ftAmPmDesignator, // tt
                ft2DigitYear_NoLeading0, // y
                ft2DigitYear_Leading0, // yy
                ft3DigitYear_Leading0, // yyy
                ft4DigitYear_Leading0, // yyyy
                ft5DigitYear_Leading0, // yyyyy
                ftHoursOffsetFromUtc_NoLeading0, // z
                ftHoursOffsetFromUtc_Leading0, // zz
                ftHoursMinutesOffsetFromUtc, // zzz
                ftTimeSeparator, // :
                ftDateSeparator, // /
                ftLiteral); // / ' " other

      TSpecifierSequence = (ssShortDateTime, // d
                            ssLongDateTime, // D
                            ssFullDateTime_ShortTime, // f
                            ssFullDateTime_LongTime, // F
                            ssGeneralDateTime_ShortTime, // g
                            ssGeneralDateTime_LongTime, // G
                            ssMonthDay, // M m
                            ssRoundTripDateTime, // O o
                            ssRfc1123, // R r
                            ssSortableDateTime, // s
                            ssShortTime, // t
                            ssLongTime, // T
                            ssUniversalSortableDateTime, // u
                            ssUniversalFullDateTime, // U
                            ssYearMonth, // Y y
                            // Custom
                            ssDay, // d
                            ssFractionOfSecond_Trailing0, // f
                            ssFractionOfSecond_NoTrailing0, // F
                            ssEra, // g gg
                            ssHour_12, // h
                            ssHour_24, // H
                            ssTimeZoneInformation, // K
                            ssMinute, // m
                            ssMonth, // M
                            ssSecond, // s
                            ssAmPmDesignator, // t
                            ssYear, // y
                            ssOffsetFromUtc, // z
                            ssTimeSeparator, // :
                            ssDateSeparator, // /
                            ssEnclosedLiteral, // " '
                            ssSingleCharLiteral, // \
                            ssSingleCharCustomFormat, // %
                            ssOtherChar);

      TFormatParseState = (cfpsOutOfSequence, cfpsEnclosedLiteral, cfpsSingleCharLiteral, cfpsInNonLiteralSequence);

      TTokenInfo = record
        Token: TToken;
        Standard: Boolean;
        SpecifierSequence: TSpecifierSequence;
        SpecifierLength: Integer;
      end;
      TTokenInfos = array[TToken] of TTokenInfo;

      TSpecifierSequenceInfo = record
        Sequence: TSpecifierSequence;
        Standard: Boolean;
        SpecifierChar: Char;
        UpperAndLowerCase: Boolean;
      end;
      TSpecifierSequenceInfos = array[TSpecifierSequence] of TSpecifierSequenceInfo;

      TSpecifierSequenceToTokenInfo = record
        const
          MaxTokenCount = 7;
        type
          TTokens = array[0..MaxTokenCount-1] of TToken;
        var
          Sequence: TSpecifierSequence;
          TokenCount: Integer;
          Tokens: TTokens;
      end;
      TSpecifierSequenceToTokenInfos = array[TSpecifierSequence] of TSpecifierSequenceToTokenInfo;

      TSpecifierCharInfo = record
        const
          MaxCharCount = 128;
        var
          SpecifierChar: Char;
          StandardSequence: TSpecifierSequence;
          CustomSequence: TSpecifierSequence;
        class function TryCharToIndex(const CharValue: Char; out Idx: Integer): Boolean; static;
      end;
      TSpecifierCharInfos = array[0..(TSpecifierCharInfo.MaxCharCount-1)] of TSpecifierCharInfo;

      TElement = record
        Token: TToken;
        Literal: string;
      end;
      TElements = array of TElement;

    const
      TokenInfos: TTokenInfos =
      (
        (Token: ftShortDate; Standard: True; SpecifierSequence: ssShortDateTime; SpecifierLength: 1),
        (Token: ftLongDate; Standard: True; SpecifierSequence: ssLongDateTime; SpecifierLength: 1),
        (Token: ftFullDateTime_ShortTime; Standard: True; SpecifierSequence: ssFullDateTime_ShortTime; SpecifierLength: 1),
        (Token: ftFullDateTime_LongTime; Standard: True; SpecifierSequence: ssFullDateTime_LongTime; SpecifierLength: 1),
        (Token: ftGeneralDateTime_ShortTime; Standard: True; SpecifierSequence: ssGeneralDateTime_ShortTime; SpecifierLength: 1),
        (Token: ftGeneralDateTime_LongTime; Standard: True; SpecifierSequence: ssGeneralDateTime_LongTime; SpecifierLength: 1),
        (Token: ftMonthDay; Standard: True; SpecifierSequence: ssMonthDay; SpecifierLength: 1),
        (Token: ftRoundTripDateTime; Standard: True; SpecifierSequence: ssRoundTripDateTime; SpecifierLength: 1),
        (Token: ftRfc1123; Standard: True; SpecifierSequence: ssRfc1123; SpecifierLength: 1),
        (Token: ftSortableDateTime; Standard: True; SpecifierSequence: ssSortableDateTime; SpecifierLength: 1),
        (Token: ftShortTime; Standard: True; SpecifierSequence: ssShortTime; SpecifierLength: 1),
        (Token: ftLongTime; Standard: True; SpecifierSequence: ssLongTime; SpecifierLength: 1),
        (Token: ftUniversalSortableDateTime; Standard: True; SpecifierSequence: ssUniversalSortableDateTime; SpecifierLength: 1),
        (Token: ftUniversalFullDateTime; Standard: True; SpecifierSequence: ssUniversalFullDateTime; SpecifierLength: 1),
        (Token: ftYearMonth; Standard: True; SpecifierSequence: ssYearMonth; SpecifierLength: 1),
        (Token: ftDayOfMonth_NoLeading0; Standard: False; SpecifierSequence: ssDay; SpecifierLength: 1), // d
        (Token: ftDayOfMonth_Leading0; Standard: False; SpecifierSequence: ssDay; SpecifierLength: 2), // dd
        (Token: ftAbbreviatedNameOfDayOfWeek; Standard: False; SpecifierSequence: ssDay; SpecifierLength: 3), // ddd
        (Token: ftFullNameOfDayOfWeek; Standard: False; SpecifierSequence: ssDay; SpecifierLength: 4), // dddd
        (Token: ft10thOfSecond_Trailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_Trailing0; SpecifierLength: 1), // f
        (Token: ft100thOfSecond_Trailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_Trailing0; SpecifierLength: 2), // ff
        (Token: ft1000thOfSecond_Trailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_Trailing0; SpecifierLength: 3), // fff
        (Token: ft10000thOfSecond_Trailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_Trailing0; SpecifierLength: 4), // ffff
        (Token: ft100000thOfSecond_Trailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_Trailing0; SpecifierLength: 5), // fffff
        (Token: ft1000000thOfSecond_Trailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_Trailing0; SpecifierLength: 6), // ffffff
        (Token: ft10000000thOfSecond_Trailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_Trailing0; SpecifierLength: 7), // fffffff
        (Token: ft10thOfSecond_NoTrailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_NoTrailing0; SpecifierLength: 1), // F
        (Token: ft100thOfSecond_NoTrailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_NoTrailing0; SpecifierLength: 2), // FF
        (Token: ft1000thOfSecond_NoTrailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_NoTrailing0; SpecifierLength: 3), // FFF
        (Token: ft10000thOfSecond_NoTrailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_NoTrailing0; SpecifierLength: 4), // FFFF
        (Token: ft100000thOfSecond_NoTrailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_NoTrailing0; SpecifierLength: 5), // FFFFF
        (Token: ft1000000thOfSecond_NoTrailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_NoTrailing0; SpecifierLength: 6), // FFFFFF
        (Token: ft10000000thOfSecond_NoTrailing0; Standard: False; SpecifierSequence: ssFractionOfSecond_NoTrailing0; SpecifierLength: 7), // FFFFFFF
        (Token: ftEra; Standard: False; SpecifierSequence: ssEra; SpecifierLength: 2), // g gg
        (Token: ftHour_12_NoLeading0; Standard: False; SpecifierSequence: ssHour_12; SpecifierLength: 1), // h
        (Token: ftHour_12_Leading0; Standard: False; SpecifierSequence: ssHour_12; SpecifierLength: 2), // hh
        (Token: ftHour_24_NoLeading0; Standard: False; SpecifierSequence: ssHour_24; SpecifierLength: 1), // H
        (Token: ftHour_24_Leading0; Standard: False; SpecifierSequence: ssHour_24; SpecifierLength: 2), // HH
        (Token: ftTimeZoneInformation; Standard: False; SpecifierSequence: ssTimeZoneInformation; SpecifierLength: 1), // K
        (Token: ftMinute_NoLeading0; Standard: False; SpecifierSequence: ssMinute; SpecifierLength: 1), // m
        (Token: ftMinute_Leading0; Standard: False; SpecifierSequence: ssMinute; SpecifierLength: 2), // mm
        (Token: ftMonth_NoLeading0; Standard: False; SpecifierSequence: ssMonth; SpecifierLength: 1), // M
        (Token: ftMonth_Leading0; Standard: False; SpecifierSequence: ssMonth; SpecifierLength: 2), // MM
        (Token: ftAbbreviatedNameOfMonth; Standard: False; SpecifierSequence: ssMonth; SpecifierLength: 3), // MMM
        (Token: ftFullNameOfMonth; Standard: False; SpecifierSequence: ssMonth; SpecifierLength: 4), // MMMM
        (Token: ftSecond_NoLeading0; Standard: False; SpecifierSequence: ssSecond; SpecifierLength: 1), // s
        (Token: ftSecond_Leading0; Standard: False; SpecifierSequence: ssSecond; SpecifierLength: 2), // ss
        (Token: ftOneCharAmPmDesignator; Standard: False; SpecifierSequence: ssAmPmDesignator; SpecifierLength: 1), // t
        (Token: ftAmPmDesignator; Standard: False; SpecifierSequence: ssAmPmDesignator; SpecifierLength: 2), // tt
        (Token: ft2DigitYear_NoLeading0; Standard: False; SpecifierSequence: ssYear; SpecifierLength: 1), // y
        (Token: ft2DigitYear_Leading0; Standard: False; SpecifierSequence: ssYear; SpecifierLength: 2), // yy
        (Token: ft3DigitYear_Leading0; Standard: False; SpecifierSequence: ssYear; SpecifierLength: 3), // yyy
        (Token: ft4DigitYear_Leading0; Standard: False; SpecifierSequence: ssYear; SpecifierLength: 4), // yyyy
        (Token: ft5DigitYear_Leading0; Standard: False; SpecifierSequence: ssYear; SpecifierLength: 5), // yyyyy
        (Token: ftHoursOffsetFromUtc_NoLeading0; Standard: False; SpecifierSequence: ssOffsetFromUtc; SpecifierLength: 1), // z
        (Token: ftHoursOffsetFromUtc_Leading0; Standard: False; SpecifierSequence: ssOffsetFromUtc; SpecifierLength: 2), // zz
        (Token: ftHoursMinutesOffsetFromUtc; Standard: False; SpecifierSequence: ssOffsetFromUtc; SpecifierLength: 3), // zzz
        (Token: ftTimeSeparator; Standard: False; SpecifierSequence: ssTimeSeparator; SpecifierLength: 1),
        (Token: ftDateSeparator; Standard: False; SpecifierSequence: ssDateSeparator; SpecifierLength: 1),
        (Token: ftLiteral; Standard: False; SpecifierSequence: ssEnclosedLiteral; SpecifierLength: 0)
      );

      SpecifierSequenceInfos: TSpecifierSequenceInfos =
      (
        (Sequence: ssShortDateTime; Standard: True; SpecifierChar: 'd'; UpperAndLowerCase: False),
        (Sequence: ssLongDateTime; Standard: True; SpecifierChar: 'D'; UpperAndLowerCase: False),
        (Sequence: ssFullDateTime_ShortTime; Standard: True; SpecifierChar: 'f'; UpperAndLowerCase: False),
        (Sequence: ssFullDateTime_LongTime; Standard: True; SpecifierChar: 'F'; UpperAndLowerCase: False),
        (Sequence: ssGeneralDateTime_ShortTime; Standard: True; SpecifierChar: 'g'; UpperAndLowerCase: False),
        (Sequence: ssGeneralDateTime_LongTime; Standard: True; SpecifierChar: 'G'; UpperAndLowerCase: False),
        (Sequence: ssMonthDay; Standard: True; SpecifierChar: 'M'; UpperAndLowerCase: True),
        (Sequence: ssRoundTripDateTime; Standard: True; SpecifierChar: 'O'; UpperAndLowerCase: True),
        (Sequence: ssRfc1123; Standard: True; SpecifierChar: 'R'; UpperAndLowerCase: True),
        (Sequence: ssSortableDateTime; Standard: True; SpecifierChar: 's'; UpperAndLowerCase: False),
        (Sequence: ssShortTime; Standard: True; SpecifierChar: 't'; UpperAndLowerCase: False),
        (Sequence: ssLongTime; Standard: True; SpecifierChar: 'T'; UpperAndLowerCase: False),
        (Sequence: ssUniversalSortableDateTime; Standard: True; SpecifierChar: 'u'; UpperAndLowerCase: False),
        (Sequence: ssUniversalFullDateTime; Standard: True; SpecifierChar: 'U'; UpperAndLowerCase: False),
        (Sequence: ssYearMonth; Standard: True; SpecifierChar: 'Y'; UpperAndLowerCase: True),
        // Custom
        (Sequence: ssDay; Standard: False; SpecifierChar: 'd'; UpperAndLowerCase: False),
        (Sequence: ssFractionOfSecond_Trailing0; Standard: False; SpecifierChar: 'f'; UpperAndLowerCase: False),
        (Sequence: ssFractionOfSecond_NoTrailing0; Standard: False; SpecifierChar: 'F'; UpperAndLowerCase: False),
        (Sequence: ssEra; Standard: False; SpecifierChar: 'g'; UpperAndLowerCase: False),
        (Sequence: ssHour_12; Standard: False; SpecifierChar: 'h'; UpperAndLowerCase: False),
        (Sequence: ssHour_24; Standard: False; SpecifierChar: 'H'; UpperAndLowerCase: False),
        (Sequence: ssTimeZoneInformation; Standard: False; SpecifierChar: 'K'; UpperAndLowerCase: False),
        (Sequence: ssMinute; Standard: False; SpecifierChar: 'm'; UpperAndLowerCase: False),
        (Sequence: ssMonth; Standard: False; SpecifierChar: 'M'; UpperAndLowerCase: False),
        (Sequence: ssSecond; Standard: False; SpecifierChar: 's'; UpperAndLowerCase: False),
        (Sequence: ssAmPmDesignator; Standard: False; SpecifierChar: 't'; UpperAndLowerCase: False),
        (Sequence: ssYear; Standard: False; SpecifierChar: 'y'; UpperAndLowerCase: False),
        (Sequence: ssOffsetFromUtc; Standard: False; SpecifierChar: 'z'; UpperAndLowerCase: False),
        (Sequence: ssTimeSeparator; Standard: False; SpecifierChar: ':'; UpperAndLowerCase: False),
        (Sequence: ssDateSeparator; Standard: False; SpecifierChar: '/'; UpperAndLowerCase: False),
        (Sequence: ssEnclosedLiteral; Standard: False; SpecifierChar: '"'; UpperAndLowerCase: False),
        (Sequence: ssSingleCharLiteral; Standard: False; SpecifierChar: '\'; UpperAndLowerCase: False),
        (Sequence: ssSingleCharCustomFormat; Standard: False; SpecifierChar: '%'; UpperAndLowerCase: False),
        (Sequence: ssOtherChar; Standard: False; SpecifierChar: '?'; UpperAndLowerCase: False)
      );

    class var
      FSpecifierCharInfos: TSpecifierCharInfos;
      FSpecifierSequenceToTokenInfos: TSpecifierSequenceToTokenInfos;
      FNoCurrentDateDefaultDate: TDateTime;

    var
      FFormat: string;
      FStyles: TDotNetDateTimeStyle.TIds;
      FLocaleSettings: TFieldedTextLocaleSettings;

      FFormatIsStandard: Boolean;
      FElements: TElements;

      FFormatParseErrorText: string;
      FFormatParseElements: TElements;
      FFormatParseElementCount: Integer;

      FCustomFormatParseState: TFormatParseState;
      FCustomFormatParseSequence: TSpecifierSequence;
      FCustomFormatParseSequenceLength: Integer;
      FCustomFormatParseEnclosedLiteralOpeningChar: Char;
      FCustomFormatParseLiteralBuilder: TStringBuilder;

      FParseStr: string;
      FParsePos: Integer;
      FParseYear, FParseMonth, FParseDay: Integer;
      FParseHour, FParseMin, FParseSec, FParseMSec: Integer;
      FParseHourIs12Hour: Boolean;
      FParseAmPm: TAmpm;
      FParseErrorText: string;

    class constructor Create;
    class procedure PrepareSpecifierCharInfos;
    class procedure PrepareSpecifierSequenceToTokenInfos;
    class function IntToSpecifierChar(Value: Integer): Char;
    class function TrySpecifierCharToInt(const CharValue: Char; out IntValue: Integer): Boolean;

    function TryParseStandardFormatChar(const FormatChar: Char): Boolean;
    function TryParseCustomFormatChar(const FormatChar: Char): Boolean; overload;
    function TryParseCustomFormatChar(const FormatChar: Char; Sequence: TSpecifierSequence): Boolean; overload;
    function TryParseFormat(const AFormat: string; out ParsedElements: TElements; out ErrorText: string): Boolean;

    procedure EnsureCustomFormatParseLiteralBuilderCreated;

    function AddParseFormatElement: Integer;
    procedure AddCustomFormatParseLiteral;
    function AddCustomFormatParseNonLiteralSequence(Sequence: TSpecifierSequence; SequenceLength: Integer): Boolean;

    function DateTimeToStandardFormattedStr(const Value: TDateTime): string;
    function DateTimeToCustomFormattedStr(const Value: TDateTime): string;

    function ParseElement(Elem: TElement): Boolean;
    function ConvertParse12HourTo24Hour: Boolean;
    function EncodeYearMonthDayHourMinSecMSec(out DateTimeValue: TDateTime): Boolean;

  public
    const
      UnsupportedStyles = [dndsAdjustToUniversal,
                           dndsAssumeLocal,
                           dndsAssumeUniversal,
                           dndsRoundTripKind];

    property Format: string read FFormat;
    property Styles: TDotNetDateTimeStyle.TIds read FStyles write FStyles;
    property LocaleSettings: TFieldedTextLocaleSettings read FLocaleSettings write FLocaleSettings;

    function TrySetFormat(const Value: string; out ErrorText: string): Boolean;

    function TryFromString(const StrValue: string; out DateTimeValue: TDateTime): Boolean;
    function ToString(const Value: TDateTime): string; reintroduce;

    property ParseErrorText: string read FParseErrorText;
  end;

implementation

uses
  System.Character,
  System.StrUtils,
  Xilytix.FieldedText.CommaText;

{ TFieldedTextLocaleSettings }

procedure TFieldedTextLocaleSettings.Assign(Src: TFieldedTextLocaleSettings);
begin
  FId := Src.Id;
  FName := Src.Name;
  FSettings := Src.Settings;
end;

procedure TFieldedTextLocaleSettings.SetInvariant;
begin
  FId := Invariant.Id;
  FName := Invariant.Name;
  FSettings := Invariant.Settings;
end;

procedure TFieldedTextLocaleSettings.SetName(const Value: string);
var
  Idx: Integer;
//  NameBuffer: array[LOCALE_NAME_MAX_LENGTH] of Char;
begin
  if Value = '' then
    SetId(InvariantLocaleId)
  else
  begin
    FName := Value;
    Idx := Languages.IndexOf(Value);
    SetId(Languages.LocaleID[Idx]);
  end;
end;

function TFieldedTextLocaleSettings.BoolToStr(const Value: Boolean): string;
begin
  Result := System.SysUtils.BoolToStr(Value);
end;

function TFieldedTextLocaleSettings.CardinalToStr(
  const Value: Cardinal): string;
begin
  Result := System.SysUtils.UIntToStr(Value);
end;

(*function TFieldedTextLocaleSettings.CompareString(const Value1, Value2: string;
  IgnoreCase: Boolean): Integer;
{$IFDEF MSWINDOWS}
var
  Flags: Cardinal;
{$ENDIF}
begin
  {$IFDEF MSWINDOWS}
  if IgnoreCase then
    Flags := NORM_IGNORECASE
  else
    Flags := 0;
  Result := WinApi.Windows.CompareString(FId, Flags, PChar(Value1), Length(Value1),
                                         PChar(Value2), Length(Value2)) - CSTR_EQUAL;
  {$ELSE}
  if IgnoreCase then
    Result := CompareText(Value1, Value2)
  else
    Result := CompareStr(Value1, Value2);
  {$ENDIF}
end;*)

class function TFieldedTextLocaleSettings.Create(
  const MyName: string): TFieldedTextLocaleSettings;
begin
  Result.Name := MyName;
end;

class function TFieldedTextLocaleSettings.CreateInvariant: TFieldedTextLocaleSettings;
begin
  Result := TFieldedTextLocaleSettings.Create(InvariantLocaleId);
end;

{class function TFieldedTextLocaleSettings.Create(
  const MySettings: TFormatSettings): TFieldedTextLocaleSettings;
begin
  Result.FId := LOCALE_CUSTOM_UNSPECIFIED;
  Result.FName := '?';
  Result.FSettings := MySettings;
end;}

function TFieldedTextLocaleSettings.TryStrToBool(const StrValue: string;
  out BoolValue: Boolean): Boolean;
begin
  Result := TryStrToBool(StrValue, BoolValue);
end;

function TFieldedTextLocaleSettings.TryStrToCurr(const StrValue: string;
  out CurrValue: Currency): Boolean;
begin
  Result := System.SysUtils.TryStrToCurr(StrValue, CurrValue, FSettings);
end;

function TFieldedTextLocaleSettings.TryStrToDate(const StrValue: string;
  out DateValue: TDateTime): Boolean;
begin
  Result := System.SysUtils.TryStrToDate(StrValue, DateValue, FSettings);
end;

function TFieldedTextLocaleSettings.TryStrToDateTime(const StrValue: string;
  out DateTimeValue: TDateTime): Boolean;
begin
  Result := System.SysUtils.TryStrToDateTime(StrValue, DateTimeValue, FSettings);
end;

function TFieldedTextLocaleSettings.TryStrToFloat(const StrValue: string;
  out FloatValue: Double): Boolean;
begin
  Result := System.SysUtils.TryStrToFloat(StrValue, FloatValue, FSettings);
end;

function TFieldedTextLocaleSettings.TryStrToInt(const StrValue: string;
  out IntValue: Integer): Boolean;
begin
  Result := System.SysUtils.TryStrToInt(StrValue, IntValue);
end;

function TFieldedTextLocaleSettings.TryStrToInt64(const StrValue: string;
  out IntValue: Int64): Boolean;
begin
  Result := System.SysUtils.TryStrToInt64(StrValue, IntValue);
end;

function TFieldedTextLocaleSettings.UInt64ToStr(
  const Value: UInt64): string;
begin
  Result := System.SysUtils.UIntToStr(Value);
end;

class function TFieldedTextLocaleSettings.Create(
  LocaleId: TLocaleID): TFieldedTextLocaleSettings;
begin
  Result.Id := LocaleId;
end;

class constructor TFieldedTextLocaleSettings.Create;
begin
  FInvariant := TFieldedTextLocaleSettings.CreateInvariant;
  FCurrent := TFieldedTextLocaleSettings.Create(TLanguages.UserDefaultLocale);
end;

function TFieldedTextLocaleSettings.CurrToStr(
  const Value: Currency): string;
begin
  Result := System.SysUtils.CurrToStr(Value, FSettings);
end;

function TFieldedTextLocaleSettings.CurrToStrF(const Value: Currency; Format: TFloatFormat; Digits: Integer): string;
begin
  Result := System.SysUtils.CurrToStrF(Value, Format, Digits, FSettings);
end;

function TFieldedTextLocaleSettings.DateTimeToStr(
  const Value: TDateTime): string;
begin
  Result := System.SysUtils.DateTimeToStr(Value, FSettings);
end;

function TFieldedTextLocaleSettings.DateToStr(
  const Value: TDateTime): string;
begin
  Result := System.SysUtils.DateToStr(Value, FSettings);
end;

function TFieldedTextLocaleSettings.FloatToStr(
  const Value: Double): string;
begin
  Result := System.SysUtils.FloatToStr(Value, FSettings);
end;

// converted to 0 based string
{class function TFieldedTextLocaleSettings.HexToByte(const value: string;
  idx: Integer): Byte;
var
  ResultAsInt: Integer;
begin
  if not TryHexToInt(Value.Substring(idx, 2), ResultAsInt) then
    raise EConvertError.Create('Invalid Byte Hex in string: "' + Value + '" at position: ' + System.SysUtils.IntToStr(Idx))
  else
    Result := Byte(ResultAsInt);
end;}

function TFieldedTextLocaleSettings.IntToStr(
  const Value: Int64): string;
begin
  Result := System.SysUtils.IntToStr(Value);
end;

function TFieldedTextLocaleSettings.IntToStr(
  const Value: Integer): string;
begin
  Result := System.SysUtils.IntToStr(Value);
end;

{function TFieldedTextLocaleSettings.SameString(const Value1, Value2: string;
  IgnoreCase: Boolean): Boolean;
begin
  Result := CompareString(Value1, Value2, IgnoreCase) = 0;
end;}

procedure TFieldedTextLocaleSettings.SetId(Value: TLocaleID);
begin
  FId := Value;
  if FId = InvariantLocaleId then
  begin
    FName := '';
    FSettings := TFormatSettings.Invariant;
  end
  else
  begin
    FName := Languages.NameFromLocaleID[FId];
    FSettings := TFormatSettings.Create(FId);
  end;
end;

{ TDotNetDateTimeStylesInfo }

class function TDotNetDateTimeStylesInfo.ToString(
  Value: TDotNetDateTimeStyle.TIds): string;
begin
  Result := ToXmlValue(Value); // Cheat since Name and XmlValue are the same
end;

class function TDotNetDateTimeStylesInfo.ToXmlValue(
  const Value: TDotNetDateTimeStyle.TIds): string;
var
  Style: TDotNetDateTimeStyle.TId;
  StyleXmlValues: TStringDynArray;
  Count: Integer;
begin
  if Value = TDotNetDateTimeStyle.dndcAllowWhiteSpaces then
    Result := XmlValue_AllowWhiteSpaces
  else
  begin
    Count := 0;
    SetLength(StyleXmlValues, TDotNetDateTimeStyle.Count);
    for Style in Value do
    begin
      StyleXmlValues[Count] := TDotNetDateTimeStyle.ToXmlValue(Style);
      Inc(Count);
    end;
    SetLength(StyleXmlValues, Count);

    Result := TCommaText.From(StyleXmlValues);
  end;
end;

class function TDotNetDateTimeStylesInfo.TryFromString(const StrValue: string;
  out StylesValue: TDotNetDateTimeStyle.TIds): Boolean;
begin
  Result := TryFromXmlValue(StrValue, StylesValue); // Cheat since Name and XmlValue are the same
end;

class function TDotNetDateTimeStylesInfo.TryFromXmlValue(
  XmlValue: string; out StylesValue: TDotNetDateTimeStyle.TIds): Boolean;
var
  I: Integer;
  StyleXmlValues: TStringDynArray;
  ErrorDescription: string;
  StyleXmlValue: TDotNetDateTimeStyle.TId;
begin
  XmlValue := Trim(xmlValue);
  if (XmlValue = '') or SameText(XmlValue, XmlValue_None) then
  begin
    StylesValue := TDotNetDateTimeStyle.dndcNone;
    Result := True
  end
  else
  begin
    if SameText(XmlValue, XmlValue_AllowWhiteSpaces) then
    begin
      StylesValue := TDotNetDateTimeStyle.dndcAllowWhiteSpaces;
      Result := True
    end
    else
    begin
      StylesValue := [];
      Result := TCommaText.&To(xmlValue, False, StyleXmlValues, ErrorDescription);
      if Result then
      begin
        for I := Low(StyleXmlValues) to High(StyleXmlValues) do
        begin
          if TDotNetDateTimeStyle.TryFromXmlValue(StyleXmlValues[I], StyleXmlValue) then
            Include(StylesValue, StyleXmlValue)
          else
          begin
            Result := False;
            Break;
          end;
        end;
      end;
    end;
  end;
end;

{ TDotNetDateTimeFormatter }

function TDotNetDateTimeFormatter.AddCustomFormatParseNonLiteralSequence(
  Sequence: TSpecifierSequence; SequenceLength: Integer): Boolean;
var
  Idx: Integer;
  SequenceTokenCount: Integer;
  Token: TToken;
begin
  SequenceTokenCount := FSpecifierSequenceToTokenInfos[Sequence].TokenCount;
  if SequenceLength > SequenceTokenCount then
  begin
    FFormatParseErrorText := 'Too many repeated successive characters in format.  Char: "' + SpecifierSequenceInfos[Sequence].SpecifierChar + '"  Maximum allowed: ' + IntToStr(SequenceTokenCount);
    Result := False;
  end
  else
  begin
    Token := FSpecifierSequenceToTokenInfos[Sequence].Tokens[SequenceLength-1];
    Idx := AddParseFormatElement;
    FFormatParseElements[Idx].Token := Token;
    Result := True;
  end;
end;

procedure TDotNetDateTimeFormatter.AddCustomFormatParseLiteral;
var
  Idx: Integer;
begin
  if FCustomFormatParseLiteralBuilder.Length > 0 then
  begin
    Idx := AddParseFormatElement;
    FFormatParseElements[Idx].Token := ftLiteral;
    FFormatParseElements[Idx].Literal := FCustomFormatParseLiteralBuilder.ToString;
  end;
  FreeAndNil(FCustomFormatParseLiteralBuilder);
end;

function TDotNetDateTimeFormatter.AddParseFormatElement: Integer;
begin
  Result := FFormatParseElementCount;
  Inc(FFormatParseElementCount);
  if FFormatParseElementCount > Length(FFormatParseElements) then
  begin
    SetLength(FFormatParseElements, FFormatParseElementCount + 50);
  end;
end;

function TDotNetDateTimeFormatter.ConvertParse12HourTo24Hour: Boolean;
begin
  if FParseHour = 12 then
  begin
    FParseHour := 0;
  end;

  case FParseAmPm of
    ampmNonSet:
    begin
      FParseErrorText := 'AM/PM not specified for Hour';
      Result := False;
    end;
    ampmAm:
    begin
      Result := True;
    end;
    ampmPm:
    begin
      Inc(FParseHour, 12);
      Result := True;
    end;
    else
    begin
      FParseErrorText := 'Unknown AmPm enumerator';
      Result := False;
      Assert(False, 'Unknown AmPm enumerator');
    end;
  end;
end;

class constructor TDotNetDateTimeFormatter.Create;
begin
  PrepareSpecifierCharInfos;
  PrepareSpecifierSequenceToTokenInfos;
  FNoCurrentDateDefaultDate := EncodeDate(1, 1, 1);
end;

function TDotNetDateTimeFormatter.DateTimeToCustomFormattedStr(
  const Value: TDateTime): string;
var
  I: Integer;
  Bldr: TStringBuilder;
  AppendStr: string;
  Year, Month, Day: Word;
  Year2: Integer;
  YearMonthDayDecoded: Boolean;
  Hour, Min, Sec, MSec: Word;
  Hour12: Integer;
  RoundedMSec: Integer;
  HourMinSecMSecDecoded: Boolean;

  procedure EnsureYearMonthDay;
  begin
    if not YearMonthDayDecoded then
    begin
      DecodeDate(Value, Year, Month, Day);
      YearMonthDayDecoded := True;
    end;
  end;

  procedure EnsureHourMinSecMSec;
  begin
    if not YearMonthDayDecoded then
    begin
      DecodeTime(Value, Hour, Min, Sec, MSec);
      HourMinSecMSecDecoded := True;
    end;
  end;

  procedure AppendFracOfSecondWithTrailing0(AppendLength: Integer);
  begin
    EnsureHourMinSecMSec;
    AppendStr := IntToStr(MSec);
    if Length(AppendStr) < 3 then
    begin
      Bldr.Append(StringOfChar('0', 3 - Length(AppendStr)));
    end;
    Bldr.Append(AppendStr);
    if AppendLength > 3 then
    begin
      Bldr.Append(StringOfChar('0', AppendLength - 3));
    end;
  end;

  procedure AppendFracOfSecondWithNoTrailing0;
  var
    I: Integer;
    AppendLength: Integer;
  begin
    EnsureHourMinSecMSec;
    if MSec <> 0 then
    begin
      AppendStr := IntToStr(MSec);
      if Length(AppendStr) < 3 then
      begin
        Bldr.Append(StringOfChar('0', 3 - Length(AppendStr)));
      end;

      AppendLength := Length(AppendStr);
      for I := High(AppendStr) downto Low(AppendStr) do
      begin
        if AppendStr[I] = '0' then
          Dec(AppendLength)
        else
          Break;
      end;
      if AppendLength < Length(AppendStr) then
      begin
        SetLength(AppendStr, AppendLength);
      end;
      Bldr.Append(AppendStr);
    end;
  end;

  procedure AppendYearWithLeading0(MinLength: Integer);
  begin
    EnsureYearMonthDay;
    AppendStr := IntToStr(Year);
    if Length(AppendStr) < MinLength then
    begin
      Bldr.Append(StringOfChar('0', MinLength - Length(AppendStr)));
    end;
    Bldr.Append(AppendStr);
  end;

begin
  Bldr := TStringBuilder.Create(250);
  try
    for I := Low(FElements) to High(FElements) do
    begin
      case FElements[I].Token of
        ftDayOfMonth_NoLeading0:
        begin
          EnsureYearMonthDay;
          Bldr.Append(IntToStr(Day));
        end;
        ftDayOfMonth_Leading0:
        begin
          EnsureYearMonthDay;
          AppendStr := IntToStr(Day);
          if Length(AppendStr) = 1 then
          begin
            Bldr.Append('0');
          end;
          Bldr.Append(AppendStr);
        end;
        ftAbbreviatedNameOfDayOfWeek: Bldr.Append(FormatDateTime('ddd', Value, FLocaleSettings.Settings));
        ftFullNameOfDayOfWeek: Bldr.Append(FormatDateTime('dddd', Value, FLocaleSettings.Settings));
        ft10thOfSecond_Trailing0:
        begin
          EnsureHourMinSecMSec;
          RoundedMSec := MSec div 100;
          AppendStr := IntToStr(RoundedMSec);
          Bldr.Append(AppendStr);
        end;
        ft100thOfSecond_Trailing0:
        begin
          EnsureHourMinSecMSec;
          RoundedMSec := MSec div 10;
          AppendStr := IntToStr(RoundedMSec);
          if Length(Result) = 1 then
          begin
            Bldr.Append('0');
          end;
          Bldr.Append(AppendStr);
        end;
        ft1000thOfSecond_Trailing0: AppendFracOfSecondWithTrailing0(3);
        ft10000thOfSecond_Trailing0: AppendFracOfSecondWithTrailing0(4);
        ft100000thOfSecond_Trailing0: AppendFracOfSecondWithTrailing0(5);
        ft1000000thOfSecond_Trailing0: AppendFracOfSecondWithTrailing0(6);
        ft10000000thOfSecond_Trailing0: AppendFracOfSecondWithTrailing0(7);
        ft10thOfSecond_NoTrailing0:
        begin
          EnsureHourMinSecMSec;
          RoundedMSec := MSec div 100;
          if RoundedMSec <> 0 then
          begin
            AppendStr := IntToStr(RoundedMSec);
            Bldr.Append(AppendStr);
          end;
        end;
        ft100thOfSecond_NoTrailing0:
        begin
          EnsureHourMinSecMSec;
          RoundedMSec := MSec div 10;
          if RoundedMSec <> 0 then
          begin
            AppendStr := IntToStr(RoundedMSec);
            if Length(Result) = 1 then
            begin
              Bldr.Append('0');
            end;
            Bldr.Append(AppendStr);
          end;
        end;
        ft1000thOfSecond_NoTrailing0,
        ft10000thOfSecond_NoTrailing0,
        ft100000thOfSecond_NoTrailing0,
        ft1000000thOfSecond_NoTrailing0,
        ft10000000thOfSecond_NoTrailing0: AppendFracOfSecondWithNoTrailing0;
        ftEra: Bldr.Append(FormatDateTime('g', Value, FLocaleSettings.Settings));
        ftHour_12_NoLeading0:
        begin
          EnsureHourMinSecMSec;
          Hour12 := Hour mod 12;
          if Hour12 = 0 then
          begin
            Hour12 := 12;
          end;
          AppendStr := IntToStr(Hour12);
          Bldr.Append(AppendStr);
        end;
        ftHour_12_Leading0:
        begin
          EnsureHourMinSecMSec;
          Hour12 := Hour mod 12;
          if Hour12 = 0 then
          begin
            Hour12 := 12;
          end;
          AppendStr := IntToStr(Hour12);
          if Length(AppendStr) = 1 then
          begin
            Bldr.Append('0');
          end;
          Bldr.Append(AppendStr);
        end;
        ftHour_24_NoLeading0:
        begin
          EnsureHourMinSecMSec;
          AppendStr := IntToStr(Hour);
          Bldr.Append(AppendStr);
        end;
        ftHour_24_Leading0:
        begin
          EnsureHourMinSecMSec;
          AppendStr := IntToStr(Hour);
          if Length(AppendStr) = 1 then
          begin
            Bldr.Append('0');
          end;
          Bldr.Append(AppendStr);
        end;
        ftTimeZoneInformation: Bldr.Append('?');
        ftMinute_NoLeading0:
        begin
          EnsureHourMinSecMSec;
          AppendStr := IntToStr(Min);
          Bldr.Append(AppendStr);
        end;
        ftMinute_Leading0:
        begin
          EnsureHourMinSecMSec;
          AppendStr := IntToStr(Min);
          if Length(AppendStr) = 1 then
          begin
            Bldr.Append('0');
          end;
          Bldr.Append(AppendStr);
        end;
        ftMonth_NoLeading0:
        begin
          EnsureYearMonthDay;
          AppendStr := IntToStr(Month);
          Bldr.Append(AppendStr);
        end;
        ftMonth_Leading0:
        begin
          EnsureYearMonthDay;
          AppendStr := IntToStr(Month);
          if Length(AppendStr) = 1 then
          begin
            Bldr.Append('0');
          end;
          Bldr.Append(AppendStr);
        end;
        ftAbbreviatedNameOfMonth:
        begin
          EnsureYearMonthDay;
          AppendStr := FormatDateTime('mmm', Value, FLocaleSettings.Settings);
          Bldr.Append(AppendStr);
        end;
        ftFullNameOfMonth:
        begin
          EnsureYearMonthDay;
          AppendStr := FormatDateTime('mmmm', Value, FLocaleSettings.Settings);
          Bldr.Append(AppendStr);
        end;
        ftSecond_NoLeading0:
        begin
          EnsureHourMinSecMSec;
          AppendStr := IntToStr(Sec);
          Bldr.Append(AppendStr);
        end;
        ftSecond_Leading0:
        begin
          EnsureHourMinSecMSec;
          AppendStr := IntToStr(Sec);
          if Length(AppendStr) = 1 then
          begin
            Bldr.Append('0');
          end;
          Bldr.Append(AppendStr);
        end;
        ftOneCharAmPmDesignator,
        ftAmPmDesignator: Bldr.Append(FormatDateTime('ampm', Value, FLocaleSettings.Settings));
        ft2DigitYear_NoLeading0:
        begin
          EnsureYearMonthDay;
          Year2 := Year mod 100;
          AppendStr := IntToStr(Year2);
          Bldr.Append(AppendStr);
        end;
        ft2DigitYear_Leading0:
        begin
          EnsureYearMonthDay;
          Year2 := Year mod 100;
          AppendStr := IntToStr(Year2);
          if Length(AppendStr) = 1 then
          begin
            Bldr.Append('0');
          end;
          Bldr.Append(AppendStr);
        end;
        ft3DigitYear_Leading0: AppendYearWithLeading0(3);
        ft4DigitYear_Leading0: AppendYearWithLeading0(4);
        ft5DigitYear_Leading0: AppendYearWithLeading0(5);
        ftHoursOffsetFromUtc_NoLeading0: Bldr.Append('?');
        ftHoursOffsetFromUtc_Leading0: Bldr.Append('?');
        ftHoursMinutesOffsetFromUtc: Bldr.Append('?');
        ftTimeSeparator: Bldr.Append(FLocaleSettings.Settings.TimeSeparator);
        ftDateSeparator: Bldr.Append(FLocaleSettings.Settings.DateSeparator);
        ftLiteral: Bldr.Append(FElements[I].Literal);
      end;
    end;

    Result := Bldr.ToString;
  finally
    Bldr.Free;
  end;
end;

function TDotNetDateTimeFormatter.DateTimeToStandardFormattedStr(
  const Value: TDateTime): string;
begin
  case FElements[0].Token of
    ftShortDate: Result := FormatDateTime(FLocaleSettings.Settings.ShortDateFormat, Value, FLocaleSettings.Settings);
    ftLongDate: Result := FormatDateTime(FLocaleSettings.Settings.LongDateFormat, Value, FLocaleSettings.Settings);
    ftFullDateTime_ShortTime: Result := FormatDateTime(FLocaleSettings.Settings.LongDateFormat, Value, FLocaleSettings.Settings) + ' ' +
                                        FormatDateTime(FLocaleSettings.Settings.ShortTimeFormat, Value, FLocaleSettings.Settings);
    ftFullDateTime_LongTime: Result := FormatDateTime(FLocaleSettings.Settings.LongDateFormat, Value, FLocaleSettings.Settings) + ' ' +
                                       FormatDateTime(FLocaleSettings.Settings.LongTimeFormat, Value, FLocaleSettings.Settings);
    ftGeneralDateTime_ShortTime: Result := FormatDateTime(FLocaleSettings.Settings.ShortDateFormat, Value, FLocaleSettings.Settings) + ' ' +
                                           FormatDateTime(FLocaleSettings.Settings.ShortTimeFormat, Value, FLocaleSettings.Settings);
    ftGeneralDateTime_LongTime: Result := FormatDateTime(FLocaleSettings.Settings.ShortDateFormat, Value, FLocaleSettings.Settings) + ' ' +
                                          FormatDateTime(FLocaleSettings.Settings.LongTimeFormat, Value, FLocaleSettings.Settings);
    ftMonthDay: Result := FormatDateTime('mmmm d', Value, FLocaleSettings.Settings);
    ftRoundTripDateTime: Result := FormatDateTime('yyyy-mm-dd"T"hh":"nn":"ss"."zzz"0000"', Value, FLocaleSettings.Settings);
    ftRfc1123: Result := '?';
    ftSortableDateTime: Result := FormatDateTime('yyyy-mm-dd"T"hh":"nn":"ss', Value, FLocaleSettings.Settings);
    ftShortTime: Result := FormatDateTime(FLocaleSettings.Settings.ShortTimeFormat, Value, FLocaleSettings.Settings);
    ftLongTime: Result := FormatDateTime(FLocaleSettings.Settings.LongTimeFormat, Value, FLocaleSettings.Settings);
    ftUniversalSortableDateTime: Result := '?';
    ftUniversalFullDateTime: Result := '?';
    ftYearMonth: Result := FormatDateTime('yyyy mmmm', Value, FLocaleSettings.Settings);
    else Result := '?';
  end;
end;

function TDotNetDateTimeFormatter.ToString(const Value: TDateTime): string;
begin
  if FFormatIsStandard then
    Result := DateTimeToStandardFormattedStr(Value)
  else
    Result := DateTimeToCustomFormattedStr(Value);
end;

function TDotNetDateTimeFormatter.EncodeYearMonthDayHourMinSecMSec(
  out DateTimeValue: TDateTime): Boolean;
var
  GotTime: Boolean;
  TimeValue: TDateTime;
  DateValue: TDateTime;
begin
  GotTime := ((FParseHour <> 0) or (FParseMin <> 0) or (FParseSec <> 0) or (FParseMSec <> 0));
  if not GotTime then
    Result := True
  else
  begin
    if TryEncodeTime(FParseHour, FParseMin, FParseSec, FParseMSec, TimeValue) then
      Result := True
    else
    begin
      FParseErrorText := 'Hour, Minute, Second or Fractional Second is invalid';
      Result := False;
    end;
  end;

  if Result then
  begin
    if (FParseYear < 0) and (FParseMonth < 0) and (FParseDay < 0) then
    begin
      if not GotTime then
      begin
        FParseErrorText := 'Date and Time not specified in DateTime string';
        Result := False;
      end
      else
      begin
        if dndsNoCurrentDateDefault in FStyles then
          DateTimeValue := FNoCurrentDateDefaultDate + TimeValue
        else
          DateTimeValue := System.SysUtils.Date + TimeValue;
        Result := True;
      end;
    end
    else
    begin
      if (FParseYear < 0) or (FParseMonth < 0) or (FParseDay < 0) then
      begin
        DateTimeValue := 0.0; // avoid compiler warning
        FParseErrorText := 'Year, Month or Day not specified in DateTime string';
        Result := False;
      end
      else
      begin
        if not TryEncodeDate(FParseYear, FParseMonth, FParseDay, DateValue) then
        begin
          FParseErrorText := 'Year, Month or Day is invalid';
          Result := False;
        end
        else
        begin
          if GotTime then
            DateTimeValue := DateValue + TimeValue
          else
            DateTimeValue := DateValue;
          Result := True
        end;
      end;
    end;
  end;
end;

procedure TDotNetDateTimeFormatter.EnsureCustomFormatParseLiteralBuilderCreated;
begin
  if not Assigned(FCustomFormatParseLiteralBuilder) then
  begin
    FCustomFormatParseLiteralBuilder := TStringBuilder.Create(250);
  end;
end;

class function TDotNetDateTimeFormatter.IntToSpecifierChar(
  Value: Integer): Char;
begin
  Result := Char(Value);
end;

function TDotNetDateTimeFormatter.ParseElement(Elem: TElement): Boolean;
var
  I: Integer;
  PtrPos: PChar;
  ElemStr: string;
  ElemLen: Integer;
  ADate: TDateTime;
  ATime: TDateTime;
  IntValue: Integer;
  YearWord, MonthWord, DayWord: Word;
  HourWord, MinWord, SecWord, MSecWord: Word;

  function Try1CharStrToInt(out Value: Integer): Boolean;
  begin
    ElemStr := FParseStr[FParsePos];
    if not TryStrToInt(ElemStr, Value) then
      Result := False
    else
    begin
      Inc(FParsePos);
      Result := True;
    end;
  end;

  function Try1or2CharStrToInt(out Value: Integer): Boolean;
  begin
    if not FParseStr[FParsePos].IsDigit then
      Result := False
    else
    begin
      if FParsePos = (Length(FParseStr) - 1) then
        ElemLen := 1
      else
      begin
        if FParseStr[FParsePos + 1].IsDigit then
          ElemLen := 2
        else
          ElemLen := 1;
      end;

      ElemStr := FParseStr.Substring(FParsePos, ElemLen);

      if not TryStrToInt(ElemStr, Value) then
        Result := False
      else
      begin
        Inc(FParsePos, ElemLen);
        Result := True;
      end;
    end;
  end;

  function Try2CharStrToInt(out Value: Integer): Boolean;
  begin
    ElemStr := FParseStr.Substring(FParsePos, 2);

    if not TryStrToInt(ElemStr, Value) then
      Result := False
    else
    begin
      Inc(FParsePos, 2);
      Result := True;
    end;
  end;

  function TryNCharStrToInt(CharCount: Integer; out Value: Integer): Boolean;
  begin
    if (FParsePos + CharCount - 1) >= Length(FParseStr) then
      Result := False
    else
    begin
      ElemStr := FParseStr.Substring(FParsePos, CharCount);
      if not TryStrToInt(ElemStr, Value) then
        Result := False
      else
      begin
        Inc(FParsePos, CharCount);
        Result := True;
      end;
    end;
  end;

  function TryUpToNCharStrToInt(MaxCharCount: Integer; out Value: Integer): Boolean;
  var
    ElemCharIdx: Integer;
    DigitCount: Integer;
  begin
    if not FParseStr[FParsePos].IsDigit then
      Result := False
    else
    begin
      DigitCount := MaxCharCount;
      for ElemCharIdx := 1 to MaxCharCount-1 do
      begin
        if not FParseStr[FParsePos + ElemCharIdx].IsDigit then
        begin
          DigitCount := ElemCharIdx;
          Break;
        end;
      end;

      ElemStr := FParseStr.Substring(FParsePos, DigitCount);
      Result := TryStrToInt(ElemStr, Value);

      Inc(FParsePos, DigitCount);
    end;
  end;

  function TrySetHour12(const Value: Integer): Boolean;
  begin
    if Value > 12 then
    begin
      FParseErrorText := 'Invalue 12 Hour value';
      Result := False;
    end
    else
    begin
      FParseHour := IntValue;
      FParseHourIs12Hour := True;
      Result := True;
    end;
  end;

begin
  case Elem.Token of
    ftShortDate:
    begin
      Result := System.SysUtils.TryStrToDate(FParseStr, ADate);
      if not Result then
        FParseErrorText := 'Invalid Date string'
      else
      begin
        DecodeDate(ADate, YearWord, MonthWord, DayWord);
        FParseYear := YearWord;
        FParseMonth := MonthWord;
        FParseDay := DayWord;
      end;
    end;
    ftLongDate:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftFullDateTime_ShortTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftFullDateTime_LongTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftGeneralDateTime_ShortTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftGeneralDateTime_LongTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftMonthDay:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftRoundTripDateTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftRfc1123:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftSortableDateTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftShortTime:
    begin
      Result := System.SysUtils.TryStrToTime(FParseStr, ATime);
      if not Result then
        FParseErrorText := 'Invalid Date string'
      else
      begin
        DecodeTime(ATime, HourWord, MinWord, SecWord, MSecWord);
        FParseHour := HourWord;
        FParseMin := MinWord;
        FParseSec := SecWord;
        FParseMSec := MSecWord;
      end;
    end;
    ftLongTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftUniversalSortableDateTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftUniversalFullDateTime:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftYearMonth:
    begin
      FParseErrorText := 'LongDate DateTime Format specifier not supported';
      Result := False;
    end;
    ftDayOfMonth_NoLeading0:
    begin
      Result := Try1or2CharStrToInt(IntValue);
      if Result then
        FParseDay := IntValue
      else
        FParseErrorText := 'Day is invalid';
    end;
    ftDayOfMonth_Leading0:
    begin
      Result := Try2CharStrToInt(IntValue);
      if Result then
        FParseDay := IntValue
      else
        FParseErrorText := 'Day is invalid';
    end;
    ftAbbreviatedNameOfDayOfWeek:
    begin
      Result := False;
      PtrPos := @(FParseStr[FParsePos]);
      for I := Low(FLocaleSettings.Settings.ShortDayNames) to High(FLocaleSettings.Settings.ShortDayNames) do
      begin
        ElemLen := Length(FLocaleSettings.Settings.ShortDayNames[I]);
        if StrLIComp(PChar(FLocaleSettings.Settings.ShortDayNames[I]), PtrPos, ElemLen) = 0 then
        begin
          Inc(FParsePos, ElemLen);
          Result := True;
          Break;
        end;
      end;
    end;
    ftFullNameOfDayOfWeek:
    begin
      Result := False;
      PtrPos := @(FParseStr[FParsePos]);
      for I := Low(FLocaleSettings.Settings.LongDayNames) to High(FLocaleSettings.Settings.LongDayNames) do
      begin
        ElemLen := Length(FLocaleSettings.Settings.LongDayNames[I]);
        if StrLIComp(PChar(FLocaleSettings.Settings.LongDayNames[I]), PtrPos, ElemLen) = 0 then
        begin
          Inc(FParsePos, ElemLen);
          Result := True;
          Break;
        end;
      end;
    end;
    ft10thOfSecond_Trailing0:
    begin
      Result := Try1CharStrToInt(IntValue);
      if Result then
      begin
        FParseMSec := IntValue * 100;
      end;
    end;
    ft100thOfSecond_Trailing0:
    begin
      Result := TryNCharStrToInt(2, IntValue);
      if Result then
      begin
        FParseMSec := IntValue * 10;
      end;
    end;
    ft1000thOfSecond_Trailing0:
    begin
      Result := TryNCharStrToInt(3, IntValue);
      if Result then
      begin
        FParseMSec := IntValue;
      end;
    end;
    ft10000thOfSecond_Trailing0:
    begin
      Result := TryNCharStrToInt(4, IntValue);
      if Result then
      begin
        FParseMSec := IntValue div 10;
      end;
    end;
    ft100000thOfSecond_Trailing0:
    begin
      Result := TryNCharStrToInt(5, IntValue);
      if Result then
      begin
        FParseMSec := IntValue div 100;
      end;
    end;
    ft1000000thOfSecond_Trailing0:
    begin
      Result := TryNCharStrToInt(6, IntValue);
      if Result then
      begin
        FParseMSec := IntValue div 1000;
      end;
    end;
    ft10000000thOfSecond_Trailing0:
    begin
      Result := TryNCharStrToInt(7, IntValue);
      if Result then
      begin
        FParseMSec := IntValue div 10000;
      end;
    end;
    ft10thOfSecond_NoTrailing0:
    begin
      if Try1CharStrToInt(IntValue) then
        FParseMSec := IntValue * 100
      else
        FParseMSec := 0;

      Result := True;
    end;
    ft100thOfSecond_NoTrailing0:
    begin
      if Try1or2CharStrToInt(IntValue) then
        FParseMSec := IntValue * 10
      else
        FParseMSec := 0;

      Result := True;
    end;
    ft1000thOfSecond_NoTrailing0:
    begin
      if TryUpToNCharStrToInt(3, IntValue) then
        FParseMSec := IntValue
      else
        FParseMSec := 0;

      Result := True;
    end;
    ft10000thOfSecond_NoTrailing0:
    begin
      if TryUpToNCharStrToInt(4, IntValue) then
        FParseMSec := IntValue div 10
      else
        FParseMSec := 0;

      Result := True;
    end;
    ft100000thOfSecond_NoTrailing0:
    begin
      if TryUpToNCharStrToInt(5, IntValue) then
        FParseMSec := IntValue div 100
      else
        FParseMSec := 0;

      Result := True;
    end;
    ft1000000thOfSecond_NoTrailing0:
    begin
      if TryUpToNCharStrToInt(6, IntValue) then
        FParseMSec := IntValue div 1000
      else
        FParseMSec := 0;

      Result := True;
    end;
    ft10000000thOfSecond_NoTrailing0:
    begin
      if TryUpToNCharStrToInt(7, IntValue) then
        FParseMSec := IntValue div 10000
      else
        FParseMSec := 0;

      Result := True;
    end;
    ftEra:
    begin
      FParseErrorText := 'Era DateTime Format specifier not supported';
      Result := False;
    end;
    ftHour_12_NoLeading0:
    begin
      Result := Try1or2CharStrToInt(IntValue);
      if Result then
        Result := TrySetHour12(IntValue)
      else
        FParseErrorText := 'Hour is invalid';
    end;
    ftHour_12_Leading0:
    begin
      Result := Try2CharStrToInt(IntValue);
      if Result then
        Result := TrySetHour12(IntValue)
      else
        FParseErrorText := 'Hour is invalid';
    end;
    ftHour_24_NoLeading0:
    begin
      Result := Try1or2CharStrToInt(IntValue);
      if Result then
      begin
        FParseHour := IntValue;
        FParseHourIs12Hour := False;
      end
      else
      begin
        FParseErrorText := 'Hour is invalid';
      end;
    end;
    ftHour_24_Leading0:
    begin
      Result := Try2CharStrToInt(IntValue);
      if Result then
      begin
        FParseHour := IntValue;
        FParseHourIs12Hour := False;
      end
      else
      begin
        FParseErrorText := 'Hour is invalid';
      end;
    end;
    ftTimeZoneInformation:
    begin
      FParseErrorText := 'TimeZoneInformation DateTime Format specifier not supported';
      Result := False;
    end;
    ftMinute_NoLeading0:
    begin
      Result := Try1or2CharStrToInt(IntValue);
      if Result then
        FParseMin := IntValue
      else
        FParseErrorText := 'Minute is invalid';
    end;
    ftMinute_Leading0:
    begin
      Result := Try2CharStrToInt(IntValue);
      if Result then
        FParseMin := IntValue
      else
        FParseErrorText := 'Minute is invalid';
    end;
    ftMonth_NoLeading0:
    begin
      Result := Try1or2CharStrToInt(IntValue);
      if Result then
        FParseMonth := IntValue
      else
        FParseErrorText := 'Month is invalid';
    end;
    ftMonth_Leading0:
    begin
      Result := Try2CharStrToInt(IntValue);
      if Result then
        FParseMonth := IntValue
      else
        FParseErrorText := 'Month is invalid';
    end;
    ftAbbreviatedNameOfMonth:
    begin
      Result := False;
      PtrPos := @(FParseStr[FParsePos]);
      for I := Low(FLocaleSettings.Settings.ShortMonthNames) to High(FLocaleSettings.Settings.ShortMonthNames) do
      begin
        ElemLen := Length(FLocaleSettings.Settings.ShortMonthNames[I]);
        if StrLIComp(PChar(FLocaleSettings.Settings.ShortMonthNames[I]), PtrPos, ElemLen) = 0 then
        begin
          Inc(FParsePos, ElemLen);
          FParseMonth := I;
          Result := True;
          Break;
        end;
      end;
    end;
    ftFullNameOfMonth:
    begin
      Result := False;
      PtrPos := @(FParseStr[FParsePos]);
      for I := Low(FLocaleSettings.Settings.LongMonthNames) to High(FLocaleSettings.Settings.LongMonthNames) do
      begin
        ElemLen := Length(FLocaleSettings.Settings.LongMonthNames[I]);
        if StrLIComp(PChar(FLocaleSettings.Settings.LongMonthNames[I]), PtrPos, ElemLen) = 0 then
        begin
          Inc(FParsePos, ElemLen);
          FParseMonth := I;
          Result := True;
          Break;
        end;
      end;
    end;
    ftSecond_NoLeading0:
    begin
      Result := Try1or2CharStrToInt(IntValue);
      if Result then
        FParseSec := IntValue
      else
        FParseErrorText := 'Second is invalid';
    end;
    ftSecond_Leading0:
    begin
      Result := Try2CharStrToInt(IntValue);
      if Result then
        FParseSec := IntValue
      else
        FParseErrorText := 'Second is invalid';
    end;
    ftOneCharAmPmDesignator:
    begin
      // assumes 'A' or 'P' - should be internationalised
      if FParseStr[FParsePos].ToUpper = 'A' then
      begin
        FParseAmPm := ampmAm;
        Inc(FParsePos);
        Result := True;
      end
      else
      begin
        if FParseStr[FParsePos].ToUpper = 'P' then
        begin
          FParseAmPm := ampmPm;
          Inc(FParsePos);
          Result := True;
        end
        else
        begin
          FParseErrorText := 'One Character AM/PM is invalid';
          Result := False;
        end;
      end;
    end;
    ftAmPmDesignator:
    begin
      // assumes 'AM' or 'PM' - should be internationalised
      ElemStr := FParseStr.Substring(FParsePos, 2);
      if CompareText(ElemStr, 'AM') = 0 then
      begin
        FParseAmPm := ampmAm;
        Inc(FParsePos);
        Result := True;
      end
      else
      begin
        if CompareText(ElemStr, 'PM') = 0 then
        begin
          FParseAmPm := ampmPm;
          Inc(FParsePos);
          Result := True;
        end
        else
        begin
          FParseErrorText := 'AM/PM is invalid';
          Result := False;
        end;
      end;
    end;
    ft2DigitYear_NoLeading0:
    begin
      Result := Try1or2CharStrToInt(IntValue);
      if Result then
        FParseYear := IntValue
      else
        FParseErrorText := 'Year is invalid';
    end;
    ft2DigitYear_Leading0:
    begin
      Result := Try2CharStrToInt(IntValue);
      if Result then
        FParseYear := IntValue
      else
        FParseErrorText := 'Year is invalid';
    end;
    ft3DigitYear_Leading0:
    begin
      Result := TryNCharStrToInt(3, IntValue);
      if Result then
        FParseYear := IntValue
      else
        FParseErrorText := 'Year is invalid';
    end;
    ft4DigitYear_Leading0:
    begin
      Result := TryNCharStrToInt(4, IntValue);
      if Result then
        FParseYear := IntValue
      else
        FParseErrorText := 'Year is invalid';
    end;
    ft5DigitYear_Leading0:
    begin
      Result := TryNCharStrToInt(5, IntValue);
      if Result then
        FParseYear := IntValue
      else
        FParseErrorText := 'Year is invalid';
    end;
    ftHoursOffsetFromUtc_NoLeading0:
    begin
      FParseErrorText := 'Hours Offset From UTC DateTime Format specifier not supported';
      Result := False;
    end;
    ftHoursOffsetFromUtc_Leading0:
    begin
      FParseErrorText := 'Hours Offset From UTC DateTime Format specifier not supported';
      Result := False;
    end;
    ftHoursMinutesOffsetFromUtc:
    begin
      FParseErrorText := 'Hours/Minutes Offset From UTC DateTime Format specifier not supported';
      Result := False;
    end;
    ftTimeSeparator:
    begin
      Result := FParseStr[FParsePos] = FLocaleSettings.Settings.TimeSeparator;
      if Result then
      begin
        Inc(FParsePos);
      end;
    end;
    ftDateSeparator:
    begin
      Result := FParseStr[FParsePos] = FLocaleSettings.Settings.DateSeparator;
      if Result then
      begin
        Inc(FParsePos);
      end;
    end;
    ftLiteral:
    begin
      PtrPos := @(FParseStr[FParsePos]);
      ElemLen := Length(Elem.Literal);
      Result := StrLIComp(PChar(Elem.Literal), PtrPos, ElemLen) = 0;
      if Result then
      begin
        Inc(FParsePos, ElemLen);
      end;
    end;
    else
    begin
      FParseErrorText := 'Unknown DateTime Specifier';
      Result := False;
    end;
  end;
end;

class procedure TDotNetDateTimeFormatter.PrepareSpecifierCharInfos;
var
  I: Integer;
  Sequence: TSpecifierSequence;

  procedure AddToInfos(ASequence: TSpecifierSequence; Standard: Boolean; AChar: Char); overload;
  var
    Idx: Integer;
  begin
    if not TrySpecifierCharToInt(AChar, Idx) then
      raise Exception.Create('Invalid Specifier Sequence Character') // assert
    else
    begin
      FSpecifierCharInfos[Idx].SpecifierChar := AChar;
      if Standard then
        FSpecifierCharInfos[Idx].StandardSequence := ASequence
      else
        FSpecifierCharInfos[Idx].CustomSequence := ASequence;
    end;
  end;

  procedure AddToInfos(ASequence: TSpecifierSequence; Standard: Boolean; AChar: Char; UpperAndLowerCase: Boolean); overload;
  begin
    if not UpperAndLowerCase then
      AddToInfos(ASequence, Standard, AChar)
    else
    begin
      AddToInfos(ASequence, Standard, AChar.ToLower);
      AddToInfos(ASequence, Standard, AChar.ToUpper);
    end;
  end;
begin
  for I := Low(FSpecifierCharInfos) to High(FSpecifierCharInfos) do
  begin
    FSpecifierCharInfos[I].SpecifierChar := IntToSpecifierChar(I);
    FSpecifierCharInfos[I].StandardSequence := ssOtherChar;
    FSpecifierCharInfos[I].CustomSequence := ssOtherChar;
  end;

  for Sequence := Low(SpecifierSequenceInfos) to High(SpecifierSequenceInfos) do
  begin
    case Sequence of
      ssEnclosedLiteral:
      begin
        AddToInfos(ssEnclosedLiteral,
                   SpecifierSequenceInfos[ssEnclosedLiteral].Standard,
                   SpecifierSequenceInfos[ssEnclosedLiteral].SpecifierChar,
                   SpecifierSequenceInfos[ssEnclosedLiteral].UpperAndLowerCase);
        AddToInfos(ssEnclosedLiteral, SpecifierSequenceInfos[ssEnclosedLiteral].Standard, '''', False); // can also be '
      end;
      ssOtherChar: ; // nothing to add
      else
      begin
        AddToInfos(SpecifierSequenceInfos[Sequence].Sequence,
                   SpecifierSequenceInfos[ssEnclosedLiteral].Standard,
                   SpecifierSequenceInfos[Sequence].SpecifierChar,
                   SpecifierSequenceInfos[Sequence].UpperAndLowerCase);
      end;
    end;
  end;
end;

class procedure TDotNetDateTimeFormatter.PrepareSpecifierSequenceToTokenInfos;
var
  Token: TToken;
  Sequence: TSpecifierSequence;
  Idx: Integer;
begin
  for Sequence := Low(FSpecifierSequenceToTokenInfos) to High(FSpecifierSequenceToTokenInfos) do
  begin
    FSpecifierSequenceToTokenInfos[Sequence].Sequence := Sequence;
    FSpecifierSequenceToTokenInfos[Sequence].TokenCount := 0;
  end;

  for Token := Low(TokenInfos) to High(TokenInfos) do
  begin
    if TokenInfos[Token].SpecifierLength > 0 then
    begin
      Sequence := TokenInfos[Token].SpecifierSequence;
      Idx := FSpecifierSequenceToTokenInfos[Sequence].TokenCount;
      if Idx >= TSpecifierSequenceToTokenInfo.MaxTokenCount then
        raise Exception.Create('SpecifierSequenceToTokenInfo MaxTokenCount exceeded')
      else
      begin
        FSpecifierSequenceToTokenInfos[Sequence].Tokens[Idx] := Token;
        Inc(FSpecifierSequenceToTokenInfos[Sequence].TokenCount);
      end;
    end;
  end;
end;

function TDotNetDateTimeFormatter.TryParseCustomFormatChar(
  const FormatChar: Char; Sequence: TSpecifierSequence): Boolean;
begin
  case FCustomFormatParseState of
    cfpsOutOfSequence:
    begin
      FCustomFormatParseSequence := Sequence;

      case FCustomFormatParseSequence of
        ssSingleCharCustomFormat: ; // ignore as next char is new sequence
        ssEnclosedLiteral:
        begin
          EnsureCustomFormatParseLiteralBuilderCreated;
          FCustomFormatParseEnclosedLiteralOpeningChar := FormatChar;
          FCustomFormatParseState := cfpsEnclosedLiteral;
        end;
        ssSingleCharLiteral:
        begin
          EnsureCustomFormatParseLiteralBuilderCreated;
          FCustomFormatParseState := cfpsSingleCharLiteral;
        end;
        ssOtherChar:
        begin
          EnsureCustomFormatParseLiteralBuilderCreated;
          FCustomFormatParseLiteralBuilder.Append(FormatChar);
        end;
        else
        begin
          if Assigned(FCustomFormatParseLiteralBuilder) then
          begin
            AddCustomFormatParseLiteral;
          end;
          FCustomFormatParseSequenceLength := 1;
          FCustomFormatParseState := cfpsInNonLiteralSequence;
        end;
      end;

      Result := True;
    end;
    cfpsInNonLiteralSequence:
    begin
      if Sequence = FCustomFormatParseSequence then
      begin
        Inc(FCustomFormatParseSequenceLength);
        Result := True;
      end
      else
      begin
        Result := AddCustomFormatParseNonLiteralSequence(FCustomFormatParseSequence, FCustomFormatParseSequenceLength);
        if Result then
        begin
          FCustomFormatParseState := cfpsOutOfSequence;
          FCustomFormatParseSequenceLength := 0;
          Result := TryParseCustomFormatChar(FormatChar, Sequence)
        end;
      end;
    end;
    cfpsEnclosedLiteral:
    begin
      if (Sequence = ssEnclosedLiteral) and (FormatChar = FCustomFormatParseEnclosedLiteralOpeningChar) then
        FCustomFormatParseState := cfpsOutOfSequence
      else
        FCustomFormatParseLiteralBuilder.Append(FormatChar);

      Result := True;
    end;
    cfpsSingleCharLiteral:
    begin
      FCustomFormatParseLiteralBuilder.Append(FormatChar);
      FCustomFormatParseState := cfpsOutOfSequence;

      Result := True;
    end
    else
    begin
      raise Exception.Create('Unknown TDotNetDateTimeFormatter CustomFormatParseState');
    end;
  end;
end;

function TDotNetDateTimeFormatter.TryParseFormat(const AFormat: string;
  out ParsedElements: TElements; out ErrorText: string): Boolean;
var
  I: Integer;
begin
  FFormatParseErrorText := '';
  FFormatParseElements := nil;
  FFormatParseElementCount := 0;
  if AFormat = '' then
  begin
    FFormatParseErrorText := 'Format text cannot be empty';
    Result := False;
  end
  else
  begin
    FFormatIsStandard := Length(AFormat) = 1;

    if Length(AFormat) = 1 then
      Result := TryParseStandardFormatChar(AFormat[0])
    else
    begin
      FCustomFormatParseState := cfpsOutOfSequence;
      Result := True;
      for I := Low(AFormat) to High(AFormat) do
      begin
        if not TryParseCustomFormatChar(AFormat[I]) then
        begin
          ErrorText := FFormatParseErrorText;
          Result := False;
          Break;
        end;
      end;

      if Assigned(FCustomFormatParseLiteralBuilder) then
        AddCustomFormatParseLiteral
      else
      begin
        if FCustomFormatParseState = cfpsInNonLiteralSequence then
        begin
          AddCustomFormatParseNonLiteralSequence(FCustomFormatParseSequence, FCustomFormatParseSequenceLength);
        end;
      end;
    end;
  end;

  if not Result then
    ErrorText := FFormatParseErrorText
  else
  begin
    SetLength(FFormatParseElements, FFormatParseElementCount);
    ParsedElements := FFormatParseElements;
  end;
end;

function TDotNetDateTimeFormatter.TryParseStandardFormatChar(
  const FormatChar: Char): Boolean;
var
  Idx: Integer;
begin
  if not TSpecifierCharInfo.TryCharToIndex(FormatChar, Idx) then
  begin
    FFormatParseErrorText := 'Format text can only include ASCII characters.  Invalid character: ' + IntToStr(Integer(FormatChar));
    Result := False
  end
  else
  begin
    FCustomFormatParseSequence := FSpecifierCharInfos[Idx].StandardSequence;
    if FCustomFormatParseSequence <> ssOtherChar then
    begin
      FFormatParseErrorText := '"' + FormatChar + '" is not a valid Standard Format Specifier';
      Result := False;
    end
    else
    begin
      FFormatParseElementCount := 1;
      SetLength(FFormatParseElements, FFormatParseElementCount);
      FFormatParseElements[0].Token := FSpecifierSequenceToTokenInfos[FCustomFormatParseSequence].Tokens[0];
      FFormatParseElements[0].Literal := '';
      Result := True
    end;
  end;
end;

function TDotNetDateTimeFormatter.TryParseCustomFormatChar(const FormatChar: Char): Boolean;
var
  Idx: Integer;
  Sequence: TSpecifierSequence;
begin
  if (FCustomFormatParseState = cfpsSingleCharLiteral) or (FCustomFormatParseState = cfpsEnclosedLiteral) then
  begin
    Sequence := ssOtherChar;
    Result := True;
  end
  else
  begin
    if TSpecifierCharInfo.TryCharToIndex(FormatChar, Idx) then
    begin
      Sequence := FSpecifierCharInfos[Idx].CustomSequence;
      Result := True;
    end
    else
    begin
      FFormatParseErrorText := 'Format text can only include ASCII characters.  Invalid character: ' + IntToStr(Integer(FormatChar));
      Sequence := ssOtherChar; // avoid compiler warning
      Result := False;
    end;
  end;

  if Result then
  begin
    Result := TryParseCustomFormatChar(FormatChar, Sequence);
  end;
end;

function TDotNetDateTimeFormatter.TrySetFormat(const Value: string;
  out ErrorText: string): Boolean;
var
  ParsedElements: TElements;
begin
  FFormat := Value;
  if not TryParseFormat(Value, ParsedElements, ErrorText) then
    Result := False
  else
  begin
    FFormat := Value;
    FElements := ParsedElements;
    Result := True;
  end;
end;

class function TDotNetDateTimeFormatter.TrySpecifierCharToInt(
  const CharValue: Char; out IntValue: Integer): Boolean;
begin
  IntValue := Integer(CharValue);
  Result := IntValue <= AsciiCharCount;
end;

function TDotNetDateTimeFormatter.TryFromString(const StrValue: string;
  out DateTimeValue: TDateTime): Boolean;
var
  I: Integer;
  AllowInnerWhite: Boolean;
  ParseStrLen: Integer;
begin
  Result := True;

  FParseErrorText := '';
  FParseYear := -1;
  FParseMonth := -1;
  FParseDay := -1;
  FParseHour := 0;
  FParseMin := 0;
  FParseSec := 0;
  FParseMSec := 0;
  FParsePos := 0;
  FParseAmPm := ampmNonSet;

  if dndsAllowLeadingWhite in FStyles then
  begin
    if dndsAllowTrailingWhite in FStyles then
      FParseStr := Trim(StrValue)
    else
      FParseStr := TrimLeft(StrValue);
  end
  else
  begin
    if dndsAllowTrailingWhite in FStyles then
      FParseStr := TrimRight(StrValue)
    else
      FParseStr := StrValue;
  end;

  if FParseStr = '' then
  begin
    FParseErrorText := 'DateTime string is empty';
    Result := False;
  end
  else
  begin
    AllowInnerWhite := dndsAllowInnerWhite in FStyles;
    ParseStrLen := Length(FParseStr);

    for I := Low(FElements) to High(FElements) do
    begin
      if FParsePos >= ParseStrLen then
      begin
        FParseErrorText := 'DateTime string does not match all Format specifiers';
        Result := False;
      end
      else
      begin
        if AllowInnerWhite and (I > Low(FElements)) and FParseStr[FParsePos].IsWhiteSpace then
          Inc(FParsePos)
        else
        begin
          if not ParseElement(FElements[I]) then
          begin
            Result := False;
            Break;
          end;
        end;
      end;
    end;

    if Result then
    begin
      if FParsePos <> Length(FParseStr) then
      begin
        FParseErrorText := 'DateTime string has extra trailing characters';
        Result := False;
      end
      else
      begin
        if (FParseHour >= 0) and FParseHourIs12Hour then
        begin
          Result := ConvertParse12HourTo24Hour;
        end;

        if Result then
        begin
          Result := EncodeYearMonthDayHourMinSecMSec(DateTimeValue);
        end;
      end;
    end;
  end;
end;

{ TDotNetDateTimeFormatter.TSpecifierCharInfo }

class function TDotNetDateTimeFormatter.TSpecifierCharInfo.TryCharToIndex(
  const CharValue: Char; out Idx: Integer): Boolean;
begin
  Idx := Integer(CharValue);
  Result := Idx < MaxCharCount;
end;

{ TDotNetDateTimeStyleInfo }

class constructor TDotNetDateTimeStyle.Create;
var
  Style: TId;
begin
  for Style := Low(TId) to High(TId) do
  begin
    if StyleRecs[Style].Id <> Style then
    begin
      raise Exception.Create('DotNetDateTimeStyle StyleRecs out of order');
    end;
  end;
end;

class function TDotNetDateTimeStyle.GetCount: Integer;
begin
  Result := Length(StyleRecs);
end;

class function TDotNetDateTimeStyle.ToName(
  Value: TId): string;
begin
  Result := StyleRecs[Value].Name;
end;

class function TDotNetDateTimeStyle.ToXmlValue(
  Value: TId): string;
begin
  Result := StyleRecs[Value].XmlValue;
end;

class function TDotNetDateTimeStyle.TryFromName(const Name: string;
  out StyleValue: TId): Boolean;
var
  Style: TId;
begin
  Result := False;
  for Style := Low(StyleRecs) to High(StyleRecs) do
  begin
    if SameText(StyleRecs[Style].Name, Name) then
    begin
      StyleValue := Style;
      Result := True;
      Break;
    end;
  end;
end;

class function TDotNetDateTimeStyle.TryFromXmlValue(const XmlValue: string;
  out StyleValue: TId): Boolean;
var
  Style: TId;
begin
  Result := False;
  for Style := Low(StyleRecs) to High(StyleRecs) do
  begin
    if SameText(StyleRecs[Style].XmlValue, xmlValue) then
    begin
      StyleValue := Style;
      Result := True;
      Break;
    end;
  end;
end;

{ TDotNetNumberStyleInfo }

class constructor TDotNetNumberStyle.Create;
var
  Id: TId;
begin
  for Id := Low(Infos) to High(Infos) do
  begin
    if Infos[Id].Id <> Id then
    begin
      raise Exception.Create('TDotNetNumberStyle Infos out of order');
    end;
  end;
end;

class function TDotNetNumberStyle.GetCount: Integer;
begin
  Result := Length(Infos);
end;

class function TDotNetNumberStyle.IdToName(Value: TId): string;
begin
  Result := Infos[Value].Name;
end;

class function TDotNetNumberStyle.IdToXmlValue(
  Value: TId): string;
begin
  Result := Infos[Value].XmlValue;
end;

class function TDotNetNumberStyle.TryNameToId(const Name: string;
  out IdValue: TId): Boolean;
var
  Id: TId;
begin
  Result := False;
  for Id := Low(Infos) to High(Infos) do
  begin
    if SameText(Infos[Id].Name, Name) then
    begin
      IdValue := Id;
      Result := True;
      Break;
    end;
  end;
end;

class function TDotNetNumberStyle.TryXmlValueToId(const XmlValue: string;
  out IdValue: TId): Boolean;
var
  Id: TId;
begin
  Result := False;
  for Id := Low(Infos) to High(Infos) do
  begin
    if SameText(Infos[Id].XmlValue, xmlValue) then
    begin
      IdValue := Id;
      Result := True;
      Break;
    end;
  end;
end;

{ TDotNetNumberStylesInfo }

class function TDotNetNumberStylesInfo.ToString(
  Value: TDotNetNumberStyle.TIds): string;
begin
  Result := ToXmlValue(Value); // Cheat since Name and XmlValue are the same
end;

class function TDotNetNumberStylesInfo.ToXmlValue(
  const Value: TDotNetNumberStyle.TIds): string;
var
  Id: TDotNetNumberStyle.TId;
  IdXmlValues: TStringDynArray;
  Count: Integer;
begin
  if Value = TDotNetNumberStyle.dnncAny then
    Result := XmlValue_Any
  else
  begin
    if Value = TDotNetNumberStyle.dnncCurrency then
      Result := XmlValue_Currency
    else
    begin
      if Value = TDotNetNumberStyle.dnncFloat then
        Result := XmlValue_Float
      else
      begin
        if Value = TDotNetNumberStyle.dnncInteger then
          Result := XmlValue_Integer
        else
        begin
          if Value = TDotNetNumberStyle.dnncNumber then
            Result := XmlValue_Number
          else
          begin
            if Value = TDotNetNumberStyle.dnncHexNumber then
              Result := XmlValue_HexNumber
            else
            begin
              Count := 0;
              SetLength(IdXmlValues, TDotNetNumberStyle.Count);
              for Id in Value do
              begin
                IdXmlValues[Count] := TDotNetNumberStyle.IdToXmlValue(Id);
                Inc(Count);
              end;
              SetLength(IdXmlValues, Count);

              Result := TCommaText.From(IdXmlValues);
            end;
          end;
        end;
      end;
    end;
  end;
end;

class function TDotNetNumberStylesInfo.TryFromXmlValue(XmlValue: string;
  out IdsValue: TDotNetNumberStyle.TIds): Boolean;
var
  I: Integer;
  IdXmlValues: TStringDynArray;
  ErrorDescription: string;
  IdXmlValue: TDotNetNumberStyle.TId;
begin
  XmlValue := Trim(XmlValue);
  if (XmlValue = '') or SameText(XmlValue, XmlValue_None) then
  begin
    IdsValue := TDotNetNumberStyle.dnncNone;
    Result := True
  end
  else
  begin
    if SameText(XmlValue, XmlValue_Any) then
    begin
      IdsValue := TDotNetNumberStyle.dnncAny;
      Result := True
    end
    else
    begin
      if SameText(XmlValue, XmlValue_Currency) then
      begin
        IdsValue := TDotNetNumberStyle.dnncCurrency;
        Result := True
      end
      else
      begin
        if SameText(XmlValue, XmlValue_Float) then
        begin
          IdsValue := TDotNetNumberStyle.dnncFloat;
          Result := True
        end
        else
        begin
          if SameText(XmlValue, XmlValue_Integer) then
          begin
            IdsValue := TDotNetNumberStyle.dnncInteger;
            Result := True
          end
          else
          begin
            if SameText(XmlValue, XmlValue_Number) then
            begin
              IdsValue := TDotNetNumberStyle.dnncNumber;
              Result := True
            end
            else
            begin
              if SameText(XmlValue, XmlValue_HexNumber) then
              begin
                IdsValue := TDotNetNumberStyle.dnncHexNumber;
                Result := True
              end
              else
              begin
                IdsValue := [];
                Result := TCommaText.&To(xmlValue, False, IdXmlValues, ErrorDescription);
                if Result then
                begin
                  for I := Low(IdXmlValues) to High(IdXmlValues) do
                  begin
                    if TDotNetNumberStyle.TryXmlValueToId(IdXmlValues[I], IdXmlValue) then
                      Include(IdsValue, IdXmlValue)
                    else
                    begin
                      Result := False;
                      Break;
                    end;
                  end;
                end;
              end;
            end;
          end;
        end;
      end;
    end;
  end;
end;

class function TDotNetNumberStylesInfo.TryFromString(const StrValue: string;
  out StylesValue: TDotNetNumberStyle.TIds): Boolean;
begin
  Result := TryFromXmlValue(StrValue, StylesValue); // Cheat since Name and XmlValue are the same
end;

class function TDotNetNumberStylesInfo.TryFromXmlValue(const XmlValue: string;
  const DefaultStylesValue: TDotNetNumberStyle.TIds;
  out StylesValue: TDotNetNumberStyle.TIds): Boolean;
begin
  if XmlValue = '' then
    Result := TryFromXmlValue(XmlValue, StylesValue)
  else
  begin
    StylesValue := DefaultStylesValue;
    Result := True;
  end;
end;

{ TDotNetIntegerFormatter }

function TDotNetIntegerFormatter.ToString(const Value: Int64): string;
begin
  { TODO : Add support for DotNet formatting }
  Result := System.SysUtils.IntToStr(Value);
end;

function TDotNetIntegerFormatter.TryFromString(const StrValue: string;
  out IntValue: Int64): Boolean;
var
  UnstyledStr: string;
  Negated: Boolean;
  HasLeadingSign: Boolean;
  FloatValue: Extended;
begin
  if not UnstyleNumberString(StrValue, UnstyledStr, Negated) then
    Result := False
  else
  begin
    Negated := False;

    if dnnsAllowHexSpecifier in Styles then
    begin
      if dnnsAllowLeadingSign in Styles then
      begin
        if UnstyledStr[0] = '+' then
          UnstyledStr := UnstyledStr.Substring(1)
        else
        begin
          if UnstyledStr[0] = '-' then
          begin
            UnstyledStr := UnstyledStr.Substring(1);
            Negated := True;
          end;
        end;
      end;

      if not TryHexToInt64(UnstyledStr, IntValue) then
        Result := SetParseErrorText('Invalid hex format')
      else
        Result := True;
    end
    else
    begin
      HasLeadingSign := (UnstyledStr[0] = '-') or (UnstyledStr[0] = '+');
      if not (dnnsAllowLeadingSign in Styles) and HasLeadingSign then
        Result := SetParseErrorText('Unallowed leading sign character')
      else
      begin
        if ((dnnsAllowExponent in Styles) and HasExponentChar(UnstyledStr))
           or
           ((dnnsAllowDecimalPoint in Styles) and HasDecimalChar(UnstyledStr)) then
        begin
          if not TryStrToFloat(UnstyledStr, FloatValue, FLocaleSettings.Settings) then
            Result := SetParseErrorText('Invalid float format (for Integer field)')
          else
          begin
            if Frac(FloatValue) <> 0.0 then
              Result := SetParseErrorText('Value has fractional component')
            else
            begin
              if (FloatValue < Low(Int64)) or (FloatValue > High(Int64)) then
                Result := SetParseErrorText('Value is out of range of 64 bit Integer')
              else
              begin
                IntValue := Trunc(FloatValue);
                Result := True;
              end;
            end;
          end;
        end
        else
        begin
          if not TryStrToInt64(UnstyledStr, IntValue) then
            Result := SetParseErrorText('Invalid integer format')
          else
            Result := True;
        end;
      end;
    end;

    if Result and Negated then
    begin
      IntValue := -IntValue;
    end;
  end;
end;

{ TDotNetDoubleFormatter }

function TDotNetDoubleFormatter.ToString(const Value: Double): string;
begin
  { TODO : Add support for DotNet formatting }
  Result := LocaleSettings.FloatToStr(Value);
end;

function TDotNetDoubleFormatter.TryFromString(const StrValue: string;
  out DblValue: Double): Boolean;
var
  UnstyledStr: string;
  Negated: Boolean;
  HasLeadingSign: Boolean;
begin
  if not UnstyleNumberString(StrValue, UnstyledStr, Negated) then
    Result := False
  else
  begin
    HasLeadingSign := (UnstyledStr[0] = '-') or (UnstyledStr[0] = '+');
    if not (dnnsAllowLeadingSign in Styles) and HasLeadingSign then
      Result := SetParseErrorText('Unallowed leading sign character')
    else
    begin
      if not (dnnsAllowExponent in Styles) and HasExponentChar(UnstyledStr) then
        Result := SetParseErrorText('Unallowed exponent character')
      else
      begin
        if not (dnnsAllowDecimalPoint in Styles) and HasDecimalChar(UnstyledStr) then
          Result := SetParseErrorText('Unallowed decimal point character')
        else
        begin
          if not HasDigitChar(UnstyledStr) then
            Result := SetParseErrorText('No digit character')
          else
          begin
            if not TryStrToFloat(UnstyledStr, DblValue, FLocaleSettings.Settings) then
              Result := SetParseErrorText('Invalid float format')
            else
            begin
              if Negated then
              begin
                DblValue := -DblValue;
              end;
              Result := True;
            end;
          end;
        end;
      end;
    end;
  end;
end;

{ TDotNetDecimalFormatter }

function TDotNetDecimalFormatter.ToString(const Value: Currency): string;
begin
  { TODO : Add support for DotNet formatting }
  Result := LocaleSettings.CurrToStrF(Value, ffFixed, 18);
  Result := TrimTrailingPadZeros(Result);
end;

function TDotNetDecimalFormatter.TryFromString(const StrValue: string;
  out CurrValue: Currency): Boolean;
var
  UnstyledStr: string;
  Negated: Boolean;
  HasLeadingSign: Boolean;
begin
  if not UnstyleNumberString(StrValue, UnstyledStr, Negated) then
    Result := False
  else
  begin
    HasLeadingSign := (UnstyledStr[0] = '-') or (UnstyledStr[0] = '+');
    if not (dnnsAllowLeadingSign in Styles) and HasLeadingSign then
      Result := SetParseErrorText('Unallowed leading sign character')
    else
    begin
      if not (dnnsAllowExponent in Styles) and HasExponentChar(UnstyledStr) then
        Result := SetParseErrorText('Unallowed exponent character')
      else
      begin
        if not (dnnsAllowDecimalPoint in Styles) and HasDecimalChar(UnstyledStr) then
          Result := SetParseErrorText('Unallowed decimal point character')
        else
        begin
          if not HasDigitChar(UnstyledStr) then
            Result := SetParseErrorText('No digit character')
          else
          begin
            if not TryStrToCurr(UnstyledStr, CurrValue, FLocaleSettings.Settings) then
              Result := SetParseErrorText('Invalid decimal format')
            else
            begin
              if Negated then
              begin
                CurrValue := -CurrValue;
              end;
              Result := True;
            end;
          end;
        end;
      end;
    end;
  end;
end;

{ TDotNetNumberFormatter }

function TDotNetNumberFormatter.HasDecimalChar(const Value: string): Boolean;
var
  I: Integer;
  DecimalChar: Char;
begin
  Result := False;
  DecimalChar := FLocaleSettings.Settings.DecimalSeparator;
  for I := Low(Value) to High(Value) do
  begin
    if Value[I] = DecimalChar then
    begin
      Result := True;
      Break;
    end;
  end;
end;

function TDotNetNumberFormatter.HasDigitChar(const Value: string): Boolean;
var
  I: Integer;
begin
  Result := False;
  for I := Low(Value) to High(Value) do
  begin
    if Value[I].IsDigit then
    begin
      Result := True;
      Break;
    end;
  end;
end;

function TDotNetNumberFormatter.HasExponentChar(const Value: string): Boolean;
var
  I: Integer;
  ValueChar: Char;
begin
  Result := False;
  for I := Low(Value) to High(Value) do
  begin
    ValueChar := Value[I];
    if (ValueChar = 'E') or (ValueChar = 'e') then
    begin
      Result := True;
      Break;
    end;
  end;
end;

function TDotNetNumberFormatter.SetParseErrorText(const Value: string): Boolean;
begin
  FParseErrorText := Value;
  Result := False;
end;

function TDotNetNumberFormatter.TrimTrailingPadZeros(
  const Value: string): string;
var
  I: Integer;
  DecimalPointIdx: Integer;
  FirstPadZeroIdx: Integer;
begin
  DecimalPointIdx := 0;
  FirstPadZeroIdx := 0;
  for I := Low(Value) to High(Value) do
  begin
    if DecimalPointIdx = 0 then
    begin
      if Value[I] = LocaleSettings.Settings.DecimalSeparator then
      begin
        DecimalPointIdx := I;
      end;
    end
    else
    begin
      if Value[I] <> '0' then
        FirstPadZeroIdx := 0
      else
      begin
        if FirstPadZeroIdx = 0 then
        begin
          FirstPadZeroIdx := I;
        end;
      end;
    end;
  end;

  if FirstPadZeroIdx = 0 then
    Result := Value
  else
  begin
    if FirstPadZeroIdx = (DecimalPointIdx + 1) then
    begin
      Inc(FirstPadZeroIdx);
    end;
    Result := Value.Substring(0, FirstPadZeroIdx);
  end;
end;

class function TDotNetNumberFormatter.TryHexToInt64(const Hex: string;
  out Value: Int64): Boolean;
const
  Convert: array['0'..'f'] of Int16 =
    ( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,-1,-1,-1,-1,-1,-1,
     -1,10,11,12,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,
     -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
     -1,10,11,12,13,14,15);
var
  I: Integer;
  HexLen: Integer;
  HexChar: Char;
  Nibble: Int16;
begin
  HexLen := Length(Hex);
  if (HexLen = 0) or (HexLen > 8) then
    Result := False
  else
  begin
    Result := True;
    Value := 0;
    for I := Low(Hex) to High(Hex) do
    begin
      HexChar := Hex[I];
//      if not CharInSet(HexChar, ['0'..'f']) then
      if (HexChar < '0') or (HexChar > 'f') then
      begin
        Result := False;
        Break;
      end
      else
      begin
        Nibble := Convert[HexChar];
        if (Nibble < 0) or ((I = 8) and (Value >= $8000000)) then
        begin
          Result := False;
          Break;
        end
        else
        begin
          Value := Value shl 4;
          Value := Value or Nibble;
        end;
      end;
    end;
  end;
end;

function TDotNetNumberFormatter.UnstyleNumberString(
  const Value: string; out UnstyledStr: string; out Negated: Boolean): Boolean;
var
  LastChar: Char;
begin
  if dnnsAllowLeadingWhite in FStyles then
  begin
    if dnnsAllowTrailingWhite in FStyles then
      UnstyledStr := Trim(Value)
    else
      UnstyledStr := TrimLeft(Value);
  end
  else
  begin
    if dnnsAllowTrailingWhite in FStyles then
      UnstyledStr := TrimRight(Value)
    else
      UnstyledStr := Value;
  end;

  if dnnsAllowThousands in FStyles then
  begin
    UnstyledStr := ReplaceStr(UnstyledStr, FLocaleSettings.Settings.ThousandSeparator, '');
  end;

  if UnstyledStr = '' then
    Result := SetParseErrorText('No digit character')
  else
  begin
    if UnstyledStr[0].IsWhiteSpace then
      Result := SetParseErrorText('Unallowed leading whitespace characters')
    else
    begin
      if UnstyledStr[Length(UnstyledStr)-1].IsWhiteSpace then
        Result := SetParseErrorText('Unallowed trailing whitespace characters')
      else
      begin
        if (dnnsAllowCurrencySymbol in FStyles) and StartsStr(FLocaleSettings.Settings.CurrencyString, UnstyledStr) then
        begin
          UnstyledStr := UnstyledStr.Substring(Length(FLocaleSettings.Settings.CurrencyString));
        end;
        if UnstyledStr = '' then
          Result := SetParseErrorText('No digit character')
        else
        begin
          if (dnnsAllowParentheses in FStyles) and (UnstyledStr[0] = '(') and (UnstyledStr[Length(UnstyledStr)-1] = ')')  then
          begin
            UnstyledStr := UnstyledStr.Substring(1, Length(UnstyledStr)-2);
            Negated := True;
          end
          else
          begin
            if not (dnnsAllowTrailingSign in FStyles) then
              Negated := False
            else
            begin
              LastChar := UnstyledStr[Length(UnstyledStr)-1];
              if LastChar = '+' then
              begin
                UnstyledStr := UnstyledStr.Substring(0, Length(UnstyledStr)-1);
                Negated := False;
              end
              else
              begin
                if LastChar <> '-' then
                  Negated := False
                else
                begin
                  UnstyledStr := UnstyledStr.Substring(0, Length(UnstyledStr)-1);
                  Negated := True;
                end;
              end;
            end;
          end;

          if UnstyledStr = '' then
            Result := SetParseErrorText('No digit character')
          else
            Result := True;
        end;
      end;
    end;
  end;
end;

end.
