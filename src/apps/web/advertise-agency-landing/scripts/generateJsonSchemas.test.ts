import { describe, it, expect } from 'vitest';
import {
  schemaUrl,
  getSchemaPathForFile,
  isObjectRoot,
  injectSchema,
} from './generateJsonSchemas.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Resolve the project root the same way the source file does
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

describe('schemaUrl', () => {
  it('returns correct path without section', () => {
    expect(schemaUrl('config', 'site')).toBe('./data/_schema/schema/config/site.schema.json');
  });

  it('returns correct nested path with section', () => {
    expect(schemaUrl('sections', 'header', 'header')).toBe(
      './data/_schema/schema/sections/header/header.schema.json'
    );
  });
});

describe('getSchemaPathForFile', () => {
  const abs = (rel: string) => path.join(root, rel);

  it('returns config schema path for data/content/config/site.json', () => {
    expect(getSchemaPathForFile(abs('data/content/config/site.json'))).toBe(
      '../../_schema/schema/config/site.schema.json'
    );
  });

  it('returns null for data/content/config/categories.json (array-root)', () => {
    expect(getSchemaPathForFile(abs('data/content/config/categories.json'))).toBeNull();
  });

  it('returns legal schema path for data/content/legal/privacyPolicy.json', () => {
    expect(getSchemaPathForFile(abs('data/content/legal/privacyPolicy.json'))).toBe(
      '../../_schema/schema/legal/legalContent.schema.json'
    );
  });

  it('returns section schema path for data/content/sections/header/header.json', () => {
    expect(getSchemaPathForFile(abs('data/content/sections/header/header.json'))).toBe(
      '../../_schema/schema/sections/header/header.schema.json'
    );
  });

  it('returns null for array-root section files (carousel.json)', () => {
    expect(getSchemaPathForFile(abs('data/content/sections/carousel/carousel.json'))).toBeNull();
  });

  it('returns portfolio schema path for data/content/portfolio/all/2024/01/case.json', () => {
    expect(getSchemaPathForFile(abs('data/content/portfolio/all/2024/01/case.json'))).toBe(
      '../../../../../_schema/schema/portfolio/portfolio.schema.json'
    );
  });

  it('returns null for unrecognised paths', () => {
    expect(getSchemaPathForFile(abs('some/other/path/file.json'))).toBeNull();
  });
});

describe('isObjectRoot', () => {
  it('returns true for a plain object', () => {
    expect(isObjectRoot({})).toBe(true);
    expect(isObjectRoot({ a: 1 })).toBe(true);
  });

  it('returns false for an array', () => {
    expect(isObjectRoot([])).toBe(false);
  });

  it('returns false for null', () => {
    expect(isObjectRoot(null)).toBe(false);
  });

  it('returns false for string', () => {
    expect(isObjectRoot('hello')).toBe(false);
  });

  it('returns false for number', () => {
    expect(isObjectRoot(42)).toBe(false);
  });
});

describe('injectSchema', () => {
  it('adds $schema as the first key', () => {
    const result = injectSchema({ title: 'Hello' }, './my.schema.json');
    expect(Object.keys(result)[0]).toBe('$schema');
    expect(result.$schema).toBe('./my.schema.json');
  });

  it('preserves all existing fields', () => {
    const result = injectSchema({ a: 1, b: 'two' }, './s.json');
    expect(result.a).toBe(1);
    expect(result.b).toBe('two');
  });

  it('replaces existing $schema with the new value', () => {
    const result = injectSchema({ $schema: './old.json', x: true }, './new.json');
    expect(result.$schema).toBe('./new.json');
    expect(Object.keys(result).filter((k) => k === '$schema')).toHaveLength(1);
  });

  it('does not mutate the input object', () => {
    const input = { title: 'Test' };
    injectSchema(input, './s.json');
    expect(Object.keys(input)).not.toContain('$schema');
  });
});
