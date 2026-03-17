/**
 * Shared build-time utilities used by react-router.config.ts, seoMetaPlugin.ts, and validate.ts
 * Extracted to DRY principle (was duplicated across 3 files).
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import path from 'path';

/**
 * Read and parse a JSON file. Returns null if file doesn't exist.
 */
export function readJson<T>(filePath: string): T | null {
  if (!existsSync(filePath)) {
    return null;
  }
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

/**
 * Recursively walk a directory and collect all .json file paths.
 */
export function walkJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkJsonFiles(full);
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      return [full];
    }
    return [];
  });
}

/**
 * Extract year and month from ISO date string (YYYY-MM-DD).
 */
export function extractYearMonth(date: string): { year: string; month: string } {
  return { year: date.slice(0, 4), month: date.slice(5, 7) };
}
