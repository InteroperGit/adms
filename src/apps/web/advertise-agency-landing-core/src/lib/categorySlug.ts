import { categories } from '@/types/config/categories';

/**
 * @description Looks up a portfolio category by name and returns its URL slug.
 * Falls back to 'all' if the category is not found, ensuring a valid slug is always returned.
 * Useful for converting category display names (from JSON data) to URL-safe identifiers.
 *
 * @param {string} name - Category display name to look up (e.g., "Branding", "Outdoor")
 * @returns {string} Category slug (e.g., "branding", "outdoor") or 'all' if not found
 *
 * @example
 * const slug = categorySlug('Branding');
 * // Returns: "branding"
 *
 * @example
 * const slug = categorySlug('Unknown Category');
 * // Returns: "all" (fallback)
 */
export function categorySlug(name: string): string {
  return categories.find((c) => c.name === name)?.slug ?? 'all';
}
