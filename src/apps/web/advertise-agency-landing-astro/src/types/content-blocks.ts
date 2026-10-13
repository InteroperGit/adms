/** Shared metadata recorded for authored content blocks. */
export interface ContentBlockProvenance {
  source: string;
  rights?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
}

export interface ContentBlockMeta {
  id?: string;
  provenance?: ContentBlockProvenance;
}

export interface ParagraphBlock extends ContentBlockMeta {
  type: 'paragraph';
  heading?: string;
  paragraphs: string[];
}

export interface OrderedListBlock extends ContentBlockMeta {
  type: 'ordered-list';
  heading?: string;
  items: string[];
}

export interface UnorderedListBlock extends ContentBlockMeta {
  type: 'unordered-list';
  heading?: string;
  items: string[];
}

export interface TableBlock extends ContentBlockMeta {
  type: 'table';
  title?: string;
  caption?: string;
  columns: { key: string; label: string }[];
  rows: { cells: string[] }[];
}

export interface ChartBlock extends ContentBlockMeta {
  type: 'chart';
  title?: string;
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
}

export interface ImageBlock extends ContentImage {
  type: 'image';
}

export interface ImageStackBlock extends ContentBlockMeta {
  type: 'image-stack';
  caption?: string;
  images: ContentImage[];
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
  | ParagraphBlock
  | OrderedListBlock
  | UnorderedListBlock
  | TableBlock
  | ChartBlock
  | ImageBlock
  | ImageStackBlock
  | OrderFormBlock
  | QuoteBlock
  | FootnoteBlock;
