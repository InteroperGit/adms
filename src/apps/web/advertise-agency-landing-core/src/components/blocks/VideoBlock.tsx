import type { VideoBlock as VideoBlockData } from '@/types/portfolio/blocks';

interface VideoBlockProps {
  block: VideoBlockData;
}

/**
 * @component
 * @description Responsive video player supporting YouTube, Rutube embeds and local video files with optional caption
 * @param {VideoBlockProps} props
 * @param {VideoBlockData} props.block - Video block with URL and optional caption/aspect ratio
 * @returns {JSX.Element} Figure element with video or iframe
 * @example
 * <VideoBlock block={{ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", caption: "Video" }} />
 */
function extractEmbedUrl(url: string): string | null {
  // YouTube: watch?v=ID or youtu.be/ID or shorts/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Rutube: rutube.ru/video/ID
  const rtMatch = url.match(/rutube\.ru\/video\/([A-Za-z0-9]+)/);
  if (rtMatch) {
    return `https://rutube.ru/play/embed/${rtMatch[1]}`;
  }

  return null;
}

function isLocalVideo(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

export function VideoBlock({ block }: VideoBlockProps) {
  const { url, caption, aspectRatio = '16/9' } = block;
  const embedUrl = extractEmbedUrl(url);

  const paddingTop = (() => {
    const [w, h] = aspectRatio.split('/').map(Number);
    return `${((h / w) * 100).toFixed(4)}%`;
  })();

  return (
    <figure className="mx-auto max-w-4xl">
      <div className="relative w-full overflow-hidden rounded-xl bg-muted shadow-md">
        <div style={{ paddingTop }} />
        {isLocalVideo(url) ? (
          <video src={url} controls className="absolute inset-0 h-full w-full object-cover" />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={caption ?? 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          // Fallback for unrecognised URLs
          <video src={url} controls className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
