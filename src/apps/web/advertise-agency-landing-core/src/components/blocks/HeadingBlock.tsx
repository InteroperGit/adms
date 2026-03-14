import { cn } from '@/libs/utils';
import type { HeadingBlock as HeadingBlockData } from '@/types/portfolio/blocks';

interface HeadingBlockProps {
  block: HeadingBlockData;
}

/**
 * @component
 * @description Semantic heading element (h2, h3, h4) with size-appropriate styling
 * @param {HeadingBlockProps} props
 * @param {HeadingBlockData} props.block - Heading with level (2-4) and text
 * @returns {JSX.Element} Heading tag with font-heading family and responsive size
 * @example
 * <HeadingBlock block={{ level: 2, text: "Section Title" }} />
 */
const STYLES = {
  2: 'text-2xl md:text-3xl font-bold text-foreground',
  3: 'text-xl md:text-2xl font-semibold text-foreground',
  4: 'text-lg md:text-xl font-semibold text-foreground',
} as const;

export function HeadingBlock({ block }: HeadingBlockProps) {
  const Tag = `h${block.level}` as 'h2' | 'h3' | 'h4';

  return (
    <Tag className={cn('mx-auto max-w-3xl font-heading', STYLES[block.level])}>{block.text}</Tag>
  );
}
