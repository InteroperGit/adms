import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description Merges conditional CSS class names while intelligently resolving Tailwind
 * CSS conflicts. Combines clsx for conditional logic with tailwind-merge to prevent
 * duplicate and conflicting utility classes (e.g., different bg-colors or text-sizes).
 * Safe to use with dynamic class generation and conditional rendering.
 *
 * @param {...ClassValue[]} inputs - Class name values: strings, objects, arrays, or undefined
 * @returns {string} Merged and conflict-resolved class string
 *
 * @example
 * cn('px-2 py-1', 'p-4') // Returns: 'p-4' (p-4 overrides px-2 py-1)
 *
 * @example
 * cn('text-sm', { 'text-lg': isLarge }) // Returns: 'text-lg' or 'text-sm'
 *
 * @example
 * cn('bg-blue-500', isActive && 'bg-blue-600', ['ring-2', 'ring-offset-2'])
 * // Returns: 'bg-blue-600 ring-2 ring-offset-2' (merged without conflicts)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Dark mode color inversion filter for iframes
 * Inverts colors, rotates hue, and adjusts saturation/brightness for readability in dark theme
 */
export const DARK_IFRAME_FILTER =
  'invert(1) hue-rotate(180deg) saturate(1.6) brightness(1.1) contrast(1.05)';

/**
 * Formats a phone number as a tel: URL by stripping all non-digit characters
 * @param phone - Phone number string (may contain formatting characters)
 * @returns tel: URL suitable for href attribute
 * @example phoneHref('+7 (999) 123-45-67') // Returns: 'tel:79991234567'
 */
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\D/g, '')}`;
}

/**
 * Replaces `{key}` tokens in a template string with provided values.
 * Unmatched tokens are preserved as-is.
 * @param template - String containing `{key}` placeholders
 * @param values - Map of key → replacement value
 * @returns Interpolated string
 * @example interpolate('Page {current} of {total}', { current: 2, total: 5 }) // 'Page 2 of 5'
 */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const val = values[key];
    return val !== undefined ? String(val) : match;
  });
}
