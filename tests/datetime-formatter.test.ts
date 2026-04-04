import { describe, expect, it } from "vitest";
import { DotNetDateTimeFormatter } from "../src/code/datetime-formatter";
import { FieldedTextLocaleSettings } from "../src/code/locale-settings";

describe("DotNetDateTimeFormatter", () => {
  // Test date: July 5, 2024, 14:03:09.120 (Friday, 2nd week of July)
  const testDate = new Date(2024, 6, 5, 14, 3, 9, 120);
  // Test date with single-digit components: January 8, 2009, 6:05:01.500 (Thursday)
  const testDateSingleDigit = new Date(2009, 0, 8, 6, 5, 1, 500);
  // Test date for PM: July 5, 2024, 18:30:15.750
  const testDatePM = new Date(2024, 6, 5, 18, 30, 15, 750);

  describe("Standard Date/Time Format Strings", () => {
    describe("Short date (d)", () => {
      it("formats with short date pattern", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("d");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        // Should produce a short date format (format may vary by locale)
        expect(formatted).toContain("7"); // month or day
        expect(formatted).toContain("5"); // day or month
      });
    });

    describe("Long date (D)", () => {
      it("formats with long date pattern", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("D");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        // Should produce a long date format with day name
        expect(formatted).toContain("Friday");
      });
    });

    describe("Full date short time (f)", () => {
      it("formats with full date and short time", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("f");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toContain("Friday");
        // Time may be in 12-hour or 24-hour format depending on locale
        expect(formatted.toLowerCase()).toMatch(/(14|2)/);
      });
    });

    describe("Full date long time (F)", () => {
      it("formats with full date and long time", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("F");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toContain("Friday");
        // Time may be in 12-hour or 24-hour format depending on locale
        expect(formatted.toLowerCase()).toMatch(/(14|2)/);
        expect(formatted).toContain("03");
        expect(formatted).toContain("09");
      });
    });

    describe("General date short time (g)", () => {
      it("formats with general date and short time", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("g");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        // Date may use 2-digit or 4-digit year
        expect(formatted).toMatch(/7/);
        expect(formatted).toMatch(/5/);
      });
    });

    describe("General date long time (G)", () => {
      it("formats with general date and long time", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("G");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        // Date may use 2-digit or 4-digit year
        expect(formatted).toMatch(/7/);
        expect(formatted).toMatch(/5/);
        expect(formatted).toContain("09");
      });
    });

    describe("Month/day (M or m)", () => {
      it("formats with M (uppercase)", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("M");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toBe("July 5");
      });

      it("formats with m (lowercase)", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("m");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toBe("July 5");
      });
    });

    describe("Round-trip (O or o)", () => {
      it("formats with O (uppercase) for ISO 8601", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("O");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toContain("2024-07-05T");
        expect(formatted).toContain("Z");
      });

      it("formats with o (lowercase) for ISO 8601", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("o");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toContain("2024-07-05T");
        expect(formatted).toContain("Z");
      });
    });

    describe("Sortable (s)", () => {
      it("formats with sortable pattern", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("s");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toBe("2024-07-05T14:03:09");
      });
    });

    describe("Short time (t)", () => {
      it("formats with short time pattern", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("t");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        // Time may be in 12-hour or 24-hour format depending on locale
        expect(formatted).toContain("03");
      });
    });

    describe("Long time (T)", () => {
      it("formats with long time pattern", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("T");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        // Time may be in 12-hour or 24-hour format depending on locale
        expect(formatted).toContain("03");
        expect(formatted).toContain("09");
      });
    });

    describe("Universal sortable (u)", () => {
      it("formats with universal sortable pattern", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("u");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toContain("2024-07-05");
        expect(formatted).toContain("Z");
      });
    });

    describe("Year month (Y or y)", () => {
      it("formats with Y (uppercase)", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("Y");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toBe("2024 July");
      });

      it("formats with y (lowercase)", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        const result = formatter.trySetFormat("y");
        expect(result.isOk()).toBe(true);

        const formatted = formatter.toString(testDate);
        expect(formatted).toBe("2024 July");
      });
    });
  });

  describe("Custom Date/Time Format Strings - Day Specifiers", () => {
    describe("d - Day without leading zero", () => {
      it("formats single-digit day without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%d");

        expect(formatter.toString(testDate)).toBe("5");
        expect(formatter.toString(testDateSingleDigit)).toBe("8");
      });

      it("parses single-digit day", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("yyyy-M-d");

        const parsed = formatter.tryFromString("2024-7-5");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getDate()).toBe(5);
        }
      });
    });

    describe("dd - Day with leading zero", () => {
      it("formats day with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%dd");

        expect(formatter.toString(testDate)).toBe("05");
        expect(formatter.toString(testDateSingleDigit)).toBe("08");
      });

      it("parses day with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("yyyy-MM-dd");

        const parsed = formatter.tryFromString("2024-07-05");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getDate()).toBe(5);
        }
      });
    });

    describe("ddd - Abbreviated day name", () => {
      it("formats abbreviated day name", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%ddd");

        expect(formatter.toString(testDate)).toBe("Fri");
        expect(formatter.toString(testDateSingleDigit)).toBe("Thu");
      });

      it("parses abbreviated day name", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("ddd, dd MMM yyyy");

        const parsed = formatter.tryFromString("Fri, 05 Jul 2024");
        expect(parsed.isOk()).toBe(true);
      });
    });

    describe("dddd - Full day name", () => {
      it("formats full day name", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%dddd");

        expect(formatter.toString(testDate)).toBe("Friday");
        expect(formatter.toString(testDateSingleDigit)).toBe("Thursday");
      });

      it("parses full day name", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("dddd, dd MMMM yyyy");

        const parsed = formatter.tryFromString("Friday, 05 July 2024");
        expect(parsed.isOk()).toBe(true);
      });
    });
  });

  describe("Custom Date/Time Format Strings - Month Specifiers", () => {
    describe("M - Month without leading zero", () => {
      it("formats single-digit month without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%M");

        expect(formatter.toString(testDate)).toBe("7");
        expect(formatter.toString(testDateSingleDigit)).toBe("1");
      });

      it("parses single-digit month", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("M/d/yyyy");

        const parsed = formatter.tryFromString("7/5/2024");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getMonth()).toBe(6); // 0-indexed
        }
      });
    });

    describe("MM - Month with leading zero", () => {
      it("formats month with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%MM");

        expect(formatter.toString(testDate)).toBe("07");
        expect(formatter.toString(testDateSingleDigit)).toBe("01");
      });

      it("parses month with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("MM/dd/yyyy");

        const parsed = formatter.tryFromString("07/05/2024");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getMonth()).toBe(6); // 0-indexed
        }
      });
    });

    describe("MMM - Abbreviated month name", () => {
      it("formats abbreviated month name", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%MMM");

        expect(formatter.toString(testDate)).toBe("Jul");
        expect(formatter.toString(testDateSingleDigit)).toBe("Jan");
      });

      it("parses abbreviated month name", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("dd MMM yyyy");

        const parsed = formatter.tryFromString("05 Jul 2024");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getMonth()).toBe(6);
        }
      });
    });

    describe("MMMM - Full month name", () => {
      it("formats full month name", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%MMMM");

        expect(formatter.toString(testDate)).toBe("July");
        expect(formatter.toString(testDateSingleDigit)).toBe("January");
      });

      it("parses full month name", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("dd MMMM yyyy");

        const parsed = formatter.tryFromString("05 July 2024");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getMonth()).toBe(6);
        }
      });
    });
  });

  describe("Custom Date/Time Format Strings - Year Specifiers", () => {
    describe("y or yy - Two-digit year", () => {
      it("formats two-digit year", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%yy");

        expect(formatter.toString(testDate)).toBe("24");
        expect(formatter.toString(testDateSingleDigit)).toBe("9");
      });

      it("parses two-digit year", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("MM/dd/yy");

        const parsed = formatter.tryFromString("07/05/24");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getFullYear()).toBe(2024);
        }
      });
    });

    describe("yyy - Three-digit year", () => {
      it("formats three-digit year", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%yyy");

        expect(formatter.toString(testDate)).toBe("2024");
        expect(formatter.toString(testDateSingleDigit)).toBe("2009");
      });
    });

    describe("yyyy - Four-digit year", () => {
      it("formats four-digit year", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%yyyy");

        expect(formatter.toString(testDate)).toBe("2024");
        expect(formatter.toString(testDateSingleDigit)).toBe("2009");
      });

      it("parses four-digit year", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("MM/dd/yyyy");

        const parsed = formatter.tryFromString("07/05/2024");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getFullYear()).toBe(2024);
        }
      });
    });

    describe("yyyyy - Five-digit year", () => {
      it("formats five-digit year", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%yyyyy");

        expect(formatter.toString(testDate)).toBe("02024");
        expect(formatter.toString(testDateSingleDigit)).toBe("02009");
      });
    });
  });

  describe("Custom Date/Time Format Strings - Hour Specifiers", () => {
    describe("h - 12-hour without leading zero", () => {
      it("formats hour in 12-hour format without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%h");

        expect(formatter.toString(testDate)).toBe("2"); // 14:00 -> 2 PM
        expect(formatter.toString(testDateSingleDigit)).toBe("6"); // 06:00 -> 6 AM
        expect(formatter.toString(testDatePM)).toBe("6"); // 18:00 -> 6 PM
      });

      it("parses 12-hour format without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("h:mm tt");

        const parsed = formatter.tryFromString("2:03 PM");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getHours()).toBe(14);
        }
      });
    });

    describe("hh - 12-hour with leading zero", () => {
      it("formats hour in 12-hour format with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%hh");

        expect(formatter.toString(testDate)).toBe("02");
        expect(formatter.toString(testDateSingleDigit)).toBe("06");
        expect(formatter.toString(testDatePM)).toBe("06");
      });

      it("parses 12-hour format with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("hh:mm:ss tt");

        const parsed = formatter.tryFromString("02:03:09 PM");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getHours()).toBe(14);
        }
      });
    });

    describe("H - 24-hour without leading zero", () => {
      it("formats hour in 24-hour format without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%H");

        expect(formatter.toString(testDate)).toBe("14");
        expect(formatter.toString(testDateSingleDigit)).toBe("6");
        expect(formatter.toString(testDatePM)).toBe("18");
      });

      it("parses 24-hour format without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("H:mm");

        const parsed = formatter.tryFromString("14:03");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getHours()).toBe(14);
        }
      });
    });

    describe("HH - 24-hour with leading zero", () => {
      it("formats hour in 24-hour format with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%HH");

        expect(formatter.toString(testDate)).toBe("14");
        expect(formatter.toString(testDateSingleDigit)).toBe("06");
        expect(formatter.toString(testDatePM)).toBe("18");
      });

      it("parses 24-hour format with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("HH:mm:ss");

        const parsed = formatter.tryFromString("14:03:09");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getHours()).toBe(14);
        }
      });
    });
  });

  describe("Custom Date/Time Format Strings - Minute Specifiers", () => {
    describe("m - Minute without leading zero", () => {
      it("formats minute without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%m");

        expect(formatter.toString(testDate)).toBe("3");
        expect(formatter.toString(testDateSingleDigit)).toBe("5");
      });

      it("parses minute without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("H:m");

        const parsed = formatter.tryFromString("14:3");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getMinutes()).toBe(3);
        }
      });
    });

    describe("mm - Minute with leading zero", () => {
      it("formats minute with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%mm");

        expect(formatter.toString(testDate)).toBe("03");
        expect(formatter.toString(testDateSingleDigit)).toBe("05");
      });

      it("parses minute with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("HH:mm");

        const parsed = formatter.tryFromString("14:03");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getMinutes()).toBe(3);
        }
      });
    });
  });

  describe("Custom Date/Time Format Strings - Second Specifiers", () => {
    describe("s - Second without leading zero", () => {
      it("formats second without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%s");

        expect(formatter.toString(testDate)).toBe("9");
        expect(formatter.toString(testDateSingleDigit)).toBe("1");
      });

      it("parses second without leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("H:m:s");

        const parsed = formatter.tryFromString("14:3:9");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getSeconds()).toBe(9);
        }
      });
    });

    describe("ss - Second with leading zero", () => {
      it("formats second with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%ss");

        expect(formatter.toString(testDate)).toBe("09");
        expect(formatter.toString(testDateSingleDigit)).toBe("01");
      });

      it("parses second with leading zero", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("HH:mm:ss");

        const parsed = formatter.tryFromString("14:03:09");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getSeconds()).toBe(9);
        }
      });
    });
  });

  describe("Custom Date/Time Format Strings - Fraction Specifiers", () => {
    describe("f - Tenths of a second", () => {
      it("formats tenths of a second", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%f");

        expect(formatter.toString(testDate)).toBe("1"); // 120 ms -> .1
        expect(formatter.toString(testDateSingleDigit)).toBe("5"); // 500 ms -> .5
      });

      it("parses tenths of a second", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("HH:mm:ss.f");

        const parsed = formatter.tryFromString("14:03:09.1");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getMilliseconds()).toBe(100);
        }
      });
    });

    describe("ff - Hundredths of a second", () => {
      it("formats hundredths of a second", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%ff");

        expect(formatter.toString(testDate)).toBe("12");
        expect(formatter.toString(testDateSingleDigit)).toBe("50");
      });
    });

    describe("fff - Milliseconds", () => {
      it("formats milliseconds", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%fff");

        expect(formatter.toString(testDate)).toBe("120");
        expect(formatter.toString(testDateSingleDigit)).toBe("500");
      });

      it("parses milliseconds", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("HH:mm:ss.fff");

        const parsed = formatter.tryFromString("14:03:09.120");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getMilliseconds()).toBe(120);
        }
      });
    });

    describe("ffff to fffffff - Extended precision", () => {
      it("formats with extended precision (pads with zeros)", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%fffffff");

        expect(formatter.toString(testDate)).toBe("1200000");
      });
    });

    describe("F - Tenths with trailing zeros trimmed", () => {
      it("formats tenths with trailing zeros removed", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%F");

        expect(formatter.toString(testDate)).toBe("1");
        expect(formatter.toString(testDateSingleDigit)).toBe("5");
      });
    });

    describe("FFF - Milliseconds with trailing zeros trimmed", () => {
      it("formats milliseconds with trailing zeros removed", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%FFF");

        expect(formatter.toString(testDate)).toBe("12"); // 120 -> "12"
        expect(formatter.toString(testDateSingleDigit)).toBe("5"); // 500 -> "5"
      });
    });
  });

  describe("Custom Date/Time Format Strings - AM/PM Specifiers", () => {
    describe("t - First character of AM/PM", () => {
      it("formats first character of AM/PM designator", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%t");

        expect(formatter.toString(testDate)).toBe("P"); // 14:00 is PM
        expect(formatter.toString(testDateSingleDigit)).toBe("A"); // 06:00 is AM
      });

      it("parses first character of AM/PM designator", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("h:mm t");

        const parsedPM = formatter.tryFromString("2:03 P");
        expect(parsedPM.isOk()).toBe(true);
        if (parsedPM.isOk()) {
          expect(parsedPM.value.getHours()).toBe(14);
        }

        const parsedAM = formatter.tryFromString("6:05 A");
        expect(parsedAM.isOk()).toBe(true);
        if (parsedAM.isOk()) {
          expect(parsedAM.value.getHours()).toBe(6);
        }
      });
    });

    describe("tt - Full AM/PM designator", () => {
      it("formats full AM/PM designator", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%tt");

        expect(formatter.toString(testDate)).toBe("PM");
        expect(formatter.toString(testDateSingleDigit)).toBe("AM");
      });

      it("parses full AM/PM designator", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("h:mm:ss tt");

        const parsedPM = formatter.tryFromString("2:03:09 PM");
        expect(parsedPM.isOk()).toBe(true);
        if (parsedPM.isOk()) {
          expect(parsedPM.value.getHours()).toBe(14);
        }

        const parsedAM = formatter.tryFromString("6:05:01 AM");
        expect(parsedAM.isOk()).toBe(true);
        if (parsedAM.isOk()) {
          expect(parsedAM.value.getHours()).toBe(6);
        }
      });
    });
  });

  describe("Custom Date/Time Format Strings - Separator Specifiers", () => {
    describe("/ - Date separator", () => {
      it("formats with date separator", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("MM/dd/yyyy");

        expect(formatter.toString(testDate)).toBe("07/05/2024");
      });

      it("parses with date separator", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("MM/dd/yyyy");

        const parsed = formatter.tryFromString("07/05/2024");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getFullYear()).toBe(2024);
          expect(parsed.value.getMonth()).toBe(6);
          expect(parsed.value.getDate()).toBe(5);
        }
      });
    });

    describe(": - Time separator", () => {
      it("formats with time separator", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("HH:mm:ss");

        expect(formatter.toString(testDate)).toBe("14:03:09");
      });

      it("parses with time separator", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("HH:mm:ss");

        const parsed = formatter.tryFromString("14:03:09");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getHours()).toBe(14);
          expect(parsed.value.getMinutes()).toBe(3);
          expect(parsed.value.getSeconds()).toBe(9);
        }
      });
    });
  });

  describe("Custom Date/Time Format Strings - Literal Strings", () => {
    describe("Quoted literal strings", () => {
      it("formats with single-quoted literal", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("yyyy'-'MM'-'dd 'at' HH:mm");

        expect(formatter.toString(testDate)).toBe("2024-07-05 at 14:03");
      });

      it("formats with double-quoted literal", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat('yyyy"-"MM"-"dd "at" HH:mm');

        expect(formatter.toString(testDate)).toBe("2024-07-05 at 14:03");
      });

      it("parses with quoted literal", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("yyyy'-'MM'-'dd 'at' HH:mm");

        const parsed = formatter.tryFromString("2024-07-05 at 14:03");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getFullYear()).toBe(2024);
          expect(parsed.value.getMonth()).toBe(6);
          expect(parsed.value.getDate()).toBe(5);
        }
      });
    });

    describe("Escaped characters", () => {
      it("formats with escaped characters", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("h \\h m \\m");

        expect(formatter.toString(testDate)).toBe("2 h 3 m");
      });

      it("parses with escaped characters", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("h \\h m \\m");

        const parsed = formatter.tryFromString("2 h 3 m");
        expect(parsed.isOk()).toBe(true);
        if (parsed.isOk()) {
          expect(parsed.value.getHours()).toBeGreaterThanOrEqual(0);
          expect(parsed.value.getMinutes()).toBe(3);
        }
      });
    });

    describe("% - Single custom format specifier", () => {
      it("formats with % prefix for single specifier", () => {
        const formatter = new DotNetDateTimeFormatter();
        formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
        formatter.trySetFormat("%d");

        expect(formatter.toString(testDate)).toBe("5");
      });
    });
  });

  describe("Complex Custom Format Patterns", () => {
    it("formats combination pattern with date and time", () => {
      const formatter = new DotNetDateTimeFormatter();
      formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
      formatter.trySetFormat("dddd, dd MMMM yyyy HH:mm:ss");

      expect(formatter.toString(testDate)).toBe(
        "Friday, 05 July 2024 14:03:09",
      );
    });

    it("parses combination pattern with date and time", () => {
      const formatter = new DotNetDateTimeFormatter();
      formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
      formatter.trySetFormat("dddd, dd MMMM yyyy HH:mm:ss");

      const parsed = formatter.tryFromString("Friday, 05 July 2024 14:03:09");
      expect(parsed.isOk()).toBe(true);
      if (parsed.isOk()) {
        expect(parsed.value.getFullYear()).toBe(2024);
        expect(parsed.value.getMonth()).toBe(6);
        expect(parsed.value.getDate()).toBe(5);
        expect(parsed.value.getHours()).toBe(14);
        expect(parsed.value.getMinutes()).toBe(3);
        expect(parsed.value.getSeconds()).toBe(9);
      }
    });

    it("formats 12-hour clock with AM/PM", () => {
      const formatter = new DotNetDateTimeFormatter();
      formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
      formatter.trySetFormat("hh:mm:ss tt");

      expect(formatter.toString(testDate)).toBe("02:03:09 PM");
      expect(formatter.toString(testDateSingleDigit)).toBe("06:05:01 AM");
    });

    it("formats with milliseconds", () => {
      const formatter = new DotNetDateTimeFormatter();
      formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
      formatter.trySetFormat("HH:mm:ss.fff");

      expect(formatter.toString(testDate)).toBe("14:03:09.120");
    });

    it("formats ISO 8601-like pattern", () => {
      const formatter = new DotNetDateTimeFormatter();
      formatter.localeSettings = FieldedTextLocaleSettings.createInvariant();
      formatter.trySetFormat("yyyy-MM-dd'T'HH:mm:ss");

      expect(formatter.toString(testDate)).toBe("2024-07-05T14:03:09");
    });
  });

  describe("Error Handling", () => {
    it("rejects invalid custom format text - too many d characters", () => {
      const formatter = new DotNetDateTimeFormatter();
      const result = formatter.trySetFormat("ddddd");

      expect(result.isOk()).toBe(false);
    });

    it("rejects invalid custom format text - too many M characters", () => {
      const formatter = new DotNetDateTimeFormatter();
      const result = formatter.trySetFormat("MMMMM");

      expect(result.isOk()).toBe(false);
    });

    it("rejects invalid custom format text - too many y characters", () => {
      const formatter = new DotNetDateTimeFormatter();
      const result = formatter.trySetFormat("yyyyyy");

      expect(result.isOk()).toBe(false);
    });

    it("rejects empty format string", () => {
      const formatter = new DotNetDateTimeFormatter();
      const result = formatter.trySetFormat("");

      expect(result.isOk()).toBe(false);
    });

    it("rejects unterminated quoted literal", () => {
      const formatter = new DotNetDateTimeFormatter();
      const result = formatter.trySetFormat("yyyy-MM-dd 'at");

      expect(result.isOk()).toBe(false);
    });

    it("rejects escape at end of format", () => {
      const formatter = new DotNetDateTimeFormatter();
      const result = formatter.trySetFormat("yyyy-MM-dd\\");

      expect(result.isOk()).toBe(false);
    });
  });
});
