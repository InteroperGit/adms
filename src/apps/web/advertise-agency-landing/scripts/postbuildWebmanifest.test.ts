import { describe, it, expect } from 'vitest';
import { buildWebmanifest } from './postbuildWebmanifest';

const site = {
  name: 'РА «Рекламастер»',
  description: 'Рекламное агентство полного цикла',
};

describe('buildWebmanifest', () => {
  it('sets name from site config', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    expect(manifest.name).toBe('РА «Рекламастер»');
  });

  it('strips guillemets and trims short_name', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    expect(manifest.short_name).not.toContain('«');
    expect(manifest.short_name).not.toContain('»');
    expect((manifest.short_name as string).trim()).toBe(manifest.short_name);
  });

  it('sets description from site config', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    expect(manifest.description).toBe(site.description);
  });

  it('sets start_url to /', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    expect(manifest.start_url).toBe('/');
  });

  it('sets display to standalone', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    expect(manifest.display).toBe('standalone');
  });

  it('sets background_color to #ffffff', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    expect(manifest.background_color).toBe('#ffffff');
  });

  it('wraps primaryHsl in hsl() for theme_color', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    expect(manifest.theme_color).toBe('hsl(17 93% 52%)');
  });

  it('icons includes apple-touch-icon entry', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    const icons = manifest.icons as Array<Record<string, string>>;
    expect(icons.some((i) => i.src === '/apple-touch-icon.png' && i.sizes === '180x180')).toBe(true);
  });

  it('icons includes favicon.svg entry', () => {
    const manifest = buildWebmanifest(site, '17 93% 52%') as Record<string, unknown>;
    const icons = manifest.icons as Array<Record<string, string>>;
    expect(icons.some((i) => i.src === '/favicon.svg' && i.sizes === 'any')).toBe(true);
  });
});
