# Number Parsing

The library supports parsing numbers from strings using configurable style flags.

## Number Formatters

All number formatters (`DotNetIntegerFormatter`, `DotNetFloatFormatter`, `DotNetDecimalFormatter`) support parsing:

```typescript
import { DotNetFloatFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

const result = formatter.tryFromString('1,234.56');
if (result.isOk()) {
  console.log(result.value);  // 1234.56
} else {
  console.error(result.error);
}
```

## Number Style Flags

Control which number formats are allowed during parsing using `DotNetNumberStyleId`:

### Available Flags

| Flag | Description |
|------|-------------|
| `AllowLeadingWhite` | Permit leading whitespace |
| `AllowTrailingWhite` | Permit trailing whitespace |
| `AllowLeadingSign` | Permit leading +/- sign |
| `AllowTrailingSign` | Permit trailing +/- sign |
| `AllowParentheses` | Permit parentheses for negatives |
| `AllowDecimalPoint` | Permit decimal point |
| `AllowThousands` | Permit thousands separator |
| `AllowExponent` | Permit exponential notation (e/E) |
| `AllowCurrencySymbol` | Permit currency symbol |
| `AllowHexSpecifier` | Parse as hexadecimal |

### Custom Style Combinations

```typescript
import { DotNetFloatFormatter, DotNetNumberStyleId, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

// Configure allowed styles
formatter.styles = new Set([
  DotNetNumberStyleId.AllowLeadingWhite,
  DotNetNumberStyleId.AllowTrailingWhite,
  DotNetNumberStyleId.AllowLeadingSign,
  DotNetNumberStyleId.AllowDecimalPoint,
]);

// These will parse successfully
let result = formatter.tryFromString('  -123.45  ');
console.log(result.value);  // -123.45

result = formatter.tryFromString('+456.78');
console.log(result.value);  // 456.78

// This will fail (thousands not allowed)
result = formatter.tryFromString('1,234.56');
console.log(result.isErr());  // true
```

## Predefined Style Sets

Use `DotNetNumberStyles` for common parsing scenarios:

### DotNetNumberStyles.none

No special styles - only basic digits:

```typescript
import { DotNetNumberStyles } from 'dot-net-date-number-formatting';

formatter.styles = DotNetNumberStyles.none;

// Only plain integers work
formatter.tryFromString('123');     // OK
formatter.tryFromString('  123  '); // Error
formatter.tryFromString('+123');    // Error
```

### DotNetNumberStyles.integer

Basic integer parsing with sign and whitespace:

```typescript
formatter.styles = DotNetNumberStyles.integer;

// Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign
formatter.tryFromString('  -123  ');  // OK: -123
formatter.tryFromString('+456');      // OK: 456
formatter.tryFromString('123.45');    // Error (no decimal)
```

### DotNetNumberStyles.number

Standard number parsing:

```typescript
formatter.styles = DotNetNumberStyles.number;

// Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign,
//           AllowTrailingSign, AllowDecimalPoint, AllowThousands
formatter.tryFromString('  1,234.56  ');  // OK: 1234.56
formatter.tryFromString('-123.45');       // OK: -123.45
formatter.tryFromString('123.45+');       // OK: 123.45
formatter.tryFromString('$123.45');       // Error (no currency)
```

### DotNetNumberStyles.float

Floating-point parsing with exponent support:

```typescript
formatter.styles = DotNetNumberStyles.float;

// Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign,
//           AllowDecimalPoint, AllowExponent
formatter.tryFromString('1.23e+10');    // OK: 12300000000
formatter.tryFromString('-4.56E-2');    // OK: -0.0456
formatter.tryFromString('1,234.56');    // Error (no thousands)
```

### DotNetNumberStyles.currency

Currency parsing:

```typescript
formatter.styles = DotNetNumberStyles.currency;

// Includes: AllowLeadingWhite, AllowTrailingWhite, AllowLeadingSign,
//           AllowTrailingSign, AllowDecimalPoint, AllowThousands,
//           AllowCurrencySymbol, AllowParentheses
formatter.tryFromString('$1,234.56');      // OK: 1234.56
formatter.tryFromString('($1,234.56)');    // OK: -1234.56
formatter.tryFromString('  $123.45  ');    // OK: 123.45
```

### DotNetNumberStyles.any

All styles allowed (except hex):

```typescript
formatter.styles = DotNetNumberStyles.any;

// All of these work
formatter.tryFromString('$1,234.56');    // OK
formatter.tryFromString('($123.45)');    // OK
formatter.tryFromString('1.23e+10');     // OK
formatter.tryFromString('  +123.45-  '); // OK (contradictory signs handled)
```

### DotNetNumberStyles.hexNumber

Hexadecimal parsing:

```typescript
import { DotNetIntegerFormatter, DotNetNumberStyles } from 'dot-net-date-number-formatting';

const intFormatter = new DotNetIntegerFormatter();
intFormatter.styles = DotNetNumberStyles.hexNumber;

// Includes: AllowLeadingWhite, AllowTrailingWhite, AllowHexSpecifier
const result = intFormatter.tryFromString('  FF  ');
console.log(result.value);  // 255n

intFormatter.tryFromString('0x1A');  // OK: 26n (0x prefix ignored)
intFormatter.tryFromString('ABCD');  // OK: 43981n
```

## Examples

### Flexible Number Parsing

```typescript
import { DotNetFloatFormatter, DotNetNumberStyleId, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();

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

// All these formats parse successfully
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

### Currency Parsing

```typescript
import { DotNetFloatFormatter, DotNetNumberStyles, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();
formatter.styles = DotNetNumberStyles.currency;

// Parse currency values
const values = [
  '$1,234.56',      // 1234.56
  '($1,234.56)',    // -1234.56
  '$ 123.45',       // 123.45
  '  $1,000  ',     // 1000
];

values.forEach(str => {
  const result = formatter.tryFromString(str);
  if (result.isOk()) {
    console.log(`${str} → ${result.value}`);
  }
});
```

### Scientific Notation Parsing

```typescript
formatter.styles = DotNetNumberStyles.float;

const scientificValues = [
  '1.23e+10',      // 12300000000
  '-4.56E-2',      // -0.0456
  '7.89E3',        // 7890
  '+1.0e0',        // 1
];

scientificValues.forEach(str => {
  const result = formatter.tryFromString(str);
  if (result.isOk()) {
    console.log(`${str} → ${result.value}`);
  }
});
```

### Hexadecimal Parsing

```typescript
import { DotNetIntegerFormatter, DotNetNumberStyles } from 'dot-net-date-number-formatting';

const intFormatter = new DotNetIntegerFormatter();
intFormatter.styles = DotNetNumberStyles.hexNumber;

const hexValues = [
  'FF',       // 255
  '0x1A',     // 26
  'ABCD',     // 43981
  '100',      // 256
];

hexValues.forEach(str => {
  const result = intFormatter.tryFromString(str);
  if (result.isOk()) {
    console.log(`${str} → ${result.value}`);
  }
});
```

## Error Handling

Always check the result when parsing:

```typescript
const formatter = new DotNetFloatFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();
formatter.styles = DotNetNumberStyles.number;

const result = formatter.tryFromString('invalid');

if (result.isErr()) {
  console.error('Parse failed:', result.error);
  // Access parseErrorText for more details
  console.error('Details:', formatter.parseErrorText);
} else {
  console.log('Parsed value:', result.value);
}
```

## Locale-Specific Parsing

Parsing respects locale settings for decimal and thousands separators:

```typescript
import { DotNetFloatFormatter, DotNetNumberStyles, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetFloatFormatter();
formatter.styles = DotNetNumberStyles.number;

// Parse US format
formatter.localeSettings = DotNetLocaleSettings.create('en-US');
console.log(formatter.tryFromString('1,234.56').value);  // 1234.56

// Parse French format (space as thousands, comma as decimal)
formatter.localeSettings = DotNetLocaleSettings.create('fr-FR');
console.log(formatter.tryFromString('1 234,56').value);  // 1234.56

// Parse German format (period as thousands, comma as decimal)
formatter.localeSettings = DotNetLocaleSettings.create('de-DE');
console.log(formatter.tryFromString('1.234,56').value);  // 1234.56
```
