import { z } from 'zod';

// ── GalleryImage (moved here from index.ts to avoid circular dependency) ──────

export const GalleryImageSchema = z.object({
  src: z.string(),
  description: z.string().optional(),
});

export type GalleryImage = z.infer<typeof GalleryImageSchema>;

// ── BlockColor ─────────────────────────────────────────────────────────────────

const BlockColorSchema = z.object({
  type: z.enum(['solid', 'gradient', 'primary', 'accent']),
  /** Tailwind gradient stops for type 'gradient'; falls back to hero.gradient when omitted. */
  value: z.string().optional(),
});

export type BlockColor = z.infer<typeof BlockColorSchema>;

// ── Individual block schemas ───────────────────────────────────────────────────

const HeadingBlockSchema = z.object({
  __component: z.literal('heading'),
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  text: z.string(),
});

export type HeadingBlock = z.infer<typeof HeadingBlockSchema>;

const ParagraphBlockSchema = z.object({
  __component: z.literal('paragraph'),
  text: z.string(),
  align: z.enum(['left', 'center']).optional(),
});

export type ParagraphBlock = z.infer<typeof ParagraphBlockSchema>;

const ImageBlockSchema = z.object({
  __component: z.literal('image'),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  size: z.enum(['small', 'medium', 'full']).optional(),
});

export type ImageBlock = z.infer<typeof ImageBlockSchema>;

const GalleryBlockSchema = z.object({
  __component: z.literal('gallery'),
  images: z.array(GalleryImageSchema),
});

export type GalleryBlock = z.infer<typeof GalleryBlockSchema>;

const BlockquoteRefSchema = z.object({
  __component: z.literal('blockquote'),
  testimonialId: z.number(),
});

export type BlockquoteRefBlock = z.infer<typeof BlockquoteRefSchema>;

const BlockquoteInlineSchema = z.object({
  __component: z.literal('blockquote'),
  text: z.string(),
  author: z.string(),
  role: z.string().optional(),
  company: z.string().optional(),
});

export type BlockquoteInlineBlock = z.infer<typeof BlockquoteInlineSchema>;

const BlockquoteBlockSchema = z.union([BlockquoteRefSchema, BlockquoteInlineSchema]);

export type BlockquoteBlock = z.infer<typeof BlockquoteBlockSchema>;

const MetricsBlockSchema = z.object({
  __component: z.literal('metrics'),
  title: z.string().optional(),
  items: z.array(z.object({ metric: z.string(), label: z.string(), description: z.string() })),
  color: BlockColorSchema.optional(),
});

export type MetricsBlock = z.infer<typeof MetricsBlockSchema>;

const CardsBlockSchema = z.object({
  __component: z.literal('cards'),
  title: z.string().optional(),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  items: z.array(z.object({ title: z.string(), description: z.string() })),
  color: BlockColorSchema.optional(),
});

export type CardsBlock = z.infer<typeof CardsBlockSchema>;

const TableBlockSchema = z.object({
  __component: z.literal('table'),
  title: z.string().optional(),
  caption: z.string().optional(),
  head: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  highlight: z.array(z.number()).optional(),
  total: z.array(z.string()).optional(),
});

export type TableBlock = z.infer<typeof TableBlockSchema>;

const ChartBlockSchema = z.object({
  __component: z.literal('chart'),
  type: z.enum(['bar', 'horizontal-bar', 'progress', 'line', 'pie']),
  title: z.string().optional(),
  items: z.array(z.object({ label: z.string(), value: z.number(), suffix: z.string().optional() })),
  color: BlockColorSchema.optional(),
});

export type ChartBlock = z.infer<typeof ChartBlockSchema>;

const DividerBlockSchema = z.object({
  __component: z.literal('divider'),
  style: z.enum(['line', 'dots', 'space']).optional(),
});

export type DividerBlock = z.infer<typeof DividerBlockSchema>;

const CalloutBlockSchema = z.object({
  __component: z.literal('callout'),
  type: z.enum(['info', 'success', 'warning', 'note']),
  title: z.string().optional(),
  text: z.string(),
});

export type CalloutBlock = z.infer<typeof CalloutBlockSchema>;

const ListBlockSchema = z.object({
  __component: z.literal('list'),
  style: z.enum(['ordered', 'unordered', 'checklist']),
  items: z.array(z.string()),
});

export type ListBlock = z.infer<typeof ListBlockSchema>;

const VideoBlockSchema = z.object({
  __component: z.literal('video'),
  url: z.string(),
  caption: z.string().optional(),
  aspectRatio: z.string().optional(),
});

export type VideoBlock = z.infer<typeof VideoBlockSchema>;

const CodeBlockSchema = z.object({
  __component: z.literal('code'),
  language: z.string().optional(),
  code: z.string(),
  caption: z.string().optional(),
});

export type CodeBlock = z.infer<typeof CodeBlockSchema>;

const OrderFormBlockSchema = z.object({
  __component: z.literal('order-form'),
  formId: z.string(),
  title: z.string().optional(),
  color: BlockColorSchema.optional(),
});

export type OrderFormBlock = z.infer<typeof OrderFormBlockSchema>;

// ── ContentBlock discriminated union ──────────────────────────────────────────

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
