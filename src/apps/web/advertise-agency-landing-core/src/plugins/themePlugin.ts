import { readFileSync } from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

interface Theme {
  colors: Record<string, string>;
  radius: string;
  fonts: { heading: string; body: string };
  fontUrls: string[];
}

/** Map camelCase color keys to kebab-case CSS variable names. */
const COLOR_KEY_MAP: Record<string, string> = {
  background: 'background',
  foreground: 'foreground',
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

function buildCss(theme: Theme): string {
  const colorVars = Object.entries(theme.colors)
    .map(([key, value]) => {
      const cssName = COLOR_KEY_MAP[key] ?? key;
      return `    --${cssName}: ${value};`;
    })
    .join('\n');

  return [
    ':root {',
    colorVars,
    `    --radius: ${theme.radius};`,
    `    --font-heading: ${theme.fonts.heading};`,
    `    --font-body: ${theme.fonts.body};`,
    '  }',
  ].join('\n');
}

function buildFontLinks(urls: string[]): string {
  const preconnect = [
    '<link rel="preconnect" href="https://fonts.googleapis.com" />',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
  ].join('\n    ');

  const stylesheets = urls.map((url) => `<link rel="stylesheet" href="${url}" />`).join('\n    ');

  return `${preconnect}\n    ${stylesheets}`;
}

export function themePlugin(): Plugin {
  const themeFile = path.resolve(__dirname, '../../data/theme.json');

  let theme: Theme;

  return {
    name: 'vite-plugin-theme',
    enforce: 'pre',

    configResolved() {
      const raw = readFileSync(themeFile, 'utf-8');
      theme = JSON.parse(raw) as Theme;
    },

    transformIndexHtml(html) {
      const css = buildCss(theme);
      const style = `<style id="theme-vars">${css}</style>`;
      const fonts = buildFontLinks(theme.fontUrls);

      // Inject before </head>
      return html.replace('</head>', `${fonts}\n    ${style}\n  </head>`);
    },
  };
}
