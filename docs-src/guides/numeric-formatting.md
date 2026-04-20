# Numeric Formatting

The library provides three formatter classes for different numeric types:

- `DotNetIntegerFormatter` - For `bigint` values
- `DotNetFloatFormatter` - For `number` values
- `DotNetDecimalFormatter` - For `number` values with high precision

## Standard Format Strings

Standard numeric format strings consist of a single format specifier and an optional precision specifier:

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

### Currency Format (C)

```typescript
import { DotNetFloatFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('C');     // Default precision (2)
console.log(formatter.toString(1234.56));  // "$1,234.56"

formatter.trySetFormat('C3');    // 3 decimal places
console.log(formatter.toString(1234.56));  // "$1,234.560"

formatter.trySetFormat('C0');    // No decimals
console.log(formatter.toString(1234.56));  // "$1,235"
```

### Decimal Format (D)

For integers only. Pads with leading zeros if necessary:

```typescript
import { DotNetIntegerFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetIntegerFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('D');
console.log(formatter.toString(123n));  // "123"

formatter.trySetFormat('D8');    // Minimum 8 digits
console.log(formatter.toString(123n));  // "00000123"
```

### Exponential Format (E)

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('E');     // Default precision (6)
console.log(formatter.toString(1234.56));  // "1.234560E+003"

formatter.trySetFormat('E2');    // 2 decimal places
console.log(formatter.toString(1234.56));  // "1.23E+003"

formatter.trySetFormat('e3');    // Lowercase
console.log(formatter.toString(1234.56));  // "1.235e+003"
```

### Fixed-Point Format (F)

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('F');     // Default precision (2)
console.log(formatter.toString(1234.56));  // "1234.56"

formatter.trySetFormat('F1');    // 1 decimal place
console.log(formatter.toString(1234.56));  // "1234.6"

formatter.trySetFormat('F4');    // 4 decimal places
console.log(formatter.toString(1234.56));  // "1234.5600"
```

### General Format (G)

Uses the more compact of fixed-point or scientific notation:

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('G');
console.log(formatter.toString(1234.56));      // "1234.56"
console.log(formatter.toString(0.0000001));    // "1e-7"
console.log(formatter.toString(1234567890));   // "1.23456789e+9"
```

### Number Format (N)

Includes thousands separators:

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('N');     // Default precision (2)
console.log(formatter.toString(1234567.89));  // "1,234,567.89"

formatter.trySetFormat('N0');    // No decimals
console.log(formatter.toString(1234567.89));  // "1,234,568"
```

### Percent Format (P)

Multiplies by 100 and adds percent sign:

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('P');     // Default precision (2)
console.log(formatter.toString(0.1234));  // "12.34%"

formatter.trySetFormat('P0');    // No decimals
console.log(formatter.toString(0.1234));  // "12%"

formatter.trySetFormat('P1');    // 1 decimal
console.log(formatter.toString(0.1234));  // "12.3%"
```

### Hexadecimal Format (X)

For integers only:

```typescript
const formatter = new DotNetIntegerFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('X');     // Uppercase
console.log(formatter.toString(255n));  // "FF"

formatter.trySetFormat('x');     // Lowercase
console.log(formatter.toString(255n));  // "ff"

formatter.trySetFormat('X8');    // Minimum 8 digits
console.log(formatter.toString(255n));  // "000000FF"
```

### Binary Format (B)

For integers only (.NET 8+ feature):

```typescript
const formatter = new DotNetIntegerFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

formatter.trySetFormat('B');
console.log(formatter.toString(42n));  // "101010"

formatter.trySetFormat('B16');   // Minimum 16 digits
console.log(formatter.toString(42n));  // "0000000000101010"
```

## Custom Format Strings

Custom format strings provide fine-grained control over number formatting:

### Basic Placeholders

| Specifier | Description | Example |
|-----------|-------------|---------|
| `0` | Zero placeholder | `00.00` → `01.50` or `123.45` |
| `#` | Digit placeholder | `##.##` → `1.5` or `123.45` |
| `.` | Decimal point | `0.00` → `1.50` |
| `,` | Thousands separator | `#,##0` → `1,234` |

**Zero Placeholder (0):** Always displays a digit, using 0 if no digit is present.

**Digit Placeholder (#):** Only displays a digit if present, otherwise shows nothing.

### Examples

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

// Zero placeholders
formatter.trySetFormat('0000.00');
console.log(formatter.toString(12.5));     // "0012.50"
console.log(formatter.toString(1234.5));   // "1234.50"

// Digit placeholders
formatter.trySetFormat('####.##');
console.log(formatter.toString(12.5));     // "12.5"
console.log(formatter.toString(1234.5));   // "1234.5"

// Thousands separator
formatter.trySetFormat('#,##0.00');
console.log(formatter.toString(1234.56));  // "1,234.56"
console.log(formatter.toString(12.56));    // "12.56"
```

### Percentage and Per Mille

| Specifier | Description | Example |
|-----------|-------------|---------|
| `%` | Percentage placeholder | `0%` → `50%` |
| `‰` | Per mille placeholder | `0‰` → `500‰` |

```typescript
formatter.trySetFormat('0.00%');
console.log(formatter.toString(0.086));  // "8.60%"

formatter.trySetFormat('0.00‰');
console.log(formatter.toString(0.086));  // "86.00‰"
```

### Scientific Notation

| Specifier | Description | Example |
|-----------|-------------|---------|
| `E0`, `E+0`, `E-0` | Exponential (uppercase) | `0.00E+00` → `1.23E+03` |
| `e0`, `e+0`, `e-0` | Exponential (lowercase) | `0.00e+00` → `1.23e+03` |

```typescript
formatter.trySetFormat('0.00E+00');
console.log(formatter.toString(1234.56));  // "1.23E+03"

formatter.trySetFormat('0.000e+00');
console.log(formatter.toString(1234.56));  // "1.235e+03"
```

### Section Separators

Use semicolons to define separate formats for positive, negative, and zero values:

```typescript
// Two sections: positive;negative
formatter.trySetFormat('#,##0.00;(#,##0.00)');
console.log(formatter.toString(1234.56));   // "1,234.56"
console.log(formatter.toString(-1234.56));  // "(1,234.56)"

// Three sections: positive;negative;zero
formatter.trySetFormat('#,##0.00;(#,##0.00);Zero');
console.log(formatter.toString(1234.56));   // "1,234.56"
console.log(formatter.toString(-1234.56));  // "(1,234.56)"
console.log(formatter.toString(0));         // "Zero"
```

### Number Scaling

Use commas at the end to scale numbers:

```typescript
// Divide by thousands
formatter.trySetFormat('#,##0,');
console.log(formatter.toString(1234567));  // "1,235"

// Divide by millions
formatter.trySetFormat('#,##0,,');
console.log(formatter.toString(1234567890));  // "1,235"
```

### Literal Text

| Specifier | Description | Example |
|-----------|-------------|---------|
| `'text'`, `"text"` | Literal string | `"Value:"0` → `Value:5` |
| `\` | Escape character | `\#` → `#` |

```typescript
formatter.trySetFormat('$#,##0.00');
console.log(formatter.toString(1234.56));  // "$1,234.56"

formatter.trySetFormat('"Total: "#,##0.00');
console.log(formatter.toString(1234.56));  // "Total: 1,234.56"

formatter.trySetFormat('\\##,##0');
console.log(formatter.toString(1234));  // "#1,234"
```

## Locale-Specific Formatting

Number formatting respects locale settings for decimal and thousands separators:

```typescript
import { DotNetFloatFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
const value = 1234.56;

// US English
formatter.localeSettings = DotNetLocaleSettings.create('en-US');
formatter.trySetFormat('N2');
console.log(formatter.toString(value));  // "1,234.56"

// French
formatter.localeSettings = DotNetLocaleSettings.create('fr-FR');
formatter.trySetFormat('N2');
console.log(formatter.toString(value));  // "1 234,56"

// German
formatter.localeSettings = DotNetLocaleSettings.create('de-DE');
formatter.trySetFormat('N2');
console.log(formatter.toString(value));  // "1.234,56"
```
