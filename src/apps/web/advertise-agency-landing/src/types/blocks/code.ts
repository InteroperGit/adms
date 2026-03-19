import { z } from 'zod';

/**
 * @module blocks/code
 * @description Code snippet block with syntax highlighting
 */

export const CodeBlockSchema = z.object({
  __component: z.literal('code'),
  /** Programming language for syntax highlighting (js, python, html, etc.) */
  language: z.string().optional(),
  /** Code content */
  code: z.string(),
  /** Optional code caption/description */
  caption: z.string().optional(),
  /** Show line number gutter */
  showLineNumbers: z.boolean().optional(),
});

export type CodeBlock = z.infer<typeof CodeBlockSchema>;
