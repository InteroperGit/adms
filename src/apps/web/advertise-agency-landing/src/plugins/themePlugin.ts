import { existsSync, readFileSync } from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

interface Theme {
  colors: Record<string, string>;
  darkColors?: Record<string, string>;
  radius: string;
  fonts: { heading: string; body: string };
  fontUrls: string[];
}

/**
 * @description Maps theme.json color keys (camelCase) to CSS variable names (kebab-case).
 * Used when generating :root { --color-name: value; } from theme color objects.
 */
const COLOR_KEY_MAP: Record<string, string> = {
  background: 'background',
  foreground: 'foreground',
  surfaceDark: 'surface-dark',
  card: 'card',
  cardForeground: 'card-foreground',
  popover: 'popover',
  popoverForeground: 'popover-foreground',
  primary: 'primary',
  primaryForeground: 'primary-foreground',
  secondary: 'secondary',
  secondaryForeground: 'secondary-foreground',
  muted: 'muted',
  mutedForeground: 'muted-foreground',
  accent: 'accent',
  accentForeground: 'accent-foreground',
  destructive: 'destructive',
  destructiveForeground: 'destructive-foreground',
  border: 'border',
  input: 'input',
  ring: 'ring',
};

// Virtual module ID for the CSS vars — imported from main.tsx so that
// @tailwindcss/vite picks them up in its CSS pipeline in dev mode too.
const VIRTUAL_ID = 'virtual:theme-vars.css';
const RESOLVED_ID = '\0virtual:theme-vars.css';
const DEFAULT_LANGUAGE = 'en-US';

/**
 * @description Generates CSS variable declarations from a colors object.
 *
 * @param {Record<string, string>} colors - Color map with camelCase keys
 * @param {string} [indent='  '] - Indentation for formatting
 * @returns {string} CSS variable declarations (e.g., "--primary: hsl(5 85% 49%);")
 */
function buildColorVars(colors: Record<string, string>, indent = '  '): string {
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssName = COLOR_KEY_MAP[key] ?? key;
      return `${indent}--${cssName}: ${value};`;
    })
    .join('\n');
}

/**
 * @description Generates complete CSS with :root variables and optional .dark selector override.
 *
 * @param {Theme} theme - Theme object with colors, darkColors, radius, fonts
 * @returns {string} CSS string with :root and optional .dark blocks
 */
function buildCss(theme: Theme): string {
  const rootVars = [
    buildColorVars(theme.colors),
    `  --radius: ${theme.radius};`,
    `  --font-heading: ${theme.fonts.heading};`,
    `  --font-body: ${theme.fonts.body};`,
  ].join('\n');

  const blocks = [`:root {\n${rootVars}\n}`];

  if (theme.darkColors) {
    blocks.push(`.dark {\n${buildColorVars(theme.darkColors)}\n}`);
  }

  return blocks.join('\n\n');
}

/**
 * @description Vite plugin that injects CSS custom properties and font links for theme customization.
 * Reads theme.json to generate :root CSS variables, optional dark-mode overrides, and injects
 * an anti-FOUC script to prevent flash of unstyled content when dark mode is active. Serves
 * CSS variables as a virtual module so @tailwindcss/vite includes them in dev mode.
 *
 * @returns {Plugin} Vite plugin with configResolved, resolveId, load, and transformIndexHtml hooks
 *
 * @example
 * // vite.config.ts
 * import { themePlugin } from './src/plugins/themePlugin';
 *
 * export default defineConfig({
 *   plugins: [themePlugin()],
 * });
 */
export function themePlugin(): Plugin {
  const themeFile = path.resolve(__dirname, '../../data/content/config/theme.json');
  const seoFile = path.resolve(__dirname, '../../data/content/config/seo.json');

  let theme: Theme;
  let lang = DEFAULT_LANGUAGE;

  return {
    name: 'vite-plugin-theme',
    enforce: 'pre',

    configResolved() {
      const raw = readFileSync(themeFile, 'utf-8');
      theme = JSON.parse(raw) as Theme;

      if (existsSync(seoFile)) {
        const seo = JSON.parse(readFileSync(seoFile, 'utf-8')) as { locale?: string };
        lang = (seo.locale ?? DEFAULT_LANGUAGE).split('_')[0];
      }
    },

    // Serve CSS vars as a virtual CSS module so @tailwindcss/vite includes
    // them in its pipeline in dev mode (not just via the HTML <style> tag).
    resolveId(id: string) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID;
      }
    },

    load(id: string) {
      if (id === RESOLVED_ID) {
        return buildCss(theme);
      }
    },

    transformIndexHtml(html) {
      const css = buildCss(theme);
      const style = `<style id="theme-vars">${css}</style>`;

      let out = html;
      out = out.replace(/(<html[^>]*\blang=")[^"]*(")/i, `$1${lang}$2`);
      out = out.replace('</head>', `    ${style}\n  </head>`);
      return out;
    },
  };
}
