# dot-net-date-number-formatting

A TypeScript library that provides .NET-compatible date/time and numeric formatting capabilities for JavaScript/TypeScript applications. This library implements format string parsing and formatting similar to Microsoft's .NET Framework, enabling cross-platform compatibility for applications that need to maintain consistent formatting between .NET and JavaScript/TypeScript.

## Overview

This library provides three main components:

- **DateTime Formatting**: Format and parse dates using .NET standard and custom date/time format strings
- **Numeric Formatting**: Format and parse numbers using .NET standard and custom numeric format strings
- **Number Style Parsing**: Parse numbers with specific style requirements (hex, currency, thousands separators, etc.)

The library is built on top of JavaScript's `Intl` API for locale-aware formatting while maintaining compatibility with .NET format string syntax.

## Installation

```bash
npm install dot-net-date-number-formatting
```

## Features & .NET Compatibility

### ✅ Implemented Features

#### DateTime Formatting

**Standard Date/Time Format Strings:**
- `d` - Short date pattern
- `D` - Long date pattern
- `f` - Full date/time (short time)
- `F` - Full date/time (long time)
- `g` - General date/time (short time)
- `G` - General date/time (long time)
- `M` or `m` - Month/day pattern
- `O` or `o` - Round-trip date/time pattern (ISO 8601)
- `s` - Sortable date/time pattern
- `t` - Short time pattern
- `T` - Long time pattern
- `u` - Universal sortable date/time pattern
- `Y` or `y` - Year/month pattern

**Custom Date/Time Format Strings:**
- `d`, `dd` - Day of month (1-31)
- `ddd`, `dddd` - Day name (abbreviated or full)
- `M`, `MM` - Month (1-12)
- `MMM`, `MMMM` - Month name (abbreviated or full)
- `y`, `yy`, `yyy`, `yyyy`, `yyyyy` - Year
- `h`, `hh` - Hours (12-hour format)
- `H`, `HH` - Hours (24-hour format)
- `m`, `mm` - Minutes
- `s`, `ss` - Seconds
- `f`, `ff`, `fff`, `ffff`, `fffff`, `ffffff`, `fffffff` - Fractional seconds
- `F`, `FF`, `FFF`, `FFFF`, `FFFFF`, `FFFFFF`, `FFFFFFF` - Fractional seconds (trailing zeros omitted)
- `t`, `tt` - AM/PM designator
- `/` - Date separator
- `:` - Time separator
- `'text'` or `"text"` - Literal string delimiters
- `%c` - Single character custom format specifier
- `\c` - Escape character

#### Numeric Formatting

**Standard Numeric Format Strings:**
- `C` or `c` - Currency format
- `D` or `d` - Decimal format (integers only)
- `E` or `e` - Exponential (scientific) notation
- `F` or `f` - Fixed-point format
- `G` or `g` - General format (most compact)
- `N` or `n` - Number format with group separators
- `P` or `p` - Percent format
- `R` or `r` - Round-trip format
- `X` or `x` - Hexadecimal format
- `B` or `b` - Binary format (.NET 8+)

**Custom Numeric Format Strings:**
- `0` - Zero placeholder
- `#` - Digit placeholder
- `.` - Decimal point
- `,` - Thousands separator and number scaling
- `%` - Percentage placeholder
- `‰` - Per mille placeholder
- `E0`, `E+0`, `E-0`, `e0`, `e+0`, `e-0` - Exponential notation
- `\` - Escape character
- `'text'` or `"text"` - Literal string delimiters
- `;` - Section separator (positive;negative;zero)

#### Number Style Parsing

**Supported DotNetNumberStyles:**
- `AllowLeadingWhite` - Allow leading whitespace
- `AllowTrailingWhite` - Allow trailing whitespace
- `AllowLeadingSign` - Allow leading sign (+/-)
- `AllowTrailingSign` - Allow trailing sign
- `AllowParentheses` - Allow parentheses for negatives
- `AllowDecimalPoint` - Allow decimal point
- `AllowThousands` - Allow thousands separators
- `AllowExponent` - Allow exponential notation
- `AllowCurrencySymbol` - Allow currency symbol
- `AllowHexSpecifier` - Allow hexadecimal format

**Predefined Style Sets:**
- `DotNetNumberStyles.integer` - Basic integer parsing
- `DotNetNumberStyles.number` - Standard number parsing
- `DotNetNumberStyles.float` - Floating-point parsing
- `DotNetNumberStyles.currency` - Currency parsing
- `DotNetNumberStyles.any` - All styles allowed
- `DotNetNumberStyles.hexNumber` - Hexadecimal parsing

### ⚠️ Limitations & Not Implemented

#### DateTime Formatting
- Some locale-specific formatting may differ from .NET due to reliance on JavaScript's `Intl` API
- Time zone formatting specifiers are not fully implemented
- Era formatting (Japanese, Taiwanese, Korean calendars) is not supported
- Some culture-specific calendar systems are not supported

#### Numeric Formatting
- Very large precision values may have different behavior than .NET
- Some culture-specific number formatting edge cases may differ
- Custom format strings with complex combinations of placeholders may have simplified behavior
- Leading zero padding in custom formats has limited support for certain patterns

#### General
- Parsing from formatted strings is partially implemented (mainly for numbers with style flags)
- Full bi-directional formatting/parsing for all format strings is not yet complete
- Some .NET-specific culture customizations may not be available

## Quick Start

### DateTime Formatting

```typescript
import { DotNetDateTimeFormatter, FieldedTextLocaleSettings } from 'dot-net-date-number-formatting';

// Create formatter
const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Standard format strings
formatter.trySetFormat('d');        // Short date
console.log(formatter.toString(new Date(2024, 6, 5)));  // "7/5/2024"

formatter.trySetFormat('F');        // Full date/time
console.log(formatter.toString(new Date(2024, 6, 5, 14, 30, 0)));
// "Friday, July 5, 2024 2:30:00 PM"

formatter.trySetFormat('yyyy-MM-dd');  // Custom format
console.log(formatter.toString(new Date(2024, 6, 5)));  // "2024-07-05"

formatter.trySetFormat('HH:mm:ss');    // Time only
console.log(formatter.toString(new Date(2024, 6, 5, 14, 30, 45)));  // "14:30:45"
```

### Numeric Formatting

```typescript
import { DotNetFloatFormatter, FieldedTextLocaleSettings } from 'dot-net-date-number-formatting';

// Create formatter
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Standard format strings
formatter.trySetFormat('C');        // Currency
console.log(formatter.toString(1234.56));  // "$1,234.56"

formatter.trySetFormat('N2');       // Number with 2 decimals
console.log(formatter.toString(1234567.89));  // "1,234,567.89"

formatter.trySetFormat('P1');       // Percentage with 1 decimal
console.log(formatter.toString(0.1234));  // "12.3%"

formatter.trySetFormat('E3');       // Scientific notation
console.log(formatter.toString(1234.5678));  // "1.235e+003"

// Custom format strings
formatter.trySetFormat('#,##0.00');
console.log(formatter.toString(1234.56));  // "1,234.56"

formatter.trySetFormat('0.00%');
console.log(formatter.toString(0.086));  // "8.60%"

formatter.trySetFormat('$#,##0.00;($#,##0.00)');  // Positive;Negative
console.log(formatter.toString(-1234.56));  // "($1,234.56)"
```

### Parsing Numbers with Styles

```typescript
import { DotNetFloatFormatter, DotNetNumberStyleId, FieldedTextLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Configure parsing styles
formatter.styles = new Set([
  DotNetNumberStyleId.AllowLeadingSign,
  DotNetNumberStyleId.AllowDecimalPoint,
  DotNetNumberStyleId.AllowThousands,
]);

const result = formatter.tryFromString('1,234.56');
if (result.isOk()) {
  console.log(result.value);  // 1234.56
}

// Parse currency
formatter.styles = new Set([
  DotNetNumberStyleId.AllowCurrencySymbol,
  DotNetNumberStyleId.AllowDecimalPoint,
  DotNetNumberStyleId.AllowThousands,
]);

const currencyResult = formatter.tryFromString('$1,234.56');
if (currencyResult.isOk()) {
  console.log(currencyResult.value);  // 1234.56
}
```

## API Documentation

### Core Classes

#### `FieldedTextLocaleSettings`

Represents locale-specific formatting settings including decimal separators, thousand separators, currency symbols, and date/time separators.

**Static Methods:**
- `createInvariant(): FieldedTextLocaleSettings` - Creates settings for invariant culture (en-US)
- `create(localeName: string): FieldedTextLocaleSettings` - Creates settings for specific locale

**Static Properties:**
- `current: FieldedTextLocaleSettings` - Default settings for current system locale
- `invariant: FieldedTextLocaleSettings` - Invariant culture settings

**Properties:**
- `name: string` - Locale name
- `decimalSeparator: string` - Decimal point character
- `thousandSeparator: string` - Thousands grouping character
- `currencyString: string` - Currency symbol
- `dateSeparator: string` - Date component separator
- `timeSeparator: string` - Time component separator

**Example:**
```typescript
// Use system locale
const systemSettings = FieldedTextLocaleSettings.current;

// Use specific locale
const frenchSettings = FieldedTextLocaleSettings.create('fr-FR');
console.log(frenchSettings.decimalSeparator);  // ","
console.log(frenchSettings.thousandSeparator);  // " " (space)

// Use invariant culture (en-US style, consistent across systems)
const invariantSettings = FieldedTextLocaleSettings.createInvariant();
console.log(invariantSettings.decimalSeparator);  // "."
console.log(invariantSettings.thousandSeparator);  // ","
```

---

### DateTime Formatting

#### `DotNetDateTimeFormatter`

Formats and parses dates using .NET-compatible format strings.

**Properties:**
- `localeSettings: FieldedTextLocaleSettings` - Locale settings for formatting
- `styles: DotNetDateTimeStyleSet` - Parsing styles (for future parsing implementation)
- `parseErrorText: string` - Error message from last failed operation

**Methods:**

##### `trySetFormat(value: string): Result<void>`

Sets the format string to use for formatting.

**Parameters:**
- `value: string` - Standard or custom format string

**Returns:** `Result<void>` - Ok if format is valid, Err with error message if invalid

**Example:**
```typescript
const formatter = new DotNetDateTimeFormatter();

// Standard format
let result = formatter.trySetFormat('d');
if (result.isOk()) {
  console.log('Format set successfully');
} else {
  console.error('Error:', result.error);
}

// Custom format
result = formatter.trySetFormat('yyyy-MM-dd HH:mm:ss');
if (result.isErr()) {
  console.error('Invalid format:', result.error);
}
```

##### `toString(value: Date): string`

Formats a date using the current format string.

**Parameters:**
- `value: Date` - Date to format

**Returns:** `string` - Formatted date string

**Example:**
```typescript
const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
formatter.trySetFormat('yyyy-MM-dd HH:mm:ss');

const date = new Date(2024, 6, 5, 14, 30, 45);
console.log(formatter.toString(date));  // "2024-07-05 14:30:45"
```

##### `tryFromString(value: string): Result<Date>`

Parses a date string (limited implementation).

**Parameters:**
- `value: string` - Date string to parse

**Returns:** `Result<Date>` - Ok with Date if successful, Err with error message if failed

**Example:**
```typescript
const formatter = new DotNetDateTimeFormatter();
const result = formatter.tryFromString('2024-07-05');

if (result.isOk()) {
  console.log('Parsed date:', result.value);
} else {
  console.error('Parse error:', result.error);
}
```

#### Standard DateTime Format Strings

| Specifier | Description | Example Output (en-US) |
|-----------|-------------|------------------------|
| `d` | Short date | `7/5/2024` |
| `D` | Long date | `Friday, July 5, 2024` |
| `f` | Full date/time (short time) | `Friday, July 5, 2024 2:30 PM` |
| `F` | Full date/time (long time) | `Friday, July 5, 2024 2:30:45 PM` |
| `g` | General (short time) | `7/5/2024 2:30 PM` |
| `G` | General (long time) | `7/5/2024 2:30:45 PM` |
| `M`, `m` | Month/day | `July 5` |
| `O`, `o` | Round-trip (ISO 8601) | `2024-07-05T14:30:45.120Z` |
| `s` | Sortable | `2024-07-05T14:30:45` |
| `t` | Short time | `2:30 PM` |
| `T` | Long time | `2:30:45 PM` |
| `u` | Universal sortable | `2024-07-05 14:30:45Z` |
| `Y`, `y` | Year/month | `July 2024` |

**Example:**
```typescript
const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
const date = new Date(2024, 6, 5, 14, 30, 45, 120);

formatter.trySetFormat('d');
console.log(formatter.toString(date));  // "7/5/2024"

formatter.trySetFormat('F');
console.log(formatter.toString(date));  // "Friday, July 5, 2024 2:30:45 PM"

formatter.trySetFormat('o');
console.log(formatter.toString(date));  // "2024-07-05T14:30:45.120Z"
```

#### Custom DateTime Format Strings

| Specifier | Description | Example |
|-----------|-------------|---------|
| `d` | Day of month (1-31) | `5` |
| `dd` | Day of month (01-31) | `05` |
| `ddd` | Abbreviated day name | `Fri` |
| `dddd` | Full day name | `Friday` |
| `M` | Month (1-12) | `7` |
| `MM` | Month (01-12) | `07` |
| `MMM` | Abbreviated month name | `Jul` |
| `MMMM` | Full month name | `July` |
| `y` | Year (0-99) | `24` |
| `yy` | Year (00-99) | `24` |
| `yyy` | Year (minimum 3 digits) | `2024` |
| `yyyy` | Year (4 digits) | `2024` |
| `yyyyy` | Year (5 digits) | `02024` |
| `h` | Hour 12-hour (1-12) | `2` |
| `hh` | Hour 12-hour (01-12) | `02` |
| `H` | Hour 24-hour (0-23) | `14` |
| `HH` | Hour 24-hour (00-23) | `14` |
| `m` | Minute (0-59) | `3` |
| `mm` | Minute (00-59) | `03` |
| `s` | Second (0-59) | `9` |
| `ss` | Second (00-59) | `09` |
| `f`-`fffffff` | Fractional seconds | `1` to `1200000` |
| `F`-`FFFFFFF` | Fractional seconds (no trailing zeros) | `1` to `12` |
| `t` | First char of AM/PM | `P` |
| `tt` | AM/PM designator | `PM` |
| `/` | Date separator | Uses locale setting |
| `:` | Time separator | Uses locale setting |
| `'text'`, `"text"` | Literal string | `'at'` → `at` |
| `%c` | Single custom specifier | `%d` → `5` |
| `\c` | Escape next character | `\d` → `d` |

**Example:**
```typescript
const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
const date = new Date(2024, 6, 5, 14, 3, 9, 120);

formatter.trySetFormat('yyyy-MM-dd');
console.log(formatter.toString(date));  // "2024-07-05"

formatter.trySetFormat('dddd, MMMM d, yyyy');
console.log(formatter.toString(date));  // "Friday, July 5, 2024"

formatter.trySetFormat('hh:mm:ss tt');
console.log(formatter.toString(date));  // "02:03:09 PM"

formatter.trySetFormat("'Today is' dddd");
console.log(formatter.toString(date));  // "Today is Friday"

formatter.trySetFormat('HH:mm:ss.fff');
console.log(formatter.toString(date));  // "14:03:09.120"
```

---

### Numeric Formatting

#### `DotNetNumberFormatter`

Base class for number formatting (typically use derived classes).

#### `DotNetIntegerFormatter`

Formats and parses integer values (bigint).

**Properties:**
- `localeSettings: FieldedTextLocaleSettings` - Locale settings
- `styles: DotNetNumberStyleSet` - Parsing styles
- `parseErrorText: string` - Error message from last failed operation

**Methods:**
- `trySetFormat(value: string): Result<void>` - Sets format string
- `toString(value: bigint): string` - Formats integer
- `tryFromString(value: string): Result<bigint>` - Parses integer string

**Example:**
```typescript
const formatter = new DotNetIntegerFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Formatting
formatter.trySetFormat('D8');
console.log(formatter.toString(123n));  // "00000123"

formatter.trySetFormat('X');
console.log(formatter.toString(255n));  // "FF"

// Parsing
formatter.styles = new Set([DotNetNumberStyleId.AllowLeadingSign]);
const result = formatter.tryFromString('-12345');
if (result.isOk()) {
  console.log(result.value);  // -12345n
}
```

#### `DotNetFloatFormatter`

Formats and parses floating-point values (number).

**Properties:**
- `localeSettings: FieldedTextLocaleSettings` - Locale settings
- `styles: DotNetNumberStyleSet` - Parsing styles
- `parseErrorText: string` - Error message from last failed operation

**Methods:**
- `trySetFormat(value: string): Result<void>` - Sets format string
- `toString(value: number): string` - Formats number
- `tryFromString(value: string): Result<number>` - Parses number string

**Example:**
```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Standard formats
formatter.trySetFormat('C2');
console.log(formatter.toString(1234.56));  // "$1,234.56"

formatter.trySetFormat('N2');
console.log(formatter.toString(1234567.89));  // "1,234,567.89"

formatter.trySetFormat('P1');
console.log(formatter.toString(0.1234));  // "12.3%"

formatter.trySetFormat('E3');
console.log(formatter.toString(1234.5678));  // "1.235e+003"

// Custom formats
formatter.trySetFormat('#,##0.00');
console.log(formatter.toString(1234.56));  // "1,234.56"

formatter.trySetFormat('0.##');
console.log(formatter.toString(1.5));  // "1.50"
```

#### `DotNetDecimalFormatter`

Formats and parses decimal values (number with high precision).

Similar to `DotNetFloatFormatter` but with different default behavior for toString.

#### Standard Numeric Format Strings

| Specifier | Description | Format | Example (1234.56) |
|-----------|-------------|--------|-------------------|
| `C` | Currency | `C` or `C{n}` | `$1,234.56` |
| `D` | Decimal (integers only) | `D` or `D{n}` | `1235` |
| `E` | Exponential | `E` or `E{n}` | `1.234560E+003` |
| `F` | Fixed-point | `F` or `F{n}` | `1234.56` |
| `G` | General | `G` or `G{n}` | `1234.56` |
| `N` | Number | `N` or `N{n}` | `1,234.56` |
| `P` | Percent | `P` or `P{n}` | `123,456.00%` |
| `R` | Round-trip | `R` | `1234.56` |
| `X` | Hexadecimal | `X` or `X{n}` | `4D2` (for integer) |
| `B` | Binary | `B` or `B{n}` | `10011010010` (for integer) |

Where `{n}` is an optional precision specifier (number of decimal places or digits).

**Example:**
```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

formatter.trySetFormat('C');     // Currency, default precision
console.log(formatter.toString(1234.56));  // "$1,234.56"

formatter.trySetFormat('C3');    // Currency, 3 decimals
console.log(formatter.toString(1234.56));  // "$1,234.560"

formatter.trySetFormat('F1');    // Fixed-point, 1 decimal
console.log(formatter.toString(1234.56));  // "1234.6"

formatter.trySetFormat('E2');    // Scientific, 2 decimals
console.log(formatter.toString(1234.56));  // "1.23e+003"

formatter.trySetFormat('P0');    // Percent, 0 decimals
console.log(formatter.toString(0.1234));  // "12%"
```

#### Custom Numeric Format Strings

| Specifier | Description | Example |
|-----------|-------------|---------|
| `0` | Zero placeholder | `00.00` → `01.50` or `123.45` |
| `#` | Digit placeholder | `##.##` → `1.5` or `123.45` |
| `.` | Decimal point | `0.00` → `1.50` |
| `,` | Thousands separator | `#,##0` → `1,234` |
| `,` | Number scaling | `0,,` → `1` (divides by 1000000) |
| `%` | Percentage | `0%` → `50%` |
| `‰` | Per mille | `0‰` → `500‰` |
| `E0`, `E+0`, `E-0` | Exponential | `0.00E+00` → `1.23E+03` |
| `\` | Escape character | `\#` → `#` |
| `'text'`, `"text"` | Literal string | `"Value:"0` → `Value:5` |
| `;` | Section separator | `#;(#);Zero` → `5` or `(5)` or `Zero` |

**Zero Placeholder (0):** Replaces with digit or 0 if no digit present.

**Digit Placeholder (#):** Replaces with digit or nothing if no digit present.

**Section Separators (;):** Define separate formats for positive;negative;zero values.

**Example:**
```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Zero and digit placeholders
formatter.trySetFormat('0000.00');
console.log(formatter.toString(12.5));  // "0012.50"

formatter.trySetFormat('####.##');
console.log(formatter.toString(12.5));  // "12.50"

// Thousands separator
formatter.trySetFormat('#,##0.00');
console.log(formatter.toString(1234.56));  // "1,234.56"

// Percentage
formatter.trySetFormat('0.00%');
console.log(formatter.toString(0.086));  // "8.60%"

// Section separators (positive;negative)
formatter.trySetFormat('#,##0.00;(#,##0.00)');
console.log(formatter.toString(1234.56));   // "1,234.56"
console.log(formatter.toString(-1234.56));  // "(1,234.56)"

// Three sections (positive;negative;zero)
formatter.trySetFormat('#,##0.00;(#,##0.00);Zero');
console.log(formatter.toString(0));  // "Zero"

// Scaling
formatter.trySetFormat('#,##0,,');  // Divide by millions
console.log(formatter.toString(1234567890));  // "1,235"

// Scientific notation
formatter.trySetFormat('0.00E+00');
console.log(formatter.toString(1234.56));  // "1.23E+03"

// Literals
formatter.trySetFormat('$#,##0.00');
console.log(formatter.toString(1234.56));  // "$1,234.56"

formatter.trySetFormat('"Total: "#,##0.00');
console.log(formatter.toString(1234.56));  // "Total: 1,234.56"
```

---

### Number Style Parsing

#### `DotNetNumberStyles`

Predefined number style combinations for common parsing scenarios.

**Static Properties:**
- `none: DotNetNumberStyleSet` - No styles
- `integer: DotNetNumberStyleSet` - Basic integer (with sign and whitespace)
- `number: DotNetNumberStyleSet` - Standard number (sign, decimal, thousands, whitespace)
- `float: DotNetNumberStyleSet` - Floating-point (includes exponent)
- `currency: DotNetNumberStyleSet` - Currency (includes symbol, parentheses)
- `any: DotNetNumberStyleSet` - All styles allowed
- `hexNumber: DotNetNumberStyleSet` - Hexadecimal

**Example:**
```typescript
import { DotNetFloatFormatter, DotNetNumberStyles, FieldedTextLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Use predefined style
formatter.styles = DotNetNumberStyles.number;
let result = formatter.tryFromString('1,234.56');
console.log(result.value);  // 1234.56

// Use currency style
formatter.styles = DotNetNumberStyles.currency;
result = formatter.tryFromString('$1,234.56');
console.log(result.value);  // 1234.56

result = formatter.tryFromString('($1,234.56)');
console.log(result.value);  // -1234.56
```

#### `DotNetNumberStyleId`

Individual style flags that can be combined.

**Available Flags:**
- `AllowLeadingWhite` - Permit leading whitespace
- `AllowTrailingWhite` - Permit trailing whitespace
- `AllowLeadingSign` - Permit leading +/- sign
- `AllowTrailingSign` - Permit trailing +/- sign
- `AllowParentheses` - Permit parentheses for negatives
- `AllowDecimalPoint` - Permit decimal point
- `AllowThousands` - Permit thousands separator
- `AllowExponent` - Permit exponential notation (e/E)
- `AllowCurrencySymbol` - Permit currency symbol
- `AllowHexSpecifier` - Parse as hexadecimal

**Example:**
```typescript
import { DotNetFloatFormatter, DotNetNumberStyleId, FieldedTextLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Custom style combination
formatter.styles = new Set([
  DotNetNumberStyleId.AllowLeadingWhite,
  DotNetNumberStyleId.AllowTrailingWhite,
  DotNetNumberStyleId.AllowLeadingSign,
  DotNetNumberStyleId.AllowDecimalPoint,
]);

// Can now parse
let result = formatter.tryFromString('  -123.45  ');
if (result.isOk()) {
  console.log(result.value);  // -123.45
}

// Cannot parse (thousands not allowed)
result = formatter.tryFromString('1,234.56');
console.log(result.isErr());  // true

// Parse hexadecimal
const intFormatter = new DotNetIntegerFormatter();
intFormatter.styles = new Set([DotNetNumberStyleId.AllowHexSpecifier]);
const hexResult = intFormatter.tryFromString('FF');
if (hexResult.isOk()) {
  console.log(hexResult.value);  // 255n
}
```

---

## Advanced Examples

### Multi-Locale Formatting

```typescript
import { DotNetFloatFormatter, FieldedTextLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
const value = 1234.56;

// US English formatting
formatter.localeSettings = FieldedTextLocaleSettings.create('en-US');
formatter.trySetFormat('C2');
console.log(formatter.toString(value));  // "$1,234.56"

// French formatting
formatter.localeSettings = FieldedTextLocaleSettings.create('fr-FR');
formatter.trySetFormat('C2');
console.log(formatter.toString(value));  // "1 234,56 €"

// German formatting
formatter.localeSettings = FieldedTextLocaleSettings.create('de-DE');
formatter.trySetFormat('N2');
console.log(formatter.toString(value));  // "1.234,56"
```

### Complex Date Formatting

```typescript
import { DotNetDateTimeFormatter, FieldedTextLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

const date = new Date(2024, 6, 5, 14, 30, 45, 123);

// ISO 8601 format
formatter.trySetFormat('yyyy-MM-ddTHH:mm:ss.fff');
console.log(formatter.toString(date));  // "2024-07-05T14:30:45.123"

// Custom readable format
formatter.trySetFormat("dddd, MMMM d 'at' h:mm tt");
console.log(formatter.toString(date));  // "Friday, July 5 at 2:30 PM"

// Filename-safe format
formatter.trySetFormat('yyyy-MM-dd_HHmmss');
console.log(formatter.toString(date));  // "2024-07-05_143045"

// Combining multiple elements
formatter.trySetFormat("'Week' W 'of' yyyy");
console.log(formatter.toString(date));  // "Week W of 2024"
```

### Flexible Number Parsing

```typescript
import { DotNetFloatFormatter, DotNetNumberStyleId, FieldedTextLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();

// Configure flexible parsing
formatter.styles = new Set([
  DotNetNumberStyleId.AllowLeadingWhite,
  DotNetNumberStyleId.AllowTrailingWhite,
  DotNetNumberStyleId.AllowLeadingSign,
  DotNetNumberStyleId.AllowTrailingSign,
  DotNetNumberStyleId.AllowDecimalPoint,
  DotNetNumberStyleId.AllowThousands,
  DotNetNumberStyleId.AllowParentheses,
]);

// All these formats will parse successfully
const testValues = [
  '1,234.56',
  '  1234.56  ',
  '+1234.56',
  '1234.56-',
  '(1234.56)',  // Negative
];

testValues.forEach(str => {
  const result = formatter.tryFromString(str);
  if (result.isOk()) {
    console.log(`"${str}" → ${result.value}`);
  }
});
```

## Error Handling

All formatting operations that can fail return a `Result<T>` type from `@pbkware/js-utils`. Check whether the operation succeeded before using the value:

```typescript
import { DotNetFloatFormatter } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();

// Setting format
const formatResult = formatter.trySetFormat('C2');
if (formatResult.isErr()) {
  console.error('Invalid format:', formatResult.error);
  return;
}

// Parsing
const parseResult = formatter.tryFromString('invalid');
if (parseResult.isErr()) {
  console.error('Parse failed:', parseResult.error);
  // parseResult.error contains the error message
} else {
  console.log('Parsed value:', parseResult.value);
}
```

## TypeScript Support

This library is written in TypeScript and includes full type definitions. All public APIs are typed and documented.

```typescript
import {
  DotNetDateTimeFormatter,
  DotNetFloatFormatter,
  DotNetIntegerFormatter,
  DotNetDecimalFormatter,
  FieldedTextLocaleSettings,
  DotNetNumberStyles,
  DotNetNumberStyleId,
  DotNetDateTimeStyles,
  DotNetDateTimeStyleId,
} from 'dot-net-date-number-formatting';
```

## Testing

The library includes comprehensive test coverage:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:ci
```

## Building

```bash
# Clean build artifacts
npm run clean

# Build TypeScript
npm run build

# Generate API documentation
npm run api

# Full distribution build
npm run dist
```

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure all tests pass before submitting pull requests.

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Support

For issues, questions, or contributions, please visit the project repository.
