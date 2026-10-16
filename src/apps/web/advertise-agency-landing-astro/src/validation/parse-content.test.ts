// Tests for content parsing errors and source diagnostics.
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { parseContent } from './parse-content';

describe('parseContent', () => {
  const schema = z.object({
    title: z.string().min(1),
    count: z.number().int().positive(),
  });

  it('returns the parsed output for valid content', () => {
    const result = parseContent(schema, { title: 'Example', count: 2 },
      'fixture.json');
    expect(result).toEqual({ title: 'Example', count: 2 });
  });

  it('includes the source and nested diagnostics for invalid content', () => {
    expect(() => parseContent(schema, { title: '', count: 0 },
      'data/content/example.json')).toThrow(
      /Invalid content in data\/content\/example\.json:\n/,
    );
    expect(() => parseContent(schema, { title: '', count: 0 },
      'data/content/example.json')).toThrow(/title:/);
    expect(() => parseContent(schema, { title: '', count: 0 },
      'data/content/example.json')).toThrow(/count:/);
  });

  it('supports an issue without a path', () => {
    const rootIssue = z.string().superRefine((_value, context) => {
      context.addIssue({ code: 'custom', message: 'Root failure' });
    });
    expect(() => parseContent(rootIssue, 'value', 'root.fixture'))
      .toThrow(/root\.fixture:\n: Root failure/);
  });
});
