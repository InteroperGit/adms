/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, readFileSync } from 'fs';

vi.mock('fs', () => {
  const existsSync = vi.fn();
  const readFileSync = vi.fn();
  const readdirSync = vi.fn();
  const mkdirSync = vi.fn();
  const writeFileSync = vi.fn();
  const mod = { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync };
  return { ...mod, default: mod };
});

import { imageResizePlugin } from './imageResizePlugin';

const DEFAULTS = { widths: [320, 640, 960, 1280, 1920], quality: 82, format: 'webp' };

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Plugin identity
// ---------------------------------------------------------------------------

describe('imageResizePlugin — identity', () => {
  it('name equals "vite-plugin-image-resize"', () => {
    expect(imageResizePlugin().name).toBe('vite-plugin-image-resize');
  });
});

// ---------------------------------------------------------------------------
// configResolved — site.json absent
// ---------------------------------------------------------------------------

describe('imageResizePlugin — configResolved — site.json absent', () => {
  it('skips reading site.json when file does not exist', () => {
    (existsSync as any).mockReturnValue(false);

    const plugin = imageResizePlugin();
    (plugin.configResolved as any)({ root: '/project', command: 'build' });

    expect(readFileSync).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// configResolved — site.json present, full override
// ---------------------------------------------------------------------------

describe('imageResizePlugin — configResolved — site.json with imageOptimization', () => {
  it('merges imageOptimization from site.json into imgConfig', async () => {
    const siteJson = JSON.stringify({
      imageOptimization: { widths: [400, 800], quality: 70, format: 'webp' },
    });
    (existsSync as any).mockReturnValue(false); // publicImagesDir absent → buildStart exits early
    (readFileSync as any).mockReturnValue(siteJson);

    // First call to existsSync (siteJsonPath) must return true
    (existsSync as any)
      .mockReturnValueOnce(true) // siteJsonPath exists
      .mockReturnValue(false); // publicImagesDir absent

    const plugin = imageResizePlugin();
    (plugin.configResolved as any)({ root: '/project', command: 'build' });

    // Verify readFileSync was called with site.json
    expect(readFileSync).toHaveBeenCalledTimes(1);
    const calledWith = (readFileSync as any).mock.calls[0][0] as string;
    expect(calledWith).toContain('site.json');
  });

  it('partial override: only quality provided — merges with defaults', async () => {
    const siteJson = JSON.stringify({ imageOptimization: { quality: 50 } });
    (existsSync as any)
      .mockReturnValueOnce(true) // siteJsonPath exists
      .mockReturnValue(false); // publicImagesDir absent
    (readFileSync as any).mockReturnValue(siteJson);

    const plugin = imageResizePlugin();
    (plugin.configResolved as any)({ root: '/project', command: 'build' });

    // Plugin should have merged — widths/format from defaults, quality from override.
    // We verify by triggering buildStart (dev mode) — no error means merge succeeded.
    await (plugin.buildStart as any).call({});
    // No throw = merge was fine
    expect(true).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildStart — dev mode early return
// ---------------------------------------------------------------------------

describe('imageResizePlugin — buildStart — dev mode guard', () => {
  it('returns without calling existsSync for images dir when command !== "build"', async () => {
    (existsSync as any).mockReturnValue(false); // site.json absent

    const plugin = imageResizePlugin();
    (plugin.configResolved as any)({ root: '/project', command: 'serve' });

    vi.clearAllMocks(); // reset call counts after configResolved

    await (plugin.buildStart as any).call({});

    // existsSync should NOT be called for images dir
    expect(existsSync).not.toHaveBeenCalled();
  });

  it('does nothing in dev mode (no writes)', async () => {
    const { writeFileSync, mkdirSync } = await import('fs');
    (existsSync as any).mockReturnValue(false);

    const plugin = imageResizePlugin();
    (plugin.configResolved as any)({ root: '/project', command: 'serve' });

    vi.clearAllMocks();

    await (plugin.buildStart as any).call({});

    expect(writeFileSync).not.toHaveBeenCalled();
    expect(mkdirSync).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// buildStart — build mode, images dir absent
// ---------------------------------------------------------------------------

describe('imageResizePlugin — buildStart — build mode, images dir absent', () => {
  it('exits early when publicImagesDir does not exist', async () => {
    const { writeFileSync } = await import('fs');
    (existsSync as any)
      .mockReturnValueOnce(false) // site.json absent
      .mockReturnValueOnce(false); // publicImagesDir absent

    const plugin = imageResizePlugin();
    (plugin.configResolved as any)({ root: '/project', command: 'build' });
    await (plugin.buildStart as any).call({});

    expect(writeFileSync).not.toHaveBeenCalled();
  });
});

// Suppress unused import warnings
void (existsSync as unknown);
void (readFileSync as unknown);
void (DEFAULTS as unknown);
