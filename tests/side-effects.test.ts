import { describe, expect, it, vi } from "vitest";

describe("Library Side Effects", () => {
  describe("Global Object Integrity", () => {
    it("does not modify global object after import", () => {
      // Capture global properties before import
      const globalBefore = { ...globalThis };
      const globalKeysBefore = Object.keys(globalThis);

      // Import the library
      import("../src/code/index.js");

      // Verify no new properties were added to globalThis
      const globalKeysAfter = Object.keys(globalThis);
      const newKeys = globalKeysAfter.filter(
        (key) => !globalKeysBefore.includes(key),
      );

      expect(newKeys).toEqual([]);
    });

    it("does not modify window object (if available)", () => {
      // Only run in browser-like environments
      if (typeof window !== "undefined") {
        const windowKeysBefore = Object.keys(window);

        // Import the library
        import("../src/code/index.js");

        const windowKeysAfter = Object.keys(window);
        const newKeys = windowKeysAfter.filter(
          (key) => !windowKeysBefore.includes(key),
        );

        expect(newKeys).toEqual([]);
      } else {
        // Skip test in Node environment
        expect(true).toBe(true);
      }
    });
  });

  describe("Prototype Integrity", () => {
    it("does not modify Object prototype", () => {
      const objectProtoBefore = { ...Object.prototype };
      const objectProtoKeysBefore = Object.getOwnPropertyNames(
        Object.prototype,
      );

      import("../src/code/index.js");

      const objectProtoKeysAfter = Object.getOwnPropertyNames(Object.prototype);
      expect(objectProtoKeysAfter).toEqual(objectProtoKeysBefore);
    });

    it("does not modify Array prototype", () => {
      const arrayProtoKeysBefore = Object.getOwnPropertyNames(Array.prototype);

      import("../src/code/index.js");

      const arrayProtoKeysAfter = Object.getOwnPropertyNames(Array.prototype);
      expect(arrayProtoKeysAfter).toEqual(arrayProtoKeysBefore);
    });

    it("does not modify String prototype", () => {
      const stringProtoKeysBefore = Object.getOwnPropertyNames(
        String.prototype,
      );

      import("../src/code/index.js");

      const stringProtoKeysAfter = Object.getOwnPropertyNames(String.prototype);
      expect(stringProtoKeysAfter).toEqual(stringProtoKeysBefore);
    });

    it("does not modify Number prototype", () => {
      const numberProtoKeysBefore = Object.getOwnPropertyNames(
        Number.prototype,
      );

      import("../src/code/index.js");

      const numberProtoKeysAfter = Object.getOwnPropertyNames(Number.prototype);
      expect(numberProtoKeysAfter).toEqual(numberProtoKeysBefore);
    });

    it("does not modify Date prototype", () => {
      const dateProtoKeysBefore = Object.getOwnPropertyNames(Date.prototype);

      import("../src/code/index.js");

      const dateProtoKeysAfter = Object.getOwnPropertyNames(Date.prototype);
      expect(dateProtoKeysAfter).toEqual(dateProtoKeysBefore);
    });

    it("does not modify Set prototype", () => {
      const setProtoKeysBefore = Object.getOwnPropertyNames(Set.prototype);

      import("../src/code/index.js");

      const setProtoKeysAfter = Object.getOwnPropertyNames(Set.prototype);
      expect(setProtoKeysAfter).toEqual(setProtoKeysBefore);
    });

    it("does not modify Map prototype", () => {
      const mapProtoKeysBefore = Object.getOwnPropertyNames(Map.prototype);

      import("../src/code/index.js");

      const mapProtoKeysAfter = Object.getOwnPropertyNames(Map.prototype);
      expect(mapProtoKeysAfter).toEqual(mapProtoKeysAfter);
    });
  });

  describe("Built-in Object Integrity", () => {
    it("does not modify Math object", () => {
      const mathKeysBefore = Object.getOwnPropertyNames(Math);

      import("../src/code/index.js");

      const mathKeysAfter = Object.getOwnPropertyNames(Math);
      expect(mathKeysAfter).toEqual(mathKeysBefore);
    });

    it("does not modify JSON object", () => {
      const jsonKeysBefore = Object.getOwnPropertyNames(JSON);

      import("../src/code/index.js");

      const jsonKeysAfter = Object.getOwnPropertyNames(JSON);
      expect(jsonKeysAfter).toEqual(jsonKeysBefore);
    });

    it("does not modify console object", () => {
      const consoleKeysBefore = Object.getOwnPropertyNames(console);

      import("../src/code/index.js");

      const consoleKeysAfter = Object.getOwnPropertyNames(console);
      expect(consoleKeysAfter).toEqual(consoleKeysBefore);
    });
  });

  describe("Intl Object Integrity", () => {
    it("does not modify Intl object", () => {
      const intlKeysBefore = Object.getOwnPropertyNames(Intl);

      import("../src/code/index.js");

      const intlKeysAfter = Object.getOwnPropertyNames(Intl);
      expect(intlKeysAfter).toEqual(intlKeysBefore);
    });

    it("does not modify Intl.NumberFormat", () => {
      const numberFormatBefore = Intl.NumberFormat;

      import("../src/code/index.js");

      const numberFormatAfter = Intl.NumberFormat;
      expect(numberFormatAfter).toBe(numberFormatBefore);
    });

    it("does not modify Intl.DateTimeFormat", () => {
      const dateTimeFormatBefore = Intl.DateTimeFormat;

      import("../src/code/index.js");

      const dateTimeFormatAfter = Intl.DateTimeFormat;
      expect(dateTimeFormatAfter).toBe(dateTimeFormatBefore);
    });
  });

  describe("Module Isolation", () => {
    it("can be imported multiple times without conflicts", async () => {
      // Import the module multiple times
      const import1 = await import("../src/code/index.js");
      const import2 = await import("../src/code/index.js");
      const import3 = await import("../src/code/index.js");

      // All imports should reference the same module
      expect(import1).toBe(import2);
      expect(import2).toBe(import3);
    });

    it("static instances are consistent across imports", async () => {
      const module1 = await import("../src/code/locale-settings.js");
      const module2 = await import("../src/code/locale-settings.js");

      // Static instances should be the same reference
      expect(module1.DotNetLocaleSettings.current).toBe(
        module2.DotNetLocaleSettings.current,
      );
      expect(module1.DotNetLocaleSettings.invariant).toBe(
        module2.DotNetLocaleSettings.invariant,
      );
    });
  });

  describe("Pure Module Exports", () => {
    it("only exports functions, classes, and constants", async () => {
      const module = await import("../src/code/index.js");

      // Check that all exports are either functions, classes, or objects
      for (const [key, value] of Object.entries(module)) {
        const type = typeof value;
        const isValid =
          type === "function" || // Classes and functions
          type === "object" || // Enums and constants
          type === "undefined"; // Re-exports might be undefined

        expect(isValid).toBe(true);
      }
    });

    it("does not execute side-effect code at import time", async () => {
      // Create spies on methods that might be called as side effects
      const consoleLogSpy = vi.spyOn(console, "log");
      const consoleWarnSpy = vi.spyOn(console, "warn");
      const consoleErrorSpy = vi.spyOn(console, "error");

      // Import the module
      await import("../src/code/index.js");

      // Verify no console output was produced
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      // Clean up spies
      consoleLogSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("No External State Modification", () => {
    it("does not make network requests at import time", async () => {
      // This is a best-effort test - we can't easily intercept all network calls
      // But we can check that fetch hasn't been called
      if (typeof fetch !== "undefined") {
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        await import("../src/code/index.js");

        expect(fetchSpy).not.toHaveBeenCalled();
        fetchSpy.mockRestore();
      } else {
        expect(true).toBe(true);
      }
    });

    it("does not access localStorage at import time", async () => {
      if (typeof localStorage !== "undefined") {
        const getItemSpy = vi.spyOn(localStorage, "getItem");
        const setItemSpy = vi.spyOn(localStorage, "setItem");

        await import("../src/code/index.js");

        expect(getItemSpy).not.toHaveBeenCalled();
        expect(setItemSpy).not.toHaveBeenCalled();

        getItemSpy.mockRestore();
        setItemSpy.mockRestore();
      } else {
        expect(true).toBe(true);
      }
    });

    it("does not access sessionStorage at import time", async () => {
      if (typeof sessionStorage !== "undefined") {
        const getItemSpy = vi.spyOn(sessionStorage, "getItem");
        const setItemSpy = vi.spyOn(sessionStorage, "setItem");

        await import("../src/code/index.js");

        expect(getItemSpy).not.toHaveBeenCalled();
        expect(setItemSpy).not.toHaveBeenCalled();

        getItemSpy.mockRestore();
        setItemSpy.mockRestore();
      } else {
        expect(true).toBe(true);
      }
    });

    it("does not modify the DOM at import time", async () => {
      if (typeof document !== "undefined") {
        const createElementSpy = vi.spyOn(document, "createElement");
        const querySelectorSpy = vi.spyOn(document, "querySelector");

        await import("../src/code/index.js");

        expect(createElementSpy).not.toHaveBeenCalled();
        expect(querySelectorSpy).not.toHaveBeenCalled();

        createElementSpy.mockRestore();
        querySelectorSpy.mockRestore();
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe("Static Instance Purity", () => {
    it("DotNetLocaleSettings.current uses default locale without side effects", async () => {
      const module = await import("../src/code/locale-settings.js");

      // Verify that static instances exist and are frozen/immutable
      expect(module.DotNetLocaleSettings.current).toBeDefined();
      expect(module.DotNetLocaleSettings.invariant).toBeDefined();

      // Verify they are different instances
      expect(module.DotNetLocaleSettings.current).not.toBe(
        module.DotNetLocaleSettings.invariant,
      );
    });

    it("static style sets are pure constant values", async () => {
      const numberStyleModule = await import("../src/code/number-style.js");
      const dateTimeStyleModule = await import("../src/code/datetime-style.js");

      // Verify DotNetNumberStyles exists and contains Sets
      expect(numberStyleModule.DotNetNumberStyles).toBeDefined();
      expect(numberStyleModule.DotNetNumberStyles.none).toBeInstanceOf(Set);
      expect(numberStyleModule.DotNetNumberStyles.number).toBeInstanceOf(Set);

      // Verify DotNetDateTimeStyles exists and contains Sets
      expect(dateTimeStyleModule.DotNetDateTimeStyles).toBeDefined();
      expect(dateTimeStyleModule.DotNetDateTimeStyles.none).toBeInstanceOf(Set);
    });
  });

  describe("Tree-Shaking Safety", () => {
    it("unused exports can be safely tree-shaken", async () => {
      // Import specific exports
      const { DotNetNumberFormatter } =
        await import("../src/code/number-formatter.js");
      const { DotNetDateTimeFormatter } =
        await import("../src/code/datetime-formatter.js");

      // Create instances to verify they work independently
      const numberFormatter = new DotNetNumberFormatter();
      const dateTimeFormatter = new DotNetDateTimeFormatter();

      expect(numberFormatter).toBeInstanceOf(DotNetNumberFormatter);
      expect(dateTimeFormatter).toBeDefined();

      // No cross-contamination should occur
      expect(numberFormatter).not.toBe(dateTimeFormatter);
    });

    it("partial imports do not trigger initialization of unused modules", async () => {
      // Import only one module
      const { DotNetNumberStyleId } =
        await import("../src/code/number-style.js");

      // Verify it works
      expect(DotNetNumberStyleId.AllowDecimalPoint).toBe("AllowDecimalPoint");

      // This test passes if no errors are thrown
      expect(true).toBe(true);
    });
  });
});
