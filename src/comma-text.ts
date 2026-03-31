export class CommaText {
  static from(values: string[]): string {
    return values
      .map((value) => {
        if (value.includes(",") || value.includes('"') || value.includes(" ")) {
          return `"${value.replaceAll('"', '""')}"`;
        }
        return value;
      })
      .join(",");
  }

  static to(
    value: string,
  ): { success: true; values: string[] } | { success: false; error: string } {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return { success: true, values: [] };
    }

    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let index = 0; index < trimmed.length; index += 1) {
      const char = trimmed[index];
      if (inQuotes) {
        if (char === '"') {
          if (index + 1 < trimmed.length && trimmed[index + 1] === '"') {
            current += '"';
            index += 1;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else if (char === ",") {
        result.push(current.trim());
        current = "";
      } else if (char === '"') {
        inQuotes = true;
      } else {
        current += char;
      }
    }

    if (inQuotes) {
      return { success: false, error: "Unterminated quoted value" };
    }

    result.push(current.trim());
    return { success: true, values: result };
  }
}
