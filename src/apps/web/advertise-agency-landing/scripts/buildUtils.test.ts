import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';

vi.mock('fs', () => {
  const existsSync = vi.fn();
  const readFileSync = vi.fn();
  const readdirSync = vi.fn();
  const mod = { existsSync, readFileSync, readdirSync };
  return { ...mod, default: mod };
});

import { existsSync, readFileSync, readdirSync } from 'fs';
import { readJson, walkJsonFiles, extractYearMonth } from './buildUtils';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('readJson', () => {
  it('returns parsed object when file exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ key: 'value' }));
    expect(readJson('/some/file.json')).toEqual({ key: 'value' });
  });

  it('returns null when file does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    expect(readJson('/missing.json')).toBeNull();
  });

  it('throws on invalid JSON', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue('not json{');
    expect(() => readJson('/bad.json')).toThrow();
  });
});

describe('walkJsonFiles', () => {
  it('returns empty array when directory does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    expect(walkJsonFiles('/missing')).toEqual([]);
  });

  it('returns json file paths in a flat directory', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readdirSync).mockReturnValue([
      { name: 'a.json', isDirectory: () => false, isFile: () => true },
      { name: 'b.txt', isDirectory: () => false, isFile: () => true },
    ] as any);
    const result = walkJsonFiles('/dir');
    expect(result).toEqual([path.join('/dir', 'a.json')]);
  });

  it('recursively collects json files from subdirectories', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readdirSync)
      .mockReturnValueOnce([
        { name: 'sub', isDirectory: () => true, isFile: () => false },
      ] as any)
      .mockReturnValueOnce([
        { name: 'case.json', isDirectory: () => false, isFile: () => true },
      ] as any);
    const result = walkJsonFiles('/root');
    expect(result).toEqual([path.join('/root', 'sub', 'case.json')]);
  });

  it('skips non-json files', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readdirSync).mockReturnValue([
      { name: 'image.png', isDirectory: () => false, isFile: () => true },
      { name: 'data.json', isDirectory: () => false, isFile: () => true },
    ] as any);
    const result = walkJsonFiles('/dir');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('data.json');
  });
});

describe('extractYearMonth', () => {
  it('extracts year and month from ISO date', () => {
    expect(extractYearMonth('2024-05-15')).toEqual({ year: '2024', month: '05' });
  });

  it('preserves zero-padded month', () => {
    expect(extractYearMonth('2023-03-01')).toEqual({ year: '2023', month: '03' });
  });

  it('handles month 12 correctly', () => {
    expect(extractYearMonth('2024-12-31')).toEqual({ year: '2024', month: '12' });
  });
});
