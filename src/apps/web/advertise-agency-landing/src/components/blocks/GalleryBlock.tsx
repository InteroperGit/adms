import { ImageGallery } from '@/components/ui/imageGallery';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';
import { imageGalleryContent } from '@/types/shared/imageGallery';
import type { GalleryBlock as GalleryBlockData } from '@/types/blocks';
import { interpolate } from '@/libs/utils';

interface GalleryBlockProps {
  block: GalleryBlockData;
  caseTitle: string;
}

/**
 * @component
 * @description Renders image gallery with full lightbox experience
 * @param {GalleryBlockProps} props
 * @param {GalleryBlockData} props.block - Gallery block with images array
 * @param {string} props.caseTitle - Case title for image alt text
 * @returns {JSX.Element} ImageGallery component
 * @example
 * <GalleryBlock block={galleryData} caseTitle="Project Name" />
 */
export function GalleryBlock({ block, caseTitle }: GalleryBlockProps) {
  const { photoAlt } = portfolioCaseContent;
  const { prevLabel, nextLabel, counter, closeLabel } = imageGalleryContent;

  return (
    <div className="mx-auto max-w-4xl">
      <ImageGallery
        images={block.images}
        altPrefix={interpolate(photoAlt, { title: caseTitle })}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        closeLabel={closeLabel}
        counterTemplate={counter}
      />
    </div>
  );
}
