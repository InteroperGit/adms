import { z } from 'zod';

/**
 * @module portfolio/blocks
 * @description Content block type definitions for portfolio case pages.
 * Includes heading, paragraph, image, gallery, blockquote, metrics, cards, table, chart,
 * divider, callout, list, video, code, and order-form blocks—each with Zod validation schemas.
 * Exported as a discriminated union ContentBlock for type-safe rendering.
 */

// ── GalleryImage (moved here from index.ts to avoid circular dependency) ──────

/**
 * @description Single image in a gallery block with optional caption
 */
export const GalleryImageSchema = z.object({
  /** Image URL */
  src: z.string(),
  /** Optional image caption or alt description */
  description: z.string().optional(),
});

export type GalleryImage = z.infer<typeof GalleryImageSchema>;

// ── BlockColor ─────────────────────────────────────────────────────────────────

/**
 * @description Color styling for content blocks (metrics, cards, charts)
 */
const BlockColorSchema = z.object({
  /** Color type: solid hex, Tailwind gradient, or semantic (primary/accent) */
  type: z.enum(['solid', 'gradient', 'primary', 'accent']),
  /** Tailwind gradient stops for type 'gradient'; falls back to hero.gradient when omitted. */
  value: z.string().optional(),
});

export type BlockColor = z.infer<typeof BlockColorSchema>;

// ── Individual block schemas ───────────────────────────────────────────────────

/**
 * @description Heading block for case content sections
 */
const HeadingBlockSchema = z.object({
  __component: z.literal('heading'),
  /** HTML heading level (h2, h3, or h4) */
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  /** Heading text */
  text: z.string(),
});

export type HeadingBlock = z.infer<typeof HeadingBlockSchema>;

/**
 * @description Text paragraph block
 */
const ParagraphBlockSchema = z.object({
  __component: z.literal('paragraph'),
  /** Paragraph content */
  text: z.string(),
  /** Text alignment (defaults to left) */
  align: z.enum(['left', 'center']).optional(),
});

export type ParagraphBlock = z.infer<typeof ParagraphBlockSchema>;

/**
 * @description Single image block
 */
const ImageBlockSchema = z.object({
  __component: z.literal('image'),
  /** Image URL */
  src: z.string(),
  /** Alt text for accessibility */
  alt: z.string(),
  /** Optional image caption */
  caption: z.string().optional(),
  /** Display width (small: 50%, medium: 75%, full: 100%) */
  size: z.enum(['small', 'medium', 'full']).optional(),
});

export type ImageBlock = z.infer<typeof ImageBlockSchema>;

/**
 * @description Gallery block with multiple images and lightbox support
 */
const GalleryBlockSchema = z.object({
  __component: z.literal('gallery'),
  /** Array of images in gallery */
  images: z.array(GalleryImageSchema),
});

export type GalleryBlock = z.infer<typeof GalleryBlockSchema>;

/**
 * @description Blockquote referencing a testimonial by ID
 */
const BlockquoteRefSchema = z.object({
  __component: z.literal('blockquote'),
  /** ID of testimonial to embed */
  testimonialId: z.number(),
});

export type BlockquoteRefBlock = z.infer<typeof BlockquoteRefSchema>;

/**
 * @description Inline blockquote with direct text and attribution
 */
const BlockquoteInlineSchema = z.object({
  __component: z.literal('blockquote'),
  /** Quote text */
  text: z.string(),
  /** Author name */
  author: z.string(),
  /** Optional author role/title */
  role: z.string().optional(),
  /** Optional author company */
  company: z.string().optional(),
});

export type BlockquoteInlineBlock = z.infer<typeof BlockquoteInlineSchema>;

/**
 * @description Blockquote union: either referenced testimonial or inline quote
 */
const BlockquoteBlockSchema = z.union([BlockquoteRefSchema, BlockquoteInlineSchema]);

export type BlockquoteBlock = z.infer<typeof BlockquoteBlockSchema>;

/**
 * @description Key metrics display block (e.g., impressions, conversions, growth)
 */
const MetricsBlockSchema = z.object({
  __component: z.literal('metrics'),
  /** Optional block title */
  title: z.string().optional(),
  /** Array of metrics with values and descriptions */
  items: z.array(z.object({ metric: z.string(), label: z.string(), description: z.string() })),
  /** Optional background color styling */
  color: BlockColorSchema.optional(),
});

export type MetricsBlock = z.infer<typeof MetricsBlockSchema>;

/**
 * @description Grid of content cards
 */
const CardsBlockSchema = z.object({
  __component: z.literal('cards'),
  /** Optional block title */
  title: z.string().optional(),
  /** Number of columns (defaults to 3) */
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  /** Array of cards with title and description */
  items: z.array(z.object({ title: z.string(), description: z.string() })),
  /** Optional background color styling */
  color: BlockColorSchema.optional(),
});

export type CardsBlock = z.infer<typeof CardsBlockSchema>;

/**
 * @description Data table with optional footer row and cell highlighting
 */
const TableBlockSchema = z.object({
  __component: z.literal('table'),
  /** Optional table title */
  title: z.string().optional(),
  /** Optional table caption */
  caption: z.string().optional(),
  /** Column headers */
  head: z.array(z.string()),
  /** Table rows (each row is array of cells) */
  rows: z.array(z.array(z.string())),
  /** Optional row indices to highlight (e.g., [0, 3]) */
  highlight: z.array(z.number()).optional(),
  /** Optional total/summary row (bottom) */
  total: z.array(z.string()).optional(),
});

export type TableBlock = z.infer<typeof TableBlockSchema>;

/**
 * @description Chart visualization block (bar, line, pie, etc.)
 */
const ChartBlockSchema = z.object({
  __component: z.literal('chart'),
  /** Chart type to render */
  type: z.enum(['bar', 'horizontal-bar', 'progress', 'line', 'pie']),
  /** Optional chart title */
  title: z.string().optional(),
  /** Data points with labels and values */
  items: z.array(z.object({ label: z.string(), value: z.number(), suffix: z.string().optional() })),
  /** Optional background color styling */
  color: BlockColorSchema.optional(),
});

export type ChartBlock = z.infer<typeof ChartBlockSchema>;

/**
 * @description Visual divider between content sections
 */
const DividerBlockSchema = z.object({
  __component: z.literal('divider'),
  /** Visual style (line, decorative dots, or whitespace) */
  style: z.enum(['line', 'dots', 'space']).optional(),
});

export type DividerBlock = z.infer<typeof DividerBlockSchema>;

/**
 * @description Highlighted callout/alert box with contextual styling
 */
const CalloutBlockSchema = z.object({
  __component: z.literal('callout'),
  /** Semantic type for styling (info: blue, success: green, warning: orange, note: neutral) */
  type: z.enum(['info', 'success', 'warning', 'note']),
  /** Optional callout title */
  title: z.string().optional(),
  /** Callout message text */
  text: z.string(),
});

export type CalloutBlock = z.infer<typeof CalloutBlockSchema>;

/**
 * @description Bulleted, numbered, or checklist block
 */
const ListBlockSchema = z.object({
  __component: z.literal('list'),
  /** List style: ul, ol, or checkmarks */
  style: z.enum(['ordered', 'unordered', 'checklist']),
  /** Array of list items */
  items: z.array(z.string()),
});

export type ListBlock = z.infer<typeof ListBlockSchema>;

/**
 * @description Embedded video block (YouTube, Vimeo, etc.)
 */
const VideoBlockSchema = z.object({
  __component: z.literal('video'),
  /** Video URL (supports YouTube, Vimeo embed URLs) */
  url: z.string(),
  /** Optional video caption */
  caption: z.string().optional(),
  /** Optional aspect ratio (e.g., "16/9", "4/3") */
  aspectRatio: z.string().optional(),
});

export type VideoBlock = z.infer<typeof VideoBlockSchema>;

/**
 * @description Code snippet block with syntax highlighting
 */
const CodeBlockSchema = z.object({
  __component: z.literal('code'),
  /** Programming language for syntax highlighting (js, python, html, etc.) */
  language: z.string().optional(),
  /** Code content */
  code: z.string(),
  /** Optional code caption/description */
  caption: z.string().optional(),
});

export type CodeBlock = z.infer<typeof CodeBlockSchema>;

/**
 * @description Embedded order form block for case page CTAs
 */
const OrderFormBlockSchema = z.object({
  __component: z.literal('order-form'),
  /** ID of the form to embed (matches orderForms.json) */
  formId: z.string(),
  /** Optional form title/header */
  title: z.string().optional(),
  /** Optional background color styling */
  color: BlockColorSchema.optional(),
});

export type OrderFormBlock = z.infer<typeof OrderFormBlockSchema>;

// ── ContentBlock discriminated union ──────────────────────────────────────────

/**
 * @description Zod schema for content blocks - discriminated union by __component field
 */
export const ContentBlockSchema = z.union([
  HeadingBlockSchema,
  ParagraphBlockSchema,
  ImageBlockSchema,
  GalleryBlockSchema,
  BlockquoteBlockSchema,
  MetricsBlockSchema,
  CardsBlockSchema,
  TableBlockSchema,
  ChartBlockSchema,
  DividerBlockSchema,
  CalloutBlockSchema,
  ListBlockSchema,
  VideoBlockSchema,
  CodeBlockSchema,
  OrderFormBlockSchema,
]);

/**
 * @description Union of all content block types composing portfolio case content
 */
export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | GalleryBlock
  | BlockquoteBlock
  | MetricsBlock
  | CardsBlock
  | TableBlock
  | ChartBlock
  | DividerBlock
  | CalloutBlock
  | ListBlock
  | VideoBlock
  | CodeBlock
  | OrderFormBlock;
