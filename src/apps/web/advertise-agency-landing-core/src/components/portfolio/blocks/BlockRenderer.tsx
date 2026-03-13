import type React from 'react';
import type { ContentBlock } from '@/types/portfolio/blocks';
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
  const spacing = SPARSE_BLOCKS.has(block.__component) ? 'py-4' : 'py-8';
  return <div className={spacing}>{rendered}</div>;
}
