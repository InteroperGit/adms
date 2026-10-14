/** Shared metadata recorded for authored content blocks. */
export interface ContentBlockProvenance {
  source: string;
  rights?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
}

export type ContentBlockStatus = 'draft' | 'demo' | 'published';

export interface ContentBlockMeta {
  id?: string;
  provenance?: ContentBlockProvenance;
  /** Optional per-block publication state for editorial review. */
  status?: ContentBlockStatus;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingBlock extends ContentBlockMeta {
  type: 'heading';
  level: HeadingLevel;
  text: string;
}

export interface ParagraphBlock extends ContentBlockMeta {
  type: 'paragraph';
  paragraphs: string[];
}

export interface OrderedListBlock extends ContentBlockMeta {
  type: 'ordered-list';
  items: string[];
}

export interface UnorderedListBlock extends ContentBlockMeta {
  type: 'unordered-list';
  items: string[];
}

export interface TableBlock extends ContentBlockMeta {
  type: 'table';
  caption?: string;
  columns: { key: string; label: string }[];
  rows: { cells: string[] }[];
}

export interface ChartBlock extends ContentBlockMeta {
  type: 'chart';
  caption?: string;
  unit?: string;
  chartType: 'bar' | 'line' | 'pie';
  series: {
    name: string;
    points: { label: string; value: number }[];
  }[];
}

export interface ContentImage extends ContentBlockMeta {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Distinguish preview media without inventing installation approval. */
  kind?: 'demo' | 'installation';
  cropGuidance?: string;
  focalPoint?: { x: number; y: number };
  mobileFocalPoint?: { x: number; y: number };
}

export interface ImageBlock extends ContentImage {
  type: 'image';
}

export interface ImageGalleryBlock extends ContentBlockMeta {
  type: 'image-gallery';
  caption?: string;
  images: ContentImage[];
}

export interface VideoBlock extends ContentBlockMeta {
  type: 'video';
  src: string;
  poster?: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  transcript?: string;
  kind?: 'demo' | 'installation';
}

export interface OrderFormBlock extends ContentBlockMeta {
  type: 'order-form';
  formId: string;
  context: 'project' | 'service';
  category?: string;
}

export interface QuoteBlock extends ContentBlockMeta {
  type: 'quote';
  text: string;
  author?: string;
  source?: string;
}

export interface FootnoteBlock extends ContentBlockMeta {
  type: 'footnote';
  text: string;
  reference?: string;
  targetId?: string;
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | OrderedListBlock
  | UnorderedListBlock
  | TableBlock
  | ChartBlock
  | ImageBlock
  | ImageGalleryBlock
  | VideoBlock
  | OrderFormBlock
  | QuoteBlock
  | FootnoteBlock;
