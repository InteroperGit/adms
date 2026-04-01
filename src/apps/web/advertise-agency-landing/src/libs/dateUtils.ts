/**
 * Extract year and month components from an ISO 8601 date string.
 *
 * Supports both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ssZ" formats.
 * Extracts the year (first 4 characters) and month (characters 5-6) components.
 *
 * @param date - ISO date string in format "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ssZ"
 * @returns An object containing the extracted year and month as strings
 * @throws {Error} If the date string is not in a valid format
 *
 * @example
 * const { year, month } = extractYearMonth("2024-03-14");
 * console.log(year, month); // "2024" "03"
 *
 * @example
 * const { year, month } = extractYearMonth("2024-03-14T00:00:00Z");
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

  // Support both "YYYY-MM-DD" (10 chars) and "YYYY-MM-DDTHH:mm:ssZ" (20 chars) formats
  if (date.length < 10) {
    throw new Error(
      `Invalid date format. Expected "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ssZ", got "${date}" (length ${date.length})`
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
