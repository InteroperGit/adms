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

interface BlockRendererProps {
  block: ContentBlock;
  caseGradient: string;
  caseTitle: string;
}

const SPARSE_BLOCKS = new Set(['divider', 'heading']);

export function BlockRenderer({ block, caseGradient, caseTitle }: BlockRendererProps) {
  const spacing = SPARSE_BLOCKS.has(block.__component) ? 'py-4' : 'py-8';

  const rendered = (() => {
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
      default: {
        if (import.meta.env.DEV) {
          console.warn('[BlockRenderer] Unknown block type:', (block as ContentBlock).__component);
        }
        return null;
      }
    }
  })();

  if (rendered === null) {
    return null;
  }

  return <div className={spacing}>{rendered}</div>;
}
