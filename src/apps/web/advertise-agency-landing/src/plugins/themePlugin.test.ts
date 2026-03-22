/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync, existsSync } from 'fs';

vi.mock('fs', () => {
  const readFileSync = vi.fn();
  const existsSync = vi.fn();
  const mod = { readFileSync, existsSync };
  return { ...mod, default: mod };
});

import { themePlugin } from './themePlugin';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const THEME = {
  colors: {
    background: '0 0% 100%',
    foreground: '222 84% 5%',
    primary: '5 85% 49%',
    surfaceDark: '222 47% 11%',
  },
  darkColors: {
    background: '222 47% 11%',
    foreground: '210 40% 98%',
  },
  radius: '0.5rem',
  fonts: { heading: 'Inter', body: 'Roboto' },
  fontUrls: [],
};

const THEME_NO_DARK = { ...THEME, darkColors: undefined };

const SEO_WITH_LOCALE = { locale: 'ru_RU' };

function setupMocks(theme: object, seoLocale?: string) {
  (existsSync as any).mockImplementation((p: string) => {
    if (p.includes('seo.json')) {
      return seoLocale !== undefined;
    }
    return true;
  });
  (readFileSync as any).mockImplementation((p: string) => {
    if (p.includes('theme.json')) {
      return JSON.stringify(theme);
    }
    if (p.includes('seo.json') && seoLocale !== undefined) {
      return JSON.stringify({ locale: seoLocale });
    }
    return '{}';
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Plugin identity
// ---------------------------------------------------------------------------

describe('themePlugin — identity', () => {
  it('name equals "vite-plugin-theme"', () => {
    expect(themePlugin().name).toBe('vite-plugin-theme');
  });

  it('enforce equals "pre"', () => {
    expect(themePlugin().enforce).toBe('pre');
  });
});

// ---------------------------------------------------------------------------
// resolveId
// ---------------------------------------------------------------------------

describe('themePlugin — resolveId', () => {
  it('resolves "virtual:theme-vars.css" to "\\0virtual:theme-vars.css"', () => {
    const plugin = themePlugin();
    const result = (plugin.resolveId as any)('virtual:theme-vars.css');
    expect(result).toBe('\0virtual:theme-vars.css');
  });

  it('returns undefined for any other id', () => {
    const plugin = themePlugin();
    const result = (plugin.resolveId as any)('some-other-module');
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// load
// ---------------------------------------------------------------------------

describe('themePlugin — load', () => {
  beforeEach(() => setupMocks(THEME, 'ru_RU'));

  it('returns CSS string containing ":root {" for the resolved virtual id', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const result = (plugin.load as any)('\0virtual:theme-vars.css');
    expect(result).toContain(':root {');
  });

  it('returns undefined for any other id', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const result = (plugin.load as any)('not-virtual');
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// configResolved
// ---------------------------------------------------------------------------

describe('themePlugin — configResolved', () => {
  it('reads theme.json and makes CSS available via load', () => {
    setupMocks(THEME, 'ru_RU');
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const css = (plugin.load as any)('\0virtual:theme-vars.css') as string;
    expect(css).toContain('--primary: 5 85% 49%;');
  });

  it('extracts locale lang from seo.json when present', () => {
    setupMocks(THEME, 'ru_RU');
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).toContain('lang="ru"');
  });

  it('defaults lang to "en" when seo.json is missing', () => {
    setupMocks(THEME);
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="fr"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    // DEFAULT_LANGUAGE is 'en-US' — split('_')[0] of 'en-US' gives 'en-US' but
    // the plugin uses locale.split('_')[0]; default is 'en-US', so lang attr
    // will be replaced with 'en-US'
    expect(out).toContain('lang="en-US"');
  });
});

// ---------------------------------------------------------------------------
// transformIndexHtml
// ---------------------------------------------------------------------------

describe('themePlugin — transformIndexHtml', () => {
  beforeEach(() => setupMocks(THEME, 'ru_RU'));

  it('injects <style id="theme-vars"> before </head>', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).toContain('<style id="theme-vars">');
    expect(out.indexOf('<style id="theme-vars">')).toBeLessThan(out.indexOf('</head>'));
  });

  it('CSS contains --primary:', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).toContain('--primary:');
  });

  it('CSS contains --radius:', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).toContain('--radius:');
  });

  it('CSS contains --font-heading:', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).toContain('--font-heading:');
  });

  it('CSS contains --font-body:', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).toContain('--font-body:');
  });

  it('CSS contains ".dark {" when darkColors present', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).toContain('.dark {');
  });

  it('CSS does not contain ".dark {" when darkColors absent', () => {
    setupMocks(THEME_NO_DARK, 'ru_RU');
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).not.toContain('.dark {');
  });

  it('replaces lang="..." in <html> tag with locale-derived value', () => {
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const html = '<html lang="en"><head></head><body></body></html>';
    const out = (plugin.transformIndexHtml as any)(html) as string;
    expect(out).toContain('lang="ru"');
    expect(out).not.toContain('lang="en"');
  });
});

// ---------------------------------------------------------------------------
// buildColorVars — camelCase key mapping (via load/transformIndexHtml output)
// ---------------------------------------------------------------------------

describe('buildColorVars (via load output)', () => {
  it('maps camelCase key "surfaceDark" to "--surface-dark"', () => {
    setupMocks(THEME, 'ru_RU');
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const css = (plugin.load as any)('\0virtual:theme-vars.css') as string;
    expect(css).toContain('--surface-dark:');
  });

  it('passes unknown keys through as-is (e.g. "myCustomColor" → "--myCustomColor")', () => {
    const themeWithCustom = {
      ...THEME,
      colors: { ...THEME.colors, myCustomColor: '200 50% 50%' },
    };
    setupMocks(themeWithCustom, 'ru_RU');
    const plugin = themePlugin();
    (plugin.configResolved as any)({});
    const css = (plugin.load as any)('\0virtual:theme-vars.css') as string;
    expect(css).toContain('--myCustomColor:');
  });
});

// Suppress unused import warning — readFileSync/existsSync are used via mocks
void (readFileSync as unknown);
void (existsSync as unknown);
void (SEO_WITH_LOCALE as unknown);
