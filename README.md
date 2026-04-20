# dot-net-date-number-formatting

A TypeScript library that provides .NET-compatible date/time and numeric formatting for JavaScript/TypeScript applications. This library implements format string parsing and formatting similar to Microsoft's .NET Framework, enabling cross-platform compatibility for applications that need to maintain consistent formatting between .NET and JavaScript/TypeScript.

## Overview

This library provides three main components:

- **DateTime Formatting** - Format dates using .NET standard and custom date/time format strings
- **Numeric Formatting** - Format numbers using .NET standard and custom numeric format strings  
- **Number Parsing** - Parse numbers with configurable style requirements (hex, currency, thousands separators, etc.)

Built on top of JavaScript's `Intl` API for locale-aware formatting while maintaining compatibility with .NET format string syntax.

## Installation

```bash
npm install dot-net-date-number-formatting
```

## Quick Start

### DateTime Formatting

```typescript
import { DotNetDateTimeFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

// Standard format
formatter.trySetFormat('d');  // Short date
console.log(formatter.toString(new Date(2024, 6, 5)));  // "7/5/2024"

// Custom format
formatter.trySetFormat('yyyy-MM-dd HH:mm:ss');
console.log(formatter.toString(new Date(2024, 6, 5, 14, 30, 0)));  // "2024-07-05 14:30:00"
```

### Numeric Formatting

```typescript
import { DotNetFloatFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

// Currency format
formatter.trySetFormat('C2');
console.log(formatter.toString(1234.56));  // "$1,234.56"

// Custom format
formatter.trySetFormat('#,##0.00');
console.log(formatter.toString(1234.56));  // "1,234.56"
```

### Number Parsing

```typescript
import { DotNetFloatFormatter, DotNetNumberStyles } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.styles = DotNetNumberStyles.number;

const result = formatter.tryFromString('1,234.56');
if (result.isOk()) {
  console.log(result.value);  // 1234.56
}
```

## Documentation

Comprehensive documentation is available:

- **[API Documentation](./docs)** - Full API reference with examples
- **[Getting Started Guide](./docs-src/guides/getting-started.md)** - Introduction and basic usage
- **[DateTime Formatting](./docs-src/guides/datetime-formatting.md)** - Standard and custom date/time formats
- **[Numeric Formatting](./docs-src/guides/numeric-formatting.md)** - Standard and custom number formats
- **[Number Parsing](./docs-src/guides/number-parsing.md)** - Parsing with style flags
- **[Locale Settings](./docs-src/guides/locales.md)** - Culture-specific formatting
- **[Advanced Examples](./docs-src/guides/advanced-examples.md)** - Real-world usage patterns

## Use Cases

- **Cross-platform applications** - Maintain consistent formatting between .NET backends and JavaScript/TypeScript frontends
- **Data export/import** - Format data for consistent serialization across platforms
- **Multi-locale applications** - Support users in different regions with locale-aware formatting
- **Financial applications** - Format currency and numeric values with precise control
- **Report generation** - Create formatted reports with .NET-compatible output

## Features

### DateTime Formatting
- ✅ All standard date/time format strings (d, D, f, F, g, G, M, O, s, t, T, u, Y)
- ✅ Custom format strings with day, month, year, hour, minute, second specifiers
- ✅ Fractional seconds (f, F)
- ✅ AM/PM designators
- ✅ Literal text in format strings
- ⚠️ Limited time zone support

### Numeric Formatting
- ✅ All standard numeric format strings (C, D, E, F, G, N, P, R, X, B)
- ✅ Custom format strings with digit placeholders (0, #)
- ✅ Section separators for positive/negative/zero values
- ✅ Thousands separators and number scaling
- ✅ Percentage and per mille formatting
- ✅ Scientific notation
- ✅ Hexadecimal and binary formats

### Number Parsing
- ✅ Configurable parsing styles (whitespace, signs, parentheses, etc.)
- ✅ Currency symbol support
- ✅ Thousands separator support
- ✅ Exponential notation
- ✅ Hexadecimal parsing

## Downloads

- [npm package](https://www.npmjs.com/package/dot-net-date-number-formatting)
- [GitHub repository](https://github.com/pbkware/dot-net-date-number-formatting)

## License

See [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please ensure all tests pass before submitting pull requests.

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Generate documentation
npm run docs
```

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/pbkware/dot-net-date-number-formatting).
