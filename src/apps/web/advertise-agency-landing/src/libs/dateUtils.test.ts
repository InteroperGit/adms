import { describe, it, expect } from 'vitest';
import { extractYearMonth } from './dateUtils';

describe('extractYearMonth()', () => {
  it('should extract year and month from a valid date string', () => {
    expect(extractYearMonth('2024-03-14')).toEqual({ year: '2024', month: '03' });
    expect(extractYearMonth('1999-12-01')).toEqual({ year: '1999', month: '12' });
  });

  it('should handle edge months (01 and 12)', () => {
    expect(extractYearMonth('2024-01-01')).toEqual({ year: '2024', month: '01' });
    expect(extractYearMonth('2024-12-31')).toEqual({ year: '2024', month: '12' });
  });

  it('should throw for wrong separators', () => {
    expect(() => extractYearMonth('2024/03/14')).toThrow(
      'Invalid date format. Expected "YYYY-MM-DD" with dashes at positions 4 and 7'
    );
    expect(() => extractYearMonth('2024.03.14')).toThrow(
      'Invalid date format. Expected "YYYY-MM-DD" with dashes at positions 4 and 7'
    );
  });

  it('should throw for incorrect length', () => {
    expect(() => extractYearMonth('2024-3-14')).toThrow('Invalid date format');
    expect(() => extractYearMonth('2024-0314')).toThrow('Invalid date format');
    expect(() => extractYearMonth('2024-03-1')).toThrow('Invalid date format');
    expect(() => extractYearMonth('202403-14')).toThrow('Invalid date format');
  });

  it('should throw for empty string', () => {
    expect(() => extractYearMonth('')).toThrow('Date must be a non-empty string');
  });

  it('should throw for out-of-range month', () => {
    expect(() => extractYearMonth('2024-00-14')).toThrow(
      'Invalid month value in date "2024-00-14". Month must be between 01 and 12'
    );
    expect(() => extractYearMonth('2024-13-14')).toThrow(
      'Invalid month value in date "2024-13-14". Month must be between 01 and 12'
    );
  });

  it('should throw for non-string input', () => {
    // @ts-expect-error testing invalid input
    expect(() => extractYearMonth(null)).toThrow('Date must be a non-empty string');
    // @ts-expect-error testing invalid input
    expect(() => extractYearMonth(undefined)).toThrow('Date must be a non-empty string');
    // @ts-expect-error testing invalid input
    expect(() => extractYearMonth(123)).toThrow('Date must be a non-empty string');
  });
});
