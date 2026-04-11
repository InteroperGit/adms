import { cn } from '@/libs/utils';
import { OptimizedImage } from '@/components/shared/images/OptimizedImage';

interface ImageGalleryPreviewProps {
  src: string;
  alt: string;
  description?: string;
}

/**
 * @component
 * @description Main image preview with optional hover-revealed description and mobile-visible text
 * @param {ImageGalleryPreviewProps} props
 * @param {string} props.src - Image source
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} [props.description] - Optional description shown on hover (desktop) or below (mobile)
 * @returns {JSX.Element} Rounded preview container with OptimizedImage
 * @example
 * <ImageGalleryPreview src="/images/photo.jpg" alt="Photo" description="Photo description" />
 */
export function ImageGalleryPreview({ src, alt, description }: ImageGalleryPreviewProps) {
  return (
    <>
      <div className="relative cursor-pointer overflow-hidden rounded-2xl bg-muted">
        <OptimizedImage
          src={src}
          alt={alt}
          sizes="(max-width: 768px) 100vw, 800px"
          className="max-h-[260px] w-full sm:max-h-[560px]"
          imgClassName="object-cover"
        />
        {description && (
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 hidden p-4',
              'bg-gradient-to-t from-black/70 to-transparent',
              'translate-y-1 opacity-0 transition-all duration-200',
              'group-hover:translate-y-0 group-hover:opacity-100 sm:block'
            )}
          >
            <p className="line-clamp-3 text-sm text-white">{description}</p>
          </div>
        )}
      </div>
      {/* Mobile-only description below image */}
      {description && (
        <p className="mt-3 border-l-2 border-primary pl-3 text-sm text-muted-foreground sm:hidden">
          {description}
        </p>
      )}
    </>
  );
}
