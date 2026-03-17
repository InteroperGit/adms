/**
 * @module blocks
 * @description Content block type definitions and schemas for portfolio case pages.
 * Includes heading, paragraph, image, gallery, blockquote, metrics, cards, table, chart,
 * divider, callout, list, video, code, and order-form blocks—each with Zod validation schemas.
 * Exported as a discriminated union ContentBlock for type-safe rendering.
 */

import { z } from 'zod';

// Re-export individual types and schemas
export { GalleryImageSchema, type GalleryImage } from './galleryImage';
export { BlockColorSchema, type BlockColor } from './blockColor';
export {
  MetricsBackgroundColorSchema,
  MetricsColorSchema,
  type MetricsBackgroundColor,
  type MetricsColor,
} from './metricsColor';
export { HeadingBlockSchema, type HeadingBlock } from './heading';
export { ParagraphBlockSchema, type ParagraphBlock } from './paragraph';
export { ImageBlockSchema, type ImageBlock } from './image';
export { GalleryBlockSchema, type GalleryBlock } from './gallery';
export {
  BlockquoteBlockSchema,
  BlockquoteRefSchema,
  BlockquoteInlineSchema,
  type BlockquoteBlock,
  type BlockquoteRefBlock,
  type BlockquoteInlineBlock,
} from './blockquote';
export { MetricsBlockSchema, type MetricsBlock } from './metrics';
export { CardsBlockSchema, type CardsBlock } from './cards';
export { TableBlockSchema, type TableBlock } from './table';
export { ChartBlockSchema, type ChartBlock } from './chart';
export { DividerBlockSchema, type DividerBlock } from './divider';
export { CalloutBlockSchema, type CalloutBlock } from './callout';
export { ListBlockSchema, type ListBlock } from './list';
export { VideoBlockSchema, type VideoBlock } from './video';
export { CodeBlockSchema, type CodeBlock } from './code';
export { OrderFormBlockSchema, type OrderFormBlock } from './orderForm';

// Import schemas for union composition
import { HeadingBlockSchema } from './heading';
import { ParagraphBlockSchema } from './paragraph';
import { ImageBlockSchema } from './image';
import { GalleryBlockSchema } from './gallery';
import { BlockquoteBlockSchema } from './blockquote';
import { MetricsBlockSchema } from './metrics';
import { CardsBlockSchema } from './cards';
import { TableBlockSchema } from './table';
import { ChartBlockSchema } from './chart';
import { DividerBlockSchema } from './divider';
import { CalloutBlockSchema } from './callout';
import { ListBlockSchema } from './list';
import { VideoBlockSchema } from './video';
import { CodeBlockSchema } from './code';
import { OrderFormBlockSchema } from './orderForm';

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
export type ContentBlock = z.infer<typeof ContentBlockSchema>;
