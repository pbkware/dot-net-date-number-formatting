# DateTime Formatting

The `DotNetDateTimeFormatter` class provides .NET-compatible date and time formatting for JavaScript/TypeScript applications.

## Standard Format Strings

Standard format strings use a single character to specify a predefined format pattern:

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

### Example

```typescript
import { DotNetDateTimeFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();
const date = new Date(2024, 6, 5, 14, 30, 45, 120);

formatter.trySetFormat('d');
console.log(formatter.toString(date));  // "7/5/2024"

formatter.trySetFormat('F');
console.log(formatter.toString(date));  // "Friday, July 5, 2024 2:30:45 PM"

formatter.trySetFormat('o');
console.log(formatter.toString(date));  // "2024-07-05T14:30:45.120Z"
```

## Custom Format Strings

Custom format strings allow you to define your own date/time patterns using specific format specifiers:

### Date Specifiers

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

### Time Specifiers

| Specifier | Description | Example |
|-----------|-------------|---------|
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

### Special Specifiers

| Specifier | Description | Example |
|-----------|-------------|---------|
| `/` | Date separator | Uses locale setting |
| `:` | Time separator | Uses locale setting |
| `'text'`, `"text"` | Literal string | `'at'` → `at` |
| `%c` | Single custom specifier | `%d` → `5` |
| `\c` | Escape next character | `\d` → `d` |

### Examples

```typescript
const formatter = new DotNetDateTimeFormatter();
formatter.localeSettings = DotNetLocaleSettings.createInvariant();
const date = new Date(2024, 6, 5, 14, 3, 9, 120);

// ISO 8601 format
formatter.trySetFormat('yyyy-MM-dd');
console.log(formatter.toString(date));  // "2024-07-05"

// Readable format
formatter.trySetFormat('dddd, MMMM d, yyyy');
console.log(formatter.toString(date));  // "Friday, July 5, 2024"

// Time format
formatter.trySetFormat('hh:mm:ss tt');
console.log(formatter.toString(date));  // "02:03:09 PM"

// Custom text
formatter.trySetFormat("'Today is' dddd");
console.log(formatter.toString(date));  // "Today is Friday"

// High precision
formatter.trySetFormat('HH:mm:ss.fff');
console.log(formatter.toString(date));  // "14:03:09.120"

// Filename-safe format
formatter.trySetFormat('yyyy-MM-dd_HHmmss');
console.log(formatter.toString(date));  // "2024-07-05_140309"
```

## Locale-Specific Formatting

Date separators and day/month names are affected by the locale settings:

```typescript
import { DotNetDateTimeFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

const formatter = new DotNetDateTimeFormatter();
const date = new Date(2024, 6, 5, 14, 30, 0);

// US English
formatter.localeSettings = DotNetLocaleSettings.create('en-US');
formatter.trySetFormat('d');
console.log(formatter.toString(date));  // "7/5/2024"

// British English
formatter.localeSettings = DotNetLocaleSettings.create('en-GB');
formatter.trySetFormat('d');
console.log(formatter.toString(date));  // "05/07/2024"

// German
formatter.localeSettings = DotNetLocaleSettings.create('de-DE');
formatter.trySetFormat('d');
console.log(formatter.toString(date));  // "05.07.2024"
```

## Limitations

Some features from .NET are not fully implemented:

- Time zone formatting specifiers are not fully implemented
- Era formatting (Japanese, Taiwanese, Korean calendars) is not supported
- Some culture-specific calendar systems are not supported
- Locale-specific formatting may differ slightly due to reliance on JavaScript's `Intl` API
