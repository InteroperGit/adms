import type { GalleryImage } from './index';

export interface BlockColor {
  type: 'solid' | 'gradient' | 'primary' | 'accent';
  /** Tailwind gradient stops for type 'gradient' (e.g. "from-amber-400 to-orange-500").
   *  Falls back to the case's hero.gradient when omitted. */
  value?: string;
}

export interface HeadingBlock {
  __component: 'heading';
  level: 2 | 3 | 4;
  text: string;
}

export interface ParagraphBlock {
  __component: 'paragraph';
  text: string;
  align?: 'left' | 'center';
}

export interface ImageBlock {
  __component: 'image';
  src: string;
  alt: string;
  caption?: string;
  size?: 'small' | 'medium' | 'full';
}

export interface GalleryBlock {
  __component: 'gallery';
  images: GalleryImage[];
}

export interface BlockquoteRefBlock {
  __component: 'blockquote';
  testimonialId: number;
}

export interface BlockquoteInlineBlock {
  __component: 'blockquote';
  text: string;
  author: string;
  role?: string;
  company?: string;
}

export type BlockquoteBlock = BlockquoteRefBlock | BlockquoteInlineBlock;

export interface MetricsBlock {
  __component: 'metrics';
  title?: string;
  items: { metric: string; label: string; description: string }[];
  color?: BlockColor;
}

export interface CardsBlock {
  __component: 'cards';
  title?: string;
  columns?: 2 | 3 | 4;
  items: { title: string; description: string }[];
  color?: BlockColor;
}

export interface TableBlock {
  __component: 'table';
  title?: string;
  caption?: string;
  head: string[];
  rows: string[][];
  highlight?: number[];
  total?: string[];
}

export interface ChartBlock {
  __component: 'chart';
  type: 'bar' | 'horizontal-bar' | 'progress' | 'line' | 'pie';
  title?: string;
  items: { label: string; value: number; suffix?: string }[];
  color?: BlockColor;
}

export interface DividerBlock {
  __component: 'divider';
  style?: 'line' | 'dots' | 'space';
}

export interface CalloutBlock {
  __component: 'callout';
  type: 'info' | 'success' | 'warning' | 'note';
  title?: string;
  text: string;
}

export interface ListBlock {
  __component: 'list';
  style: 'ordered' | 'unordered' | 'checklist';
  items: string[];
}

export interface VideoBlock {
  __component: 'video';
  url: string;
  caption?: string;
  aspectRatio?: string;
}

export interface CodeBlock {
  __component: 'code';
  language?: string;
  code: string;
  caption?: string;
}

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
  | CodeBlock;
