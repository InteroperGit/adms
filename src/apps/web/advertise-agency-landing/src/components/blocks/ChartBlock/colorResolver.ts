import type { BlockColor } from '@/types/blocks';

/**
 * Resolves a BlockColor configuration to a CSS color string suitable for Recharts and SVG elements.
 * Handles all color types: primary, accent, solid hex values, and gradients. Dark mode colors
 * are accessed via CSS variables (--primary, --accent) which are already scoped to dark/light modes.
 * Gradients are converted to their fallback primary color since SVG stroke does not support complex gradients.
 *
 * @description Maps BlockColor types to CSS color strings with dark mode support
 * @param {BlockColor | undefined} color - The block color configuration object (or undefined for primary)
 * @returns {string} CSS color string: HSL variable (e.g., 'hsl(var(--primary))'), hex value, or fallback primary
 *
 * @example
 * resolveChartColor({ type: 'primary' }) // 'hsl(var(--primary))'
 * resolveChartColor({ type: 'accent' }) // 'hsl(var(--accent))'
 * resolveChartColor({ type: 'solid', value: '#FF5733' }) // '#FF5733'
 * resolveChartColor(undefined) // 'hsl(var(--primary))'
 */
export function resolveChartColor(color: BlockColor | undefined): string {
  if (!color) {
    return 'hsl(var(--primary))';
  }

  switch (color.type) {
    case 'accent':
      return 'hsl(var(--accent))';
    case 'primary':
      return 'hsl(var(--primary))';
    case 'solid':
      // Assume solid colors are hex values (e.g., '#FF0000')
      return color.value || 'hsl(var(--primary))';
    case 'gradient':
      // Gradients in SVG are complex; fall back to primary color
      // In a full implementation, could extract first color from Tailwind gradient
      return 'hsl(var(--primary))';
    default:
      return 'hsl(var(--primary))';
  }
}

/**
 * Legacy wrapper function that delegates to resolveChartColor.
 * Kept for backward compatibility with existing SVG-based chart components.
 * Performs the same color resolution as the main function.
 *
 * @description Backward-compatible color resolution wrapper
 * @param {BlockColor | undefined} color - The block color configuration object
 * @returns {string} CSS color string resolved from BlockColor
 *
 * @deprecated Use resolveChartColor() directly instead
 */
export function svgColor(color: BlockColor | undefined): string {
  return resolveChartColor(color);
}
