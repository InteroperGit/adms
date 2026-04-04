import { ImageGallery } from '@/components/ui/imageGallery';
import { imageGalleryContent } from '@/types/shared/imageGallery';
import type { GalleryBlock as GalleryBlockData } from '@/types/blocks';
import { interpolate } from '@/libs/utils';

interface GalleryBlockProps {
  block: GalleryBlockData;
  articleTitle: string;
}

/**
 * @component
 * @description Renders image gallery with full lightbox experience
 * @param {GalleryBlockProps} props
 * @param {GalleryBlockData} props.block - Gallery block with images array
 * @param {string} props.articleTitle - Case title for image alt text
 * @returns {JSX.Element} ImageGallery component
 * @example
 * <GalleryBlock block={galleryData} articleTitle="Project Name" />
 */
export function GalleryBlock({ block, articleTitle }: GalleryBlockProps) {
  const { photoAltTemplate, prevLabel, nextLabel, counter, closeLabel } = imageGalleryContent;

  return (
    <div className="mx-auto max-w-4xl">
      <ImageGallery
        images={block.images}
        altPrefix={interpolate(photoAltTemplate, { title: articleTitle })}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        closeLabel={closeLabel}
        counterTemplate={counter}
      />
    </div>
  );
}
