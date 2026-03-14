import { cn } from '@/lib/utils';
import type { ParagraphBlock as ParagraphBlockData } from '@/types/portfolio/blocks';

interface ParagraphBlockProps {
  block: ParagraphBlockData;
}

/**
 * @component
 * @description Paragraph text block with optional alignment and support for inline HTML
 * @param {ParagraphBlockProps} props
 * @param {ParagraphBlockData} props.block - Paragraph with text and optional align
 * @returns {JSX.Element} Paragraph element with dangerouslySetInnerHTML
 * @example
 * <ParagraphBlock block={{ text: "Hello <strong>world</strong>", align: "center" }} />
 */
export function ParagraphBlock({ block }: ParagraphBlockProps) {
  return (
    <p
      className={cn(
        'mx-auto max-w-3xl leading-relaxed text-muted-foreground',
        block.align === 'center' ? 'text-center' : 'text-left'
      )}
      dangerouslySetInnerHTML={{ __html: block.text }}
    />
  );
}
