import data from '@data/config/theme.json';
import { z } from 'zod';

/**
 * @module config/theme
 * @description Theme configuration: semantic colors (light and dark), typography, border radius, fonts.
 */

/**
 * @description Semantic color palette for light and optional dark mode
 */
const ThemeColorsSchema = z.object({
  /** Default page background color */
  background: z.string(),
  /** Default text/foreground color */
  foreground: z.string(),
  /** Optional dark surface for special sections */
  surfaceDark: z.string().optional(),
  /** Elevated card/panel background */
  card: z.string(),
  /** Card text color */
  cardForeground: z.string(),
  /** Popover/tooltip background */
  popover: z.string(),
  /** Popover text color */
  popoverForeground: z.string(),
  /** Primary brand color (CTA buttons, highlights) */
  primary: z.string(),
  /** Text on primary background */
  primaryForeground: z.string(),
  /** Secondary accent color */
  secondary: z.string(),
  /** Text on secondary background */
  secondaryForeground: z.string(),
  /** Neutral/disabled element color */
  muted: z.string(),
  /** Text on muted background */
  mutedForeground: z.string(),
  /** Accent color for emphasis */
  accent: z.string(),
  /** Text on accent background */
  accentForeground: z.string(),
  /** Error/danger color */
  destructive: z.string(),
  /** Text on destructive background */
  destructiveForeground: z.string(),
  /** Border and divider color */
  border: z.string(),
  /** Input field background */
  input: z.string(),
  /** Focus ring color */
  ring: z.string(),
});

/**
 * @description Semantic colors used in light mode or dark mode theme
 */
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;

/**
 * @description Complete theme configuration including colors, typography, and border radius
 */
export const ThemeSchema = z.object({
  /** Light mode color palette */
  colors: ThemeColorsSchema,
  /** Optional dark mode color overrides; if omitted, light colors are used in dark mode */
  darkColors: ThemeColorsSchema.optional(),
  /** Border radius values for components (e.g., "0.5rem") */
  radius: z.string(),
  /** Font family assignments */
  fonts: z.object({
    /** Font family for headings */
    heading: z.string(),
    /** Font family for body text */
    body: z.string(),
  }),
  /** Array of font URLs or imports to inject into the page */
  fontUrls: z.array(z.string()),
});

/**
 * @description Parsed and validated theme configuration
 */
export type Theme = z.infer<typeof ThemeSchema>;

/**
 * @description Exported theme constant parsed from data/config/theme.json
 */
export const theme = ThemeSchema.parse(data);
