import data from '@data/config/theme.json';
import { z } from 'zod';

const ThemeColorsSchema = z.object({
  background: z.string(),
  foreground: z.string(),
  card: z.string(),
  cardForeground: z.string(),
  popover: z.string(),
  popoverForeground: z.string(),
  primary: z.string(),
  primaryForeground: z.string(),
  secondary: z.string(),
  secondaryForeground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  accent: z.string(),
  accentForeground: z.string(),
  destructive: z.string(),
  destructiveForeground: z.string(),
  border: z.string(),
  input: z.string(),
  ring: z.string(),
});

export type ThemeColors = z.infer<typeof ThemeColorsSchema>;

export const ThemeSchema = z.object({
  colors: ThemeColorsSchema,
  radius: z.string(),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  fontUrls: z.array(z.string()),
});

export type Theme = z.infer<typeof ThemeSchema>;

export const theme = ThemeSchema.parse(data);
