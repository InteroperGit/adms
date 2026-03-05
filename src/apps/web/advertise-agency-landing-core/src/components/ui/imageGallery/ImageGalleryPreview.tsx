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
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-muted"
        onClick={onClick}
      >
        <img src={src} alt={alt} className="max-h-[260px] w-full object-cover sm:max-h-[560px]" />
        {/* Desktop-only hover overlay */}
        {description && (
          <div className="absolute inset-0 hidden items-end bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
            <p className="line-clamp-3 p-4 text-sm text-white">{description}</p>
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
