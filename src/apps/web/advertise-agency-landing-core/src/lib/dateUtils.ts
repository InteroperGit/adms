/**
 * Extract year and month components from an ISO 8601 date string.
 *
 * Parses a date string in the format "YYYY-MM-DD" and extracts the year
 * (first 4 characters) and month (characters 5-6) components.
 *
 * @param date - ISO date string in format "YYYY-MM-DD" (e.g., "2024-03-14")
 * @returns An object containing the extracted year and month as strings
 * @throws {Error} If the date string is not in the correct "YYYY-MM-DD" format
 *
 * @example
 * const { year, month } = extractYearMonth("2024-03-14");
 * console.log(year, month); // "2024" "03"
 *
 * @example
 * // Throws error for invalid format
 * extractYearMonth("2024/03/14"); // Error: Invalid date format...
 */
export function extractYearMonth(date: string): { year: string; month: string } {
  if (!date || typeof date !== 'string') {
    throw new Error('Date must be a non-empty string');
  }

  if (date.length !== 10) {
    throw new Error(
      `Invalid date format. Expected "YYYY-MM-DD", got "${date}" (length ${date.length})`
    );
  }

  if (date[4] !== '-' || date[7] !== '-') {
    throw new Error(
      `Invalid date format. Expected "YYYY-MM-DD" with dashes at positions 4 and 7, got "${date}"`
    );
  }

  const year = date.slice(0, 4);
  const month = date.slice(5, 7);

  if (!/^\d{4}$/.test(year)) {
    throw new Error(`Invalid year component in date "${date}". Expected 4 digits, got "${year}"`);
  }

  if (!/^\d{2}$/.test(month)) {
    throw new Error(`Invalid month component in date "${date}". Expected 2 digits, got "${month}"`);
  }

  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) {
    throw new Error(
      `Invalid month value in date "${date}". Month must be between 01 and 12, got "${month}"`
    );
  }

  return { year, month };
}
