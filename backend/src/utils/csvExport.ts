import Transaction from "../models/Transaction";

// Turns an array of transactions into a valid CSV string,
// including only the columns the user selected.
export const buildTransactionCsv = (
  transactions: Transaction[],
  columns: string[]
): string => {
  // Fallback to all columns if none were provided
  const validColumns =
    columns && columns.length > 0
      ? columns
      : ["id", "date", "amount", "category", "status", "user_id", "user_profile"];

  // Escape a single CSV cell - wraps in quotes if it contains a comma, quote, or newline
  const escapeCell = (value: unknown): string => {
    const stringValue = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const header = validColumns.join(",");

  // Handle the empty-data case cleanly - still return a valid CSV with just headers
  if (!transactions || transactions.length === 0) {
    return header + "\n";
  }

  const rows = transactions.map((tx) => {
        const plain = tx.get({ plain: true }) as unknown as Record<string, unknown>;
    return validColumns
      .map((col) => {
        if (col === "date") {
          return escapeCell(new Date(plain.date as string).toISOString());
        }
        return escapeCell(plain[col]);
      })
      .join(",");
  });

  return [header, ...rows].join("\n") + "\n";
};
