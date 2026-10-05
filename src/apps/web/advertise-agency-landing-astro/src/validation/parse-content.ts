import type { z } from 'astro/zod';

/** Include the editable source file and field paths in build errors. */
export function parseContent<T extends z.ZodType>(schema: T, data: unknown, source: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid content in ${source}:\n${issues.join('\n')}`);
  }
  return result.data;
}
