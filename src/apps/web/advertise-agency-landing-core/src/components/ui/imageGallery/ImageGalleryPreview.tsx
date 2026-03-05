interface ImageGalleryPreviewProps {
  src: string;
  alt: string;
  description?: string;
}

export function ImageGalleryPreview({ src, alt, description }: ImageGalleryPreviewProps) {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-muted">
        <img src={src} alt={alt} className="max-h-[560px] w-full object-cover" />
      </div>
      {description && (
        <p className="mt-3 border-l-2 border-primary pl-3 text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
