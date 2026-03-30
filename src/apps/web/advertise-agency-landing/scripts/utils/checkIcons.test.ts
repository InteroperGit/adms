import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';

vi.mock('fs', () => {
  const readdirSync = vi.fn();
  const readFileSync = vi.fn();
  const writeFileSync = vi.fn();
  const mod = { readdirSync, readFileSync, writeFileSync };
  return { ...mod, default: mod };
});

// Mock the ICON_MAP import so the module can load without the real source files
vi.mock('../src/types/shared/iconMap', () => ({
  ICON_MAP: {},
}));

import { readdirSync } from 'fs';
import { extractIconValues, listJsonFiles } from './checkIcons';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('extractIconValues', () => {
  it('returns [] for a string primitive', () => {
    expect(extractIconValues('hello')).toEqual([]);
  });

  it('returns [] for a number primitive', () => {
    expect(extractIconValues(42)).toEqual([]);
  });

  it('returns [] for null', () => {
    expect(extractIconValues(null)).toEqual([]);
  });

  it('returns [] for an empty object', () => {
    expect(extractIconValues({})).toEqual([]);
  });

  it('extracts a single icon string value from a flat object', () => {
    expect(extractIconValues({ icon: 'ArrowRight', label: 'Go' })).toEqual(['ArrowRight']);
  });

  it('extracts multiple icon values from nested objects', () => {
    const obj = {
      a: { icon: 'Home' },
      b: { icon: 'Star', nested: { icon: 'Bell' } },
    };
    expect(extractIconValues(obj).sort()).toEqual(['Bell', 'Home', 'Star']);
  });

  it('extracts icon values from objects inside arrays', () => {
    const obj = { items: [{ icon: 'Check' }, { icon: 'X' }] };
    expect(extractIconValues(obj).sort()).toEqual(['Check', 'X']);
  });

  it('does NOT extract non-icon string fields', () => {
    expect(extractIconValues({ label: 'foo', title: 'bar' })).toEqual([]);
  });

  it('does NOT extract non-string icon values', () => {
    expect(extractIconValues({ icon: 42 })).toEqual([]);
    expect(extractIconValues({ icon: null })).toEqual([]);
    expect(extractIconValues({ icon: { name: 'foo' } })).toEqual([]);
  });
});

describe('listJsonFiles', () => {
  it('returns empty array when readdirSync throws (directory missing)', () => {
    vi.mocked(readdirSync).mockImplementation(() => {
      throw new Error('ENOENT');
    });
    expect(listJsonFiles('/no/such/dir')).toEqual([]);
  });

  it('returns only .json filenames mapped to full paths', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(readdirSync).mockReturnValue(['a.json', 'b.json'] as any);
    expect(listJsonFiles('/some/dir')).toEqual([
      path.join('/some/dir', 'a.json'),
      path.join('/some/dir', 'b.json'),
    ]);
  });

  it('skips non-.json files', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(readdirSync).mockReturnValue(['a.json', 'b.ts', 'c.md', 'd.json'] as any);
    expect(listJsonFiles('/some/dir')).toEqual([
      path.join('/some/dir', 'a.json'),
      path.join('/some/dir', 'd.json'),
    ]);
  });
});
