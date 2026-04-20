# Locale Settings

The `DotNetLocaleSettings` class provides locale-specific formatting settings including decimal separators, thousand separators, currency symbols, and date/time separators.

## Creating Locale Settings

### System Locale

Use the current system locale:

```typescript
import { DotNetLocaleSettings } from '@pbkware/dot-net-date-number-formatting';

const settings = DotNetLocaleSettings.current;
console.log(settings.name);  // e.g., "en-US"
console.log(settings.decimalSeparator);  // "."
console.log(settings.thousandSeparator);  // ","
```

### Invariant Culture

Use invariant culture (en-US style) for consistent formatting across systems:

```typescript
const invariant = DotNetLocaleSettings.createInvariant();
console.log(invariant.name);  // "en-US"
console.log(invariant.decimalSeparator);  // "."
console.log(invariant.thousandSeparator);  // ","
console.log(invariant.currencyString);  // "$"
```

### Specific Locale

Create settings for a specific locale:

```typescript
const french = DotNetLocaleSettings.create('fr-FR');
console.log(french.decimalSeparator);  // ","
console.log(french.thousandSeparator);  // " " (space)
console.log(french.currencyString);  // "€"

const german = DotNetLocaleSettings.create('de-DE');
console.log(german.decimalSeparator);  // ","
console.log(german.thousandSeparator);  // "."
console.log(german.currencyString);  // "€"

const british = DotNetLocaleSettings.create('en-GB');
console.log(british.decimalSeparator);  // "."
console.log(british.thousandSeparator);  // ","
console.log(british.currencyString);  // "£"
```

## Properties

### Locale Identification

- **`name`**: The locale name (e.g., "en-US", "fr-FR")
- **`id`**: The locale identifier (same as name)

### Number Formatting

- **`decimalSeparator`**: Character used for decimal point (e.g., "." or ",")
- **`thousandSeparator`**: Character used for thousands grouping (e.g., "," or "." or " ")
- **`currencyString`**: Currency symbol (e.g., "$", "€", "£")

### Date/Time Formatting

- **`dateSeparator`**: Character used between date components (e.g., "/", "-", ".")
- **`timeSeparator`**: Character used between time components (e.g., ":")

### Pre-configured Formatters

- **`defaultFloat`**: Pre-configured `Intl.NumberFormat` for floating-point
- **`defaultDecimal`**: Pre-configured `Intl.NumberFormat` for high-precision decimals
- **`defaultCurrency`**: Pre-configured `Intl.NumberFormat` for currency

## Usage with Formatters

### DateTime Formatting

```typescript
import { DotNetDateTimeFormatter, DotNetLocaleSettings } from '@pbkware/dot-net-date-number-formatting';

const formatter = new DotNetDateTimeFormatter();
const date = new Date(2024, 6, 5, 14, 30, 0);

// US format
formatter.localeSettings = DotNetLocaleSettings.create('en-US');
formatter.trySetFormat('d');
console.log(formatter.toString(date));  // "7/5/2024"

// European format
formatter.localeSettings = DotNetLocaleSettings.create('en-GB');
formatter.trySetFormat('d');
console.log(formatter.toString(date));  // "05/07/2024"

// German format
formatter.localeSettings = DotNetLocaleSettings.create('de-DE');
formatter.trySetFormat('d');
console.log(formatter.toString(date));  // "05.07.2024"
```

### Number Formatting

```typescript
import { DotNetFloatFormatter, DotNetLocaleSettings } from '@pbkware/dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
const value = 1234.56;

// US format
formatter.localeSettings = DotNetLocaleSettings.create('en-US');
formatter.trySetFormat('N2');
console.log(formatter.toString(value));  // "1,234.56"

// French format
formatter.localeSettings = DotNetLocaleSettings.create('fr-FR');
formatter.trySetFormat('N2');
console.log(formatter.toString(value));  // "1 234,56"

// German format
formatter.localeSettings = DotNetLocaleSettings.create('de-DE');
formatter.trySetFormat('N2');
console.log(formatter.toString(value));  // "1.234,56"
```

### Currency Formatting

```typescript
const formatter = new DotNetFloatFormatter();
const value = 1234.56;

// US Dollar
formatter.localeSettings = DotNetLocaleSettings.create('en-US');
formatter.trySetFormat('C2');
console.log(formatter.toString(value));  // "$1,234.56"

// Euro (France)
formatter.localeSettings = DotNetLocaleSettings.create('fr-FR');
formatter.trySetFormat('C2');
console.log(formatter.toString(value));  // "1 234,56 €"

// British Pound
formatter.localeSettings = DotNetLocaleSettings.create('en-GB');
formatter.trySetFormat('C2');
console.log(formatter.toString(value));  // "£1,234.56"
```

## Common Locale Examples

### United States (en-US)

```typescript
const locale = DotNetLocaleSettings.create('en-US');
// Decimal: .
// Thousands: ,
// Currency: $
// Date: / (M/D/Y)
// Example number: 1,234.56
// Example currency: $1,234.56
// Example date: 7/5/2024
```

### France (fr-FR)

```typescript
const locale = DotNetLocaleSettings.create('fr-FR');
// Decimal: ,
// Thousands: (space)
// Currency: €
// Date: /
// Example number: 1 234,56
// Example currency: 1 234,56 €
// Example date: 05/07/2024
```

### Germany (de-DE)

```typescript
const locale = DotNetLocaleSettings.create('de-DE');
// Decimal: ,
// Thousands: .
// Currency: €
// Date: .
// Example number: 1.234,56
// Example currency: 1.234,56 €
// Example date: 05.07.2024
```

### United Kingdom (en-GB)

```typescript
const locale = DotNetLocaleSettings.create('en-GB');
// Decimal: .
// Thousands: ,
// Currency: £
// Date: /
// Example number: 1,234.56
// Example currency: £1,234.56
// Example date: 05/07/2024
```

### Japan (ja-JP)

```typescript
const locale = DotNetLocaleSettings.create('ja-JP');
// Decimal: .
// Thousands: ,
// Currency: ¥
// Date: /
// Example number: 1,234.56
// Example currency: ¥1,235
// Example date: 2024/07/05
```

## Utility Methods

### Number Conversion

```typescript
const locale = DotNetLocaleSettings.createInvariant();

// Convert number to string
locale.numberToStr(1234.56, { minimumFractionDigits: 2 });
// "1234.56"

// Parse number from string
const result = locale.tryStrToNumber('1,234.56');
if (result.isOk()) {
  console.log(result.value);  // 1234.56
}
```

### Integer Conversion

```typescript
// Parse integer
const intResult = locale.tryStrToInt('123');
if (intResult.isOk()) {
  console.log(intResult.value);  // 123
}

// Parse BigInt
const bigIntResult = locale.tryStrToBigInt('9007199254740991');
if (bigIntResult.isOk()) {
  console.log(bigIntResult.value);  // 9007199254740991n
}
```

### Boolean Conversion

```typescript
locale.boolToStr(true);   // "true"
locale.boolToStr(false);  // "false"

const boolResult = locale.tryStrToBool('yes');
if (boolResult.isOk()) {
  console.log(boolResult.value);  // true
}

// Accepts: "true", "1", "yes" → true
// Accepts: "false", "0", "no" → false
```

### Date Conversion

```typescript
const date = new Date(2024, 6, 5);

// Format date
locale.dateToStr(date, { dateStyle: 'short' });
// "7/5/2024"

// Parse date
const dateResult = locale.tryStrToDate('2024-07-05');
if (dateResult.isOk()) {
  console.log(dateResult.value);  // Date object
}
```

### Character Case Conversion

```typescript
// Locale-aware uppercase conversion
const char = locale.toUpperChar('i');
// US locale: "I"
// Turkish locale (tr-TR): "İ"
```

## Best Practices

### Use Invariant Culture for Storage

When storing formatted values or when consistency across systems is important:

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();
formatter.trySetFormat('N2');

// Always formats the same way regardless of system locale
const stored = formatter.toString(1234.56);  // "1,234.56"
```

### Use Specific Locale for Display

When displaying values to users:

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.current;  // User's locale
formatter.trySetFormat('C2');

// Formats according to user's locale preferences
const displayed = formatter.toString(1234.56);
```

### Reuse Locale Settings

Create locale settings once and reuse:

```typescript
const locale = DotNetLocaleSettings.createInvariant();

const dateFormatter = new DotNetDateTimeFormatter();
dateFormatter.localeSettings = locale;

const numberFormatter = new DotNetFloatFormatter();
numberFormatter.localeSettings = locale;

// Both formatters use the same locale settings
```
