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
  caseGradient: string;
  caseTitle: string;
}

/**
 * @component
 * @description Dispatcher that renders portfolio case content blocks with appropriate spacing and error isolation.
 *
 * Each block is wrapped in an ErrorBoundary so rendering errors in one block don't crash the entire page.
 * Unknown block types return null (dev warning in DEV mode).
 *
 * @param {BlockRendererProps} props
 * @param {ContentBlock} props.block - Block data with __component type identifier
 * @param {string} props.caseGradient - Gradient for blocks that use color (e.g., metrics, cards, charts)
 * @param {string} props.caseTitle - Case title for gallery alt text
 * @returns {JSX.Element|null} Rendered block wrapped in ErrorBoundary with spacing, or null for unknown types
 * @example
 * <BlockRenderer block={contentBlock} caseGradient="from-blue-500 to-purple-500" caseTitle="Project Name" />
 */
const SPARSE_BLOCKS = new Set(['divider', 'heading']);

function renderBlock(
  block: ContentBlock,
  caseGradient: string,
  caseTitle: string
): React.ReactNode {
  switch (block.__component) {
    case 'heading':
      return <HeadingBlock block={block} />;
    case 'paragraph':
      return <ParagraphBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'gallery':
      return <GalleryBlock block={block} caseTitle={caseTitle} />;
    case 'blockquote':
      return <BlockquoteBlock block={block} />;
    case 'metrics':
      return <MetricsBlock block={block} caseGradient={caseGradient} />;
    case 'cards':
      return <CardsBlock block={block} caseGradient={caseGradient} />;
    case 'table':
      return <TableBlock block={block} />;
    case 'chart':
      return <ChartBlock block={block} caseGradient={caseGradient} />;
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

export function BlockRenderer({ block, caseGradient, caseTitle }: BlockRendererProps) {
  const rendered = renderBlock(block, caseGradient, caseTitle);
  if (!rendered) {
    return null;
  }
  const spacing = SPARSE_BLOCKS.has(block.__component)
    ? block.__component === 'heading' && (block as { level: number }).level === 3
      ? 'pt-6 pb-2'
      : 'py-4'
    : 'py-8';
  return (
    <div className={spacing}>
      <ErrorBoundary fallback={<BlockErrorFallback />}>{rendered}</ErrorBoundary>
    </div>
  );
}
