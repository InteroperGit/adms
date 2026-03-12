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

/** Map camelCase color keys to kebab-case CSS variable names. */
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

function buildColorVars(colors: Record<string, string>, indent = '  '): string {
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssName = COLOR_KEY_MAP[key] ?? key;
      return `${indent}--${cssName}: ${value};`;
    })
    .join('\n');
}

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

function buildFontLinks(urls: string[]): string {
  const preconnect = [
    '<link rel="preconnect" href="https://fonts.googleapis.com" />',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
  ].join('\n    ');

  const stylesheets = urls.map((url) => `<link rel="stylesheet" href="${url}" />`).join('\n    ');

  return `${preconnect}\n    ${stylesheets}`;
}

const ANTI_FOUC_SCRIPT = `<script>(function(){try{var m=localStorage.getItem('theme-mode');if(m==='dark'||(m===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();</script>`;

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
      const fonts = buildFontLinks(theme.fontUrls);
      const themeColor = theme.colors.primary ? `hsl(${theme.colors.primary})` : '';

      let out = html;
      out = out.replace(/(<html[^>]*\blang=")[^"]*(")/i, `$1${lang}$2`);
      out = out.replace(/(<meta\s+name="theme-color"\s+content=")[^"]*(")/i, `$1${themeColor}$2`);
      out = out.replace('</head>', `${ANTI_FOUC_SCRIPT}\n    ${fonts}\n    ${style}\n  </head>`);
      return out;
    },
  };
}
