/**
 * Audit icon usage across all data JSON files vs ICON_MAP.
 * - Reports unused icons (in map but not referenced in any data file)
 * - Reports missing icons (referenced in data but not in map)
 *
 * Usage:
 *   pnpm check-icons            — audit only
 *   pnpm check-icons --remove   — audit + remove unused icons from iconMap.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ICON_MAP } from '../src/types/shared/iconMap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data/content');
const iconMapPath = path.join(root, 'src/types/shared/iconMap.ts');

const removeFlag = process.argv.includes('--remove');

/** Recursively extract all values of keys named "icon" from a parsed JSON value. */
function extractIconValues(obj: unknown): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap(extractIconValues);
  }
  const result: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const isIconField = key === 'icon' && typeof val === 'string';
    if (isIconField) {
      result.push(val);
    } else {
      result.push(...extractIconValues(val));
    }
  }
  return result;
}

function listJsonFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

const subDirs = ['config', 'sections', 'portfolio', 'legal'].map((d) => path.join(dataDir, d));
const files = subDirs.flatMap(listJsonFiles);

const referencedIcons = new Set<string>();

for (const file of files) {
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf-8'));
  for (const icon of extractIconValues(parsed)) {
    referencedIcons.add(icon);
  }
}

const mapKeys = new Set(Object.keys(ICON_MAP));
const unused = [...mapKeys].filter((k) => !referencedIcons.has(k)).sort();
const missing = [...referencedIcons].filter((k) => !mapKeys.has(k)).sort();

const hasUnused = unused.length > 0;
const hasMissing = missing.length > 0;

// ── Remove unused icons from iconMap.ts ───────────────────────────────────────

function removeUnusedIcons(names: string[]): void {
  let source = readFileSync(iconMapPath, 'utf-8');
  for (const name of names) {
    // Remove from named import block: "  IconName,\n"
    source = source.replace(new RegExp(`^  ${name},\\n`, 'm'), '');
    // Remove from ICON_MAP object: "  IconName,\n"
    source = source.replace(new RegExp(`^  ${name},\\n`, 'm'), '');
  }
  writeFileSync(iconMapPath, source, 'utf-8');
}

const shouldRemoveIcons = removeFlag && unused.length > 0;

if (shouldRemoveIcons) {
  removeUnusedIcons(unused);
}

// ── Report ────────────────────────────────────────────────────────────────────

console.log('\nIcon audit:');
console.log(`  Files scanned  : ${files.length}`);
console.log(`  Icons in map   : ${mapKeys.size}`);
console.log(`  Icons in data  : ${referencedIcons.size}`);

if (hasUnused) {
  if (removeFlag) {
    console.log(`\n✅  Removed ${unused.length} unused icon(s) from iconMap.ts:`);
  } else {
    console.log(
      `\n⚠️  Unused icons (${unused.length}) — run with --remove to delete from ICON_MAP:`
    );
  }
  for (const k of unused) {
    console.log(`  - ${k}`);
  }
} else {
  console.log('\n✅  No unused icons in ICON_MAP.');
}

if (hasMissing) {
  console.log(
    `\n❌  Missing icons (${missing.length}) — referenced in data but absent from ICON_MAP:`
  );
  for (const k of missing) {
    console.log(`  - ${k}`);
  }
  process.exit(1);
} else {
  console.log('✅  No missing icons.');
}
