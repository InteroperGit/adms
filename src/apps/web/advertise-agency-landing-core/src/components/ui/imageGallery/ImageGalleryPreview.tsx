import { cn } from '@/lib/utils';

interface ImageGalleryPreviewProps {
  src: string;
  alt: string;
  description?: string;
  onClick?: () => void;
}

export function ImageGalleryPreview({ src, alt, description, onClick }: ImageGalleryPreviewProps) {
  return (
    <div>
      <div
        className="relative cursor-pointer overflow-hidden rounded-2xl bg-muted"
        onClick={onClick}
      >
        <img src={src} alt={alt} className="max-h-[260px] w-full object-cover sm:max-h-[560px]" />
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
    </div>
  );
}
