import type React from 'react';
import type { ContentBlock } from '@/types/blocks';
import { ErrorBoundary } from '@/components/error';
import { BlockErrorFallback } from './BlockErrorFallback';
import { HeadingBlock } from './HeadingBlock';
import { ParagraphBlock } from './ParagraphBlock';
import { ImageBlock } from './ImageBlock';
import { GalleryBlock } from './GalleryBlock';
import { BlockquoteBlock } from './BlockquoteBlock';
import { MetricsBlock } from './MetricsBlock';
import { CardsBlock } from './CardsBlock';
import { TableBlock } from './TableBlock';
import { ChartBlock } from './ChartBlock';
import { DividerBlock } from './DividerBlock';
import { CalloutBlock } from './CalloutBlock';
import { ListBlock } from './ListBlock';
import { VideoBlock } from './VideoBlock';
import { CodeBlock } from './CodeBlock';
import { OrderFormBlock } from './OrderFormBlock';

interface BlockRendererProps {
  block: ContentBlock;
  articleGradient: string;
  articleTitle: string;
}

/** Blocks that need less vertical padding than the default `py-8`. */
const SPARSE_BLOCKS = new Set(['divider', 'heading']);

function renderBlock(
  block: ContentBlock,
  articleGradient: string,
  articleTitle: string
): React.ReactNode {
  switch (block.__component) {
    case 'heading':
      return <HeadingBlock block={block} />;
    case 'paragraph':
      return <ParagraphBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'gallery':
      return <GalleryBlock block={block} articleTitle={articleTitle} />;
    case 'blockquote':
      return <BlockquoteBlock block={block} />;
    case 'metrics':
      return <MetricsBlock block={block} articleGradient={articleGradient} />;
    case 'cards':
      return <CardsBlock block={block} articleGradient={articleGradient} />;
    case 'table':
      return <TableBlock block={block} />;
    case 'chart':
      return <ChartBlock block={block} articleGradient={articleGradient} />;
    case 'divider':
      return <DividerBlock block={block} />;
    case 'callout':
      return <CalloutBlock block={block} />;
    case 'list':
      return <ListBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'code':
      return <CodeBlock block={block} />;
    case 'order-form':
      return <OrderFormBlock block={block} />;
    default: {
      if (import.meta.env.DEV) {
        console.warn('[BlockRenderer] Unknown block type:', (block as ContentBlock).__component);
      }
      return null;
    }
  }
}

function getBlockSpacing(block: ContentBlock): string {
  if (!SPARSE_BLOCKS.has(block.__component)) {
    return 'py-8';
  }
  if (block.__component === 'heading' && (block as { level: number }).level === 3) {
    return 'pt-6 pb-2';
  }
  return 'py-4';
}

/**
 * @component
 * @description Dispatcher that renders portfolio case content blocks with appropriate spacing
 * and error isolation. Each block is wrapped in an ErrorBoundary so a render error in one
 * block does not crash the entire page. Unknown block types return null (dev warning logged).
 * @param {BlockRendererProps} props
 * @param {ContentBlock} props.block - Block data with `__component` type identifier
 * @param {string} props.articleGradient - Gradient used by blocks that support color (metrics, cards, charts)
 * @param {string} props.articleTitle - Article title forwarded to gallery blocks for image alt text
 * @returns {JSX.Element|null} Rendered block wrapped in ErrorBoundary with spacing, or null for unknown types
 * @example
 * <BlockRenderer block={contentBlock} articleGradient="from-blue-500 to-purple-500" articleTitle="Project Name" />
 */
export function BlockRenderer({ block, articleGradient, articleTitle }: BlockRendererProps) {
  const rendered = renderBlock(block, articleGradient, articleTitle);
  if (!rendered) {
    return null;
  }
  return (
    <div className={getBlockSpacing(block)}>
      <ErrorBoundary fallback={<BlockErrorFallback />}>{rendered}</ErrorBoundary>
    </div>
  );
}
