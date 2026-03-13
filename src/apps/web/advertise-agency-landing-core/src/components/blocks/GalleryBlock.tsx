import { ImageGallery } from '@/components/ui/imageGallery';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';
import { imageGalleryContent } from '@/types/portfolio/imageGallery';
import type { GalleryBlock as GalleryBlockData } from '@/types/portfolio/blocks';

interface GalleryBlockProps {
  block: GalleryBlockData;
  caseTitle: string;
}

export function GalleryBlock({ block, caseTitle }: GalleryBlockProps) {
  const { photoAlt } = portfolioCaseContent;
  const { prevLabel, nextLabel, counter, closeLabel } = imageGalleryContent;

  return (
    <div className="mx-auto max-w-4xl">
      <ImageGallery
        images={block.images}
        altPrefix={photoAlt.replace('{title}', caseTitle)}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        closeLabel={closeLabel}
        counterTemplate={counter}
      />
    </div>
  );
}
