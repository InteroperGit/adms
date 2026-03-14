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
