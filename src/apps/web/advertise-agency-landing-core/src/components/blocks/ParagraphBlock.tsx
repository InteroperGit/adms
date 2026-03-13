import { cn } from '@/lib/utils';
import type { ParagraphBlock as ParagraphBlockData } from '@/types/portfolio/blocks';

interface ParagraphBlockProps {
  block: ParagraphBlockData;
}

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
