# Getting Started

## Installation

Install the library using npm:

```bash
npm install dot-net-date-number-formatting
```

## Basic Usage

The library provides three main components for formatting and parsing:

### DateTime Formatting

Format dates using .NET-compatible format strings:

```typescript
import { DotNetDateTimeFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

// Standard format strings
formatter.trySetFormat('d');        // Short date
console.log(formatter.toString(new Date(2024, 6, 5)));  // "7/5/2024"

formatter.trySetFormat('F');        // Full date/time
console.log(formatter.toString(new Date(2024, 6, 5, 14, 30, 0)));
// "Friday, July 5, 2024 2:30:00 PM"

// Custom format strings
formatter.trySetFormat('yyyy-MM-dd');
console.log(formatter.toString(new Date(2024, 6, 5)));  // "2024-07-05"
```

### Numeric Formatting

Format numbers using .NET-compatible format strings:

```typescript
import { DotNetFloatFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

// Standard format strings
formatter.trySetFormat('C');        // Currency
console.log(formatter.toString(1234.56));  // "$1,234.56"

formatter.trySetFormat('N2');       // Number with 2 decimals
console.log(formatter.toString(1234567.89));  // "1,234,567.89"

formatter.trySetFormat('P1');       // Percentage with 1 decimal
console.log(formatter.toString(0.1234));  // "12.3%"
```

### Number Parsing

Parse numbers with specific style requirements:

```typescript
import { DotNetFloatFormatter, DotNetNumberStyles, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

// Use predefined styles
formatter.styles = DotNetNumberStyles.number;
const result = formatter.tryFromString('1,234.56');
if (result.isOk()) {
  console.log(result.value);  // 1234.56
}
```

## Error Handling

All operations that can fail return a `Result<T>` type. Always check if the operation succeeded:

```typescript
const formatResult = formatter.trySetFormat('C2');
if (formatResult.isErr()) {
  console.error('Invalid format:', formatResult.error);
  return;
}

const parseResult = formatter.tryFromString('invalid');
if (parseResult.isErr()) {
  console.error('Parse failed:', parseResult.error);
} else {
  console.log('Parsed value:', parseResult.value);
}
```

## Next Steps

- Learn about [DateTime Formatting](./datetime-formatting.md)
- Learn about [Numeric Formatting](./numeric-formatting.md)
- Learn about [Number Parsing](./number-parsing.md)
- Learn about [Locale Settings](./locales.md)
- See [Advanced Examples](./advanced-examples.md)
