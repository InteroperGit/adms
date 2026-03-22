/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { join } from 'path';

vi.mock('fs', () => {
  const existsSync = vi.fn();
  const readFileSync = vi.fn();
  const writeFileSync = vi.fn();
  const mkdirSync = vi.fn();
  const copyFileSync = vi.fn();
  const readdirSync = vi.fn();
  const statSync = vi.fn();
  const unlinkSync = vi.fn();
  const mod = {
    existsSync,
    readFileSync,
    writeFileSync,
    mkdirSync,
    copyFileSync,
    readdirSync,
    statSync,
    unlinkSync,
  };
  return { ...mod, default: mod };
});

import {
  hashFile,
  hashFiles,
  computeGlobalHash,
  computeRouteManifest,
  loadPreviousManifest,
  diffManifest,
  restoreCached,
  saveCache,
  writeBuildDiff,
  readBuildDiff,
  clearBuildDiff,
} from './incrementalSSG';
import type { RouteManifest, BuildDiff } from './incrementalSSG';
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';

const ROOT = '/project';
const DIST = '/dist';

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// hashFile
// ---------------------------------------------------------------------------

describe('hashFile()', () => {
  it('returns a 64-char hex string for file content', () => {
    vi.mocked(readFileSync).mockReturnValue('hello world' as any);
    const result = hashFile('/file.txt');
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });

  it('returns different hashes for different content', () => {
    vi.mocked(readFileSync).mockReturnValueOnce('content-a' as any);
    const hashA = hashFile('/file.txt');
    vi.mocked(readFileSync).mockReturnValueOnce('content-b' as any);
    const hashB = hashFile('/file.txt');
    expect(hashA).not.toBe(hashB);
  });
});

// ---------------------------------------------------------------------------
// hashFiles
// ---------------------------------------------------------------------------

describe('hashFiles()', () => {
  it('returns a stable 64-char hex string for an empty array', () => {
    const result = hashFiles([]);
    expect(result).toMatch(/^[a-f0-9]{64}$/);
    expect(hashFiles([])).toBe(result);
  });

  it('is order-independent — same hash regardless of input order', () => {
    vi.mocked(readFileSync).mockImplementation(
      (p: unknown) => ((p as string) === '/a.ts' ? 'aaa' : 'bbb') as any
    );
    const h1 = hashFiles(['/a.ts', '/b.ts']);
    const h2 = hashFiles(['/b.ts', '/a.ts']);
    expect(h1).toBe(h2);
  });

  it('uses a missing sentinel for unreadable files, distinct from empty file hash', () => {
    vi.mocked(readFileSync).mockReturnValue('' as any);
    const emptyHash = hashFiles(['/file.ts']);

    vi.mocked(readFileSync).mockImplementation(() => {
      throw new Error('ENOENT');
    });
    const missingHash = hashFiles(['/file.ts']);

    expect(emptyHash).not.toBe(missingHash);
  });

  it('produces different hashes when two files swap content', () => {
    vi.mocked(readFileSync).mockImplementation(
      (p: unknown) => ((p as string) === '/a.ts' ? 'aaa' : 'bbb') as any
    );
    const h1 = hashFiles(['/a.ts', '/b.ts']);

    vi.mocked(readFileSync).mockImplementation(
      (p: unknown) => ((p as string) === '/a.ts' ? 'bbb' : 'aaa') as any
    );
    const h2 = hashFiles(['/a.ts', '/b.ts']);

    expect(h1).not.toBe(h2);
  });
});

// ---------------------------------------------------------------------------
// diffManifest
// ---------------------------------------------------------------------------

function makeManifest(globalHash: string, routes: Record<string, string>): RouteManifest {
  return {
    globalHash,
    routes: Object.fromEntries(
      Object.entries(routes).map(([route, hash]) => [route, { hash, htmlFile: 'index.html' }])
    ),
  };
}

describe('diffManifest()', () => {
  it('treats null previous as full rebuild — all routes changed, globalChanged=true', () => {
    const current = makeManifest('abc', { '/': 'h1', '/about': 'h2' });
    const result = diffManifest(null, current);
    expect(result.globalChanged).toBe(true);
    expect(result.changed).toEqual(expect.arrayContaining(['/', '/about']));
    expect(result.unchanged).toEqual([]);
  });

  it('treats globalHash mismatch as full rebuild', () => {
    const prev = makeManifest('old', { '/': 'h1' });
    const curr = makeManifest('new', { '/': 'h1' });
    const result = diffManifest(prev, curr);
    expect(result.globalChanged).toBe(true);
    expect(result.changed).toEqual(['/']);
    expect(result.unchanged).toEqual([]);
  });

  it('returns all unchanged when manifests are identical', () => {
    const prev = makeManifest('abc', { '/': 'h1', '/about': 'h2' });
    const curr = makeManifest('abc', { '/': 'h1', '/about': 'h2' });
    const result = diffManifest(prev, curr);
    expect(result.globalChanged).toBe(false);
    expect(result.changed).toEqual([]);
    expect(result.unchanged).toEqual(expect.arrayContaining(['/', '/about']));
  });

  it('marks only the route whose hash changed', () => {
    const prev = makeManifest('abc', { '/': 'h1', '/about': 'h2' });
    const curr = makeManifest('abc', { '/': 'h1', '/about': 'changed' });
    const result = diffManifest(prev, curr);
    expect(result.globalChanged).toBe(false);
    expect(result.changed).toEqual(['/about']);
    expect(result.unchanged).toEqual(['/']);
  });

  it('marks routes new in current (absent from previous) as changed', () => {
    const prev = makeManifest('abc', { '/': 'h1' });
    const curr = makeManifest('abc', { '/': 'h1', '/new': 'h2' });
    const result = diffManifest(prev, curr);
    expect(result.changed).toContain('/new');
    expect(result.unchanged).toContain('/');
  });
});

// ---------------------------------------------------------------------------
// loadPreviousManifest
// ---------------------------------------------------------------------------

describe('loadPreviousManifest()', () => {
  it('returns null when the manifest file does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    expect(loadPreviousManifest(ROOT)).toBeNull();
  });

  it('returns null when the manifest JSON is malformed', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue('{invalid json' as any);
    expect(loadPreviousManifest(ROOT)).toBeNull();
  });

  it('returns null when required fields are missing', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ foo: 'bar' }) as any);
    expect(loadPreviousManifest(ROOT)).toBeNull();
  });

  it('returns the parsed RouteManifest for valid input', () => {
    const manifest: RouteManifest = {
      globalHash: 'abc123',
      routes: { '/': { hash: 'h1', htmlFile: 'index.html' } },
    };
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(manifest) as any);
    expect(loadPreviousManifest(ROOT)).toEqual(manifest);
  });
});

// ---------------------------------------------------------------------------
// writeBuildDiff / readBuildDiff / clearBuildDiff
// ---------------------------------------------------------------------------

const DIFF_PATH = join(ROOT, '.ssg-cache', 'current-diff.json');

function makeDiff(): BuildDiff {
  return {
    unchanged: ['/about'],
    changed: ['/'],
    globalChanged: false,
    firstBuild: false,
    manifest: {
      globalHash: 'abc',
      routes: { '/': { hash: 'h1', htmlFile: 'index.html' } },
    },
  };
}

describe('writeBuildDiff()', () => {
  it('calls mkdirSync and writeFileSync with the correct path and serialised JSON', () => {
    const diff = makeDiff();
    writeBuildDiff(ROOT, diff);
    expect(vi.mocked(mkdirSync)).toHaveBeenCalledWith(join(ROOT, '.ssg-cache'), {
      recursive: true,
    });
    expect(vi.mocked(writeFileSync)).toHaveBeenCalledWith(
      DIFF_PATH,
      JSON.stringify(diff, null, 2),
      'utf-8'
    );
  });
});

describe('readBuildDiff()', () => {
  it('returns null when the diff file does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    expect(readBuildDiff(ROOT)).toBeNull();
  });

  it('returns null when the structure is invalid (unchanged is not an array)', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({ unchanged: 'not-array', changed: [], manifest: {} }) as any
    );
    expect(readBuildDiff(ROOT)).toBeNull();
  });

  it('returns the parsed BuildDiff for valid input', () => {
    const diff = makeDiff();
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(diff) as any);
    expect(readBuildDiff(ROOT)).toEqual(diff);
  });
});

describe('clearBuildDiff()', () => {
  it('calls unlinkSync with the diff path', () => {
    clearBuildDiff(ROOT);
    expect(vi.mocked(unlinkSync)).toHaveBeenCalledWith(DIFF_PATH);
  });

  it('does not throw when unlinkSync fails (file absent)', () => {
    vi.mocked(unlinkSync).mockImplementation(() => {
      throw new Error('ENOENT');
    });
    expect(() => clearBuildDiff(ROOT)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// restoreCached
// ---------------------------------------------------------------------------

describe('restoreCached()', () => {
  const manifest: RouteManifest = {
    globalHash: 'abc',
    routes: { '/': { hash: 'h1', htmlFile: 'index.html' } },
  };

  it('skips routes not present in the manifest', () => {
    restoreCached(ROOT, DIST, ['/not-in-manifest'], manifest);
    expect(vi.mocked(copyFileSync)).not.toHaveBeenCalled();
  });

  it('skips routes whose cached file does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    restoreCached(ROOT, DIST, ['/'], manifest);
    expect(vi.mocked(copyFileSync)).not.toHaveBeenCalled();
  });

  it('copies the cached HTML to dist and creates parent dirs when cache file exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    restoreCached(ROOT, DIST, ['/'], manifest);
    const cacheFile = join(ROOT, '.ssg-cache', 'html', 'index.html');
    const destFile = join(DIST, 'index.html');
    expect(vi.mocked(mkdirSync)).toHaveBeenCalled();
    expect(vi.mocked(copyFileSync)).toHaveBeenCalledWith(cacheFile, destFile);
  });
});

// ---------------------------------------------------------------------------
// saveCache
// ---------------------------------------------------------------------------

describe('saveCache()', () => {
  const manifest: RouteManifest = {
    globalHash: 'abc',
    routes: { '/': { hash: 'h1', htmlFile: 'index.html' } },
  };

  it('skips HTML files that do not exist in distDir', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    saveCache(ROOT, DIST, manifest);
    expect(vi.mocked(copyFileSync)).not.toHaveBeenCalled();
  });

  it('copies HTML from dist to cache dir and writes manifest.json', () => {
    // Return true only for paths inside DIST so cleanStaleCacheFiles exits early
    vi.mocked(existsSync).mockImplementation((p: unknown) =>
      String(p).replace(/\\/g, '/').startsWith(DIST)
    );
    saveCache(ROOT, DIST, manifest);
    const src = join(DIST, 'index.html');
    const dest = join(ROOT, '.ssg-cache', 'html', 'index.html');
    expect(vi.mocked(copyFileSync)).toHaveBeenCalledWith(src, dest);
    expect(vi.mocked(writeFileSync)).toHaveBeenCalledWith(
      join(ROOT, '.ssg-cache', 'manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );
  });

  it('calls mkdirSync with recursive:true for the cache html dir', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    saveCache(ROOT, DIST, manifest);
    expect(vi.mocked(mkdirSync)).toHaveBeenCalledWith(join(ROOT, '.ssg-cache', 'html'), {
      recursive: true,
    });
  });
});

// ---------------------------------------------------------------------------
// computeGlobalHash
// ---------------------------------------------------------------------------

describe('computeGlobalHash()', () => {
  it('returns a 64-char hex string (mocked empty filesystem)', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    const result = computeGlobalHash(ROOT);
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });
});

// ---------------------------------------------------------------------------
// computeRouteManifest
// ---------------------------------------------------------------------------

describe('computeRouteManifest()', () => {
  it('returns a manifest with a globalHash string and static routes defined', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    const result = computeRouteManifest(ROOT);
    expect(result.globalHash).toMatch(/^[a-f0-9]{64}$/);
    expect(typeof result.routes).toBe('object');
    expect(result.routes['/']).toBeDefined();
    expect(result.routes['/404']).toBeDefined();
  });
});
