import { cn } from '@/lib/utils';
import type { ImageBlock as ImageBlockData } from '@/types/portfolio/blocks';

interface ImageBlockProps {
  block: ImageBlockData;
}

const SIZE_CLASS = {
  small: 'max-w-md',
  medium: 'max-w-2xl',
  full: 'max-w-5xl',
} as const;

export function ImageBlock({ block }: ImageBlockProps) {
  const sizeClass = SIZE_CLASS[block.size ?? 'medium'];

  return (
    <figure className={cn('mx-auto', sizeClass)}>
      <img src={block.src} alt={block.alt} className="w-full rounded-xl object-cover shadow-md" />
      {block.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
