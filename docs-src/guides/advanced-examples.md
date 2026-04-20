# Advanced Examples

## Multi-Locale Application

Building an application that supports multiple locales:

```typescript
import { 
  DotNetFloatFormatter, 
  DotNetDateTimeFormatter,
  DotNetLocaleSettings 
} from 'dot-net-date-number-formatting';

class LocalizedFormatter {
  private numberFormatter: DotNetFloatFormatter;
  private dateFormatter: DotNetDateTimeFormatter;
  
  constructor(locale: string) {
    const settings = DotNetLocaleSettings.create(locale);
    
    this.numberFormatter = new DotNetFloatFormatter();
    this.numberFormatter.localeSettings = settings;
    
    this.dateFormatter = new DotNetDateTimeFormatter();
    this.dateFormatter.localeSettings = settings;
  }
  
  formatCurrency(value: number): string {
    this.numberFormatter.trySetFormat('C2');
    return this.numberFormatter.toString(value);
  }
  
  formatDate(date: Date): string {
    this.dateFormatter.trySetFormat('d');
    return this.dateFormatter.toString(date);
  }
  
  formatDateTime(date: Date): string {
    this.dateFormatter.trySetFormat('F');
    return this.dateFormatter.toString(date);
  }
}

// Usage
const usFormatter = new LocalizedFormatter('en-US');
console.log(usFormatter.formatCurrency(1234.56));  // "$1,234.56"
console.log(usFormatter.formatDate(new Date(2024, 6, 5)));  // "7/5/2024"

const frFormatter = new LocalizedFormatter('fr-FR');
console.log(frFormatter.formatCurrency(1234.56));  // "1 234,56 €"
console.log(frFormatter.formatDate(new Date(2024, 6, 5)));  // "05/07/2024"
```

## Data Export/Import

Formatting data for export and parsing on import:

```typescript
import { 
  DotNetFloatFormatter, 
  DotNetDateTimeFormatter,
  DotNetNumberStyles,
  DotNetLocaleSettings 
} from 'dot-net-date-number-formatting';

class DataExporter {
  private numberFormatter: DotNetFloatFormatter;
  private dateFormatter: DotNetDateTimeFormatter;
  
  constructor() {
    // Use invariant culture for consistent export format
    const settings = DotNetLocaleSettings.createInvariant();
    
    this.numberFormatter = new DotNetFloatFormatter();
    this.numberFormatter.localeSettings = settings;
    
    this.dateFormatter = new DotNetDateTimeFormatter();
    this.dateFormatter.localeSettings = settings;
  }
  
  exportRecord(data: { name: string; amount: number; date: Date }): string {
    this.numberFormatter.trySetFormat('F2');
    this.dateFormatter.trySetFormat('yyyy-MM-dd HH:mm:ss');
    
    const amountStr = this.numberFormatter.toString(data.amount);
    const dateStr = this.dateFormatter.toString(data.date);
    
    return `${data.name},${amountStr},${dateStr}`;
  }
  
  importRecord(line: string): { name: string; amount: number; date: Date } | null {
    const parts = line.split(',');
    if (parts.length !== 3) return null;
    
    this.numberFormatter.styles = DotNetNumberStyles.float;
    const amountResult = this.numberFormatter.tryFromString(parts[1]);
    if (amountResult.isErr()) return null;
    
    const dateResult = this.dateFormatter.tryFromString(parts[2]);
    if (dateResult.isErr()) return null;
    
    return {
      name: parts[0],
      amount: amountResult.value,
      date: dateResult.value
    };
  }
}

// Usage
const exporter = new DataExporter();

// Export
const record = {
  name: 'Item1',
  amount: 1234.56,
  date: new Date(2024, 6, 5, 14, 30, 0)
};
const csv = exporter.exportRecord(record);
console.log(csv);  // "Item1,1234.56,2024-07-05 14:30:00"

// Import
const imported = exporter.importRecord(csv);
console.log(imported);
// { name: 'Item1', amount: 1234.56, date: Date(...) }
```

## Report Generation

Generating formatted reports:

```typescript
import { 
  DotNetFloatFormatter, 
  DotNetDateTimeFormatter,
  DotNetLocaleSettings 
} from 'dot-net-date-number-formatting';

interface SalesRecord {
  product: string;
  quantity: number;
  unitPrice: number;
  date: Date;
}

class SalesReport {
  private currencyFormatter: DotNetFloatFormatter;
  private numberFormatter: DotNetFloatFormatter;
  private dateFormatter: DotNetDateTimeFormatter;
  
  constructor(locale: string = 'en-US') {
    const settings = DotNetLocaleSettings.create(locale);
    
    this.currencyFormatter = new DotNetFloatFormatter();
    this.currencyFormatter.localeSettings = settings;
    this.currencyFormatter.trySetFormat('C2');
    
    this.numberFormatter = new DotNetFloatFormatter();
    this.numberFormatter.localeSettings = settings;
    this.numberFormatter.trySetFormat('N0');
    
    this.dateFormatter = new DotNetDateTimeFormatter();
    this.dateFormatter.localeSettings = settings;
    this.dateFormatter.trySetFormat('d');
  }
  
  formatRecord(record: SalesRecord): string {
    const date = this.dateFormatter.toString(record.date);
    const quantity = this.numberFormatter.toString(record.quantity);
    const price = this.currencyFormatter.toString(record.unitPrice);
    const total = this.currencyFormatter.toString(record.quantity * record.unitPrice);
    
    return `${date.padEnd(12)} ${record.product.padEnd(20)} ${quantity.padStart(8)} ${price.padStart(12)} ${total.padStart(12)}`;
  }
  
  generate(records: SalesRecord[]): string {
    const header = 'Date        Product              Quantity        Price       Total';
    const separator = '='.repeat(70);
    
    const lines = records.map(r => this.formatRecord(r));
    
    // Calculate totals
    const totalQty = records.reduce((sum, r) => sum + r.quantity, 0);
    const totalAmount = records.reduce((sum, r) => sum + (r.quantity * r.unitPrice), 0);
    
    const totalQtyStr = this.numberFormatter.toString(totalQty);
    const totalAmtStr = this.currencyFormatter.toString(totalAmount);
    const totals = `${''.padEnd(33)}${totalQtyStr.padStart(8)} ${''.padStart(12)} ${totalAmtStr.padStart(12)}`;
    
    return [header, separator, ...lines, separator, totals].join('\n');
  }
}

// Usage
const report = new SalesReport('en-US');

const sales: SalesRecord[] = [
  { product: 'Widget A', quantity: 100, unitPrice: 12.50, date: new Date(2024, 6, 1) },
  { product: 'Widget B', quantity: 50, unitPrice: 25.00, date: new Date(2024, 6, 2) },
  { product: 'Widget C', quantity: 75, unitPrice: 18.75, date: new Date(2024, 6, 3) },
];

console.log(report.generate(sales));
// Date        Product              Quantity        Price       Total
// ======================================================================
// 7/1/2024    Widget A                  100      $12.50    $1,250.00
// 7/2/2024    Widget B                   50      $25.00    $1,250.00
// 7/3/2024    Widget C                   75      $18.75    $1,406.25
// ======================================================================
//                                        225                $3,906.25
```

## Configuration File Formatting

Storing configuration values with consistent formatting:

```typescript
import { 
  DotNetFloatFormatter, 
  DotNetIntegerFormatter,
  DotNetDateTimeFormatter,
  DotNetLocaleSettings 
} from 'dot-net-date-number-formatting';

class ConfigManager {
  private settings = DotNetLocaleSettings.createInvariant();
  
  saveConfig(config: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(config)) {
      result[key] = this.formatValue(value);
    }
    
    return result;
  }
  
  private formatValue(value: any): string {
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        const formatter = new DotNetIntegerFormatter();
        formatter.localeSettings = this.settings;
        formatter.trySetFormat('D');
        return formatter.toString(BigInt(value));
      } else {
        const formatter = new DotNetFloatFormatter();
        formatter.localeSettings = this.settings;
        formatter.trySetFormat('F6');
        return formatter.toString(value);
      }
    } else if (value instanceof Date) {
      const formatter = new DotNetDateTimeFormatter();
      formatter.localeSettings = this.settings;
      formatter.trySetFormat('O');
      return formatter.toString(value);
    } else if (typeof value === 'boolean') {
      return this.settings.boolToStr(value);
    } else {
      return String(value);
    }
  }
}

// Usage
const manager = new ConfigManager();

const config = {
  port: 8080,
  timeout: 30.5,
  enabled: true,
  lastUpdate: new Date(2024, 6, 5, 14, 30, 0),
  name: 'My App'
};

const saved = manager.saveConfig(config);
console.log(saved);
// {
//   port: "8080",
//   timeout: "30.500000",
//   enabled: "true",
//   lastUpdate: "2024-07-05T14:30:00.000Z",
//   name: "My App"
// }
```

## Complex Date Formatting

Advanced date formatting scenarios:

```typescript
import { DotNetDateTimeFormatter, DotNetLocaleSettings } from 'dot-net-date-number-formatting';

class DateDisplay {
  private formatter: DotNetDateTimeFormatter;
  
  constructor(locale: string = 'en-US') {
    this.formatter = new DotNetDateTimeFormatter();
    this.formatter.localeSettings = DotNetLocaleSettings.create(locale);
  }
  
  // ISO 8601 format for APIs
  toISO(date: Date): string {
    this.formatter.trySetFormat('O');
    return this.formatter.toString(date);
  }
  
  // User-friendly display
  toFriendly(date: Date): string {
    this.formatter.trySetFormat("dddd, MMMM d 'at' h:mm tt");
    return this.formatter.toString(date);
  }
  
  // Filename-safe format
  toFilename(date: Date): string {
    this.formatter.trySetFormat('yyyy-MM-dd_HHmmss');
    return this.formatter.toString(date);
  }
  
  // Log timestamp
  toLogTimestamp(date: Date): string {
    this.formatter.trySetFormat('[yyyy-MM-dd HH:mm:ss.fff]');
    return this.formatter.toString(date);
  }
  
  // Relative date (simplified)
  toRelative(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      this.formatter.trySetFormat("'Today at' h:mm tt");
      return this.formatter.toString(date);
    } else if (diffDays === 1) {
      this.formatter.trySetFormat("'Yesterday at' h:mm tt");
      return this.formatter.toString(date);
    } else if (diffDays < 7) {
      this.formatter.trySetFormat("dddd 'at' h:mm tt");
      return this.formatter.toString(date);
    } else {
      this.formatter.trySetFormat('M/d/yyyy');
      return this.formatter.toString(date);
    }
  }
}

// Usage
const display = new DateDisplay('en-US');
const date = new Date(2024, 6, 5, 14, 30, 45, 123);

console.log(display.toISO(date));
// "2024-07-05T14:30:45.123Z"

console.log(display.toFriendly(date));
// "Friday, July 5 at 2:30 PM"

console.log(display.toFilename(date));
// "2024-07-05_143045"

console.log(display.toLogTimestamp(date));
// "[2024-07-05 14:30:45.123]"
```

## Financial Calculations

Working with financial data:

```typescript
import { 
  DotNetDecimalFormatter,
  DotNetFloatFormatter, 
  DotNetLocaleSettings 
} from 'dot-net-date-number-formatting';

class FinancialCalculator {
  private decimalFormatter: DotNetDecimalFormatter;
  private currencyFormatter: DotNetFloatFormatter;
  private percentFormatter: DotNetFloatFormatter;
  
  constructor(locale: string = 'en-US') {
    const settings = DotNetLocaleSettings.create(locale);
    
    this.decimalFormatter = new DotNetDecimalFormatter();
    this.decimalFormatter.localeSettings = settings;
    this.decimalFormatter.trySetFormat('F6');
    
    this.currencyFormatter = new DotNetFloatFormatter();
    this.currencyFormatter.localeSettings = settings;
    this.currencyFormatter.trySetFormat('C2');
    
    this.percentFormatter = new DotNetFloatFormatter();
    this.percentFormatter.localeSettings = settings;
    this.percentFormatter.trySetFormat('P2');
  }
  
  calculateInterest(principal: number, rate: number, years: number): {
    interest: string;
    total: string;
    rate: string;
  } {
    const interest = principal * rate * years;
    const total = principal + interest;
    
    return {
      rate: this.percentFormatter.toString(rate),
      interest: this.currencyFormatter.toString(interest),
      total: this.currencyFormatter.toString(total)
    };
  }
  
  formatTransaction(amount: number, description: string): string {
    this.currencyFormatter.trySetFormat('$#,##0.00;($#,##0.00)');
    const formatted = this.currencyFormatter.toString(amount);
    return `${description.padEnd(30)} ${formatted.padStart(15)}`;
  }
}

// Usage
const calc = new FinancialCalculator('en-US');

const result = calc.calculateInterest(10000, 0.05, 5);
console.log(`Rate: ${result.rate}`);       // "Rate: 5.00%"
console.log(`Interest: ${result.interest}`);  // "Interest: $2,500.00"
console.log(`Total: ${result.total}`);      // "Total: $12,500.00"

console.log(calc.formatTransaction(1234.56, 'Deposit'));
// "Deposit                         $1,234.56"
console.log(calc.formatTransaction(-567.89, 'Withdrawal'));
// "Withdrawal                      ($567.89)"
```
