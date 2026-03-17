/**
 * @module libs/resolveColor
 * @description Resolves semantic color tokens and hex values to CSS values for use in inline styles
 */

/** Map of semantic color tokens to CSS values (mirrors @theme inline in index.css) */
const SEMANTIC_COLORS: Record<string, string> = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  'surface-dark': 'hsl(var(--surface-dark, var(--foreground)))',
  card: 'hsl(var(--card))',
  'card-foreground': 'hsl(var(--card-foreground))',
  popover: 'hsl(var(--popover))',
  'popover-foreground': 'hsl(var(--popover-foreground))',
  primary: 'hsl(var(--primary))',
  'primary-foreground': 'hsl(var(--primary-foreground))',
  secondary: 'hsl(var(--secondary))',
  'secondary-foreground': 'hsl(var(--secondary-foreground))',
  muted: 'hsl(var(--muted))',
  'muted-foreground': 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--accent))',
  'accent-foreground': 'hsl(var(--accent-foreground))',
  destructive: 'hsl(var(--destructive))',
  'destructive-foreground': 'hsl(var(--destructive-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
};

/** Row colors shape used by list blocks (even/odd striping) */
type ListItemColors = {
  even?: { background?: string; text?: string };
  odd?: { background?: string; text?: string };
};

/**
 * Resolves striped row styles for list block items.
 * Extracts even/odd row colors and returns bgStyle, textStyle, and textClass.
 *
 * @param colors - The block.colors field (even/odd row overrides)
 * @param index  - The zero-based item index
 */
export function resolveListItemStyles(colors: ListItemColors | undefined, index: number) {
  const rowColors = colors ? (index % 2 === 0 ? colors.even : colors.odd) : undefined;
  return {
    bgStyle: rowColors?.background
      ? { backgroundColor: resolveColor(rowColors.background) }
      : undefined,
    textStyle: rowColors?.text ? { color: resolveColor(rowColors.text) } : undefined,
    textClass: rowColors?.text ? 'leading-relaxed' : 'text-muted-foreground leading-relaxed',
  };
}

/**
 * Resolves a color string to a CSS value suitable for use in inline styles.
 *
 * Supports three formats:
 * - **Hex colors** (`#abc`, `#aabbcc`, `#aabbccdd`) → passed through unchanged
 * - **Semantic tokens** (`primary`, `accent`, `muted-foreground`) → `hsl(var(--<token>))`
 * - **Semantic with opacity** (`primary/50`, `accent/80`) → `hsl(var(--<token>) / 0.5)`
 * - **CSS values** (starts with `hsl(`, `rgb(`, `var(`) → passed through unchanged
 *
 * @param {string} value - Color string to resolve
 * @returns {string} CSS color value
 *
 * @example
 * resolveColor('#f65314')                // → '#f65314'
 * resolveColor('primary')                 // → 'hsl(var(--primary))'
 * resolveColor('primary/50')              // → 'hsl(var(--primary) / 0.5)'
 * resolveColor('hsl(var(--accent))')     // → 'hsl(var(--accent))'
 */
export function resolveColor(value: string): string {
  if (!value) {
    return value;
  }

  // Already a CSS value — pass through
  if (value.startsWith('hsl(') || value.startsWith('rgb(') || value.startsWith('var(')) {
    return value;
  }

  // Hex color — pass through
  if (value.startsWith('#')) {
    return value;
  }

  // Parse semantic token with optional opacity (e.g., "primary/50")
  const [token, opacityStr] = value.split('/');

  // Look up the semantic token
  const baseColor = SEMANTIC_COLORS[token];
  if (!baseColor) {
    // Unknown token — return as-is (might be a color name or custom value)
    return value;
  }

  // If no opacity, return the base color
  if (!opacityStr) {
    return baseColor;
  }

  // Parse opacity value and convert to decimal (e.g., "50" → 0.5, "80" → 0.8)
  const opacity = parseInt(opacityStr, 10) / 100;

  // Insert opacity before the closing paren, preserving any fallbacks
  // hsl(var(--primary)) → hsl(var(--primary) / 0.5)
  // hsl(var(--surface-dark, var(--foreground))) → hsl(var(--surface-dark, var(--foreground)) / 0.5)
  return baseColor.replace(/\)$/, ` / ${opacity})`);
}
