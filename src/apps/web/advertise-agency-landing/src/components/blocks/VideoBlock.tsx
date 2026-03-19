import { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/libs/utils';
import type { VideoBlock as VideoBlockData } from '@/types/blocks';

interface VideoBlockProps {
  block: VideoBlockData;
}

/**
 * @component
 * @description Responsive video player supporting YouTube, Rutube embeds and local video files with optional caption.
 * YouTube and Rutube videos show a facade thumbnail with a branded play button until the user clicks,
 * deferring iframe load to avoid unnecessary network overhead.
 * @param {VideoBlockProps} props
 * @param {VideoBlockData} props.block - Video block with URL and optional caption/aspect ratio
 * @returns {JSX.Element} Figure element with video or iframe
 * @example
 * <VideoBlock block={{ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", caption: "Video" }} />
 */

type VideoKind = 'youtube' | 'rutube' | 'local' | 'unknown';

interface ParsedVideo {
  kind: VideoKind;
  id: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}

function parseVideo(url: string): ParsedVideo {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      kind: 'youtube',
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  const rtMatch = url.match(/rutube\.ru\/video\/([A-Za-z0-9]+)/);
  if (rtMatch) {
    const id = rtMatch[1];
    return {
      kind: 'rutube',
      id,
      embedUrl: `https://rutube.ru/play/embed/${id}?autoplay=1`,
      // Rutube provides a direct thumbnail image at this path
      thumbnailUrl: `https://rutube.ru/api/video/${id}/thumbnail/`,
    };
  }

  if (/\.(mp4|webm|ogg)$/i.test(url)) {
    return { kind: 'local', id: null, embedUrl: null, thumbnailUrl: null };
  }

  return { kind: 'unknown', id: null, embedUrl: null, thumbnailUrl: null };
}

interface VideoFacadeButtonProps {
  thumbnailUrl: string | null;
  caption: string | undefined;
  onPlay: () => void;
}

function VideoFacadeButton({ thumbnailUrl, caption, onPlay }: VideoFacadeButtonProps) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={caption ? `Воспроизвести: ${caption}` : 'Воспроизвести видео'}
      className="group absolute inset-0 h-full w-full cursor-pointer overflow-hidden"
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={caption ?? 'Превью видео'}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      )}
      <div
        className={cn(
          'absolute inset-0 bg-black/30',
          'transition-colors duration-300 group-hover:bg-black/45'
        )}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg',
            'transition-transform duration-300 group-hover:scale-110'
          )}
        >
          <Play size={24} fill="white" className="ml-1 text-white" />
        </div>
      </div>
    </button>
  );
}

export function VideoBlock({ block }: VideoBlockProps) {
  const { url, caption, aspectRatio = '16/9' } = block;
  const [playing, setPlaying] = useState(false);
  const video = useMemo(() => parseVideo(url), [url]);

  const [w, h] = aspectRatio.split('/').map(Number);
  const paddingTop = `${((h / w) * 100).toFixed(4)}%`;

  const showFacade = !playing && (video.kind === 'youtube' || video.kind === 'rutube');

  return (
    <figure className="mx-auto max-w-4xl">
      <div className="relative w-full overflow-hidden rounded-xl bg-muted shadow-md">
        <div style={{ paddingTop }} />

        {video.kind === 'local' || video.kind === 'unknown' ? (
          <video src={url} controls className="absolute inset-0 h-full w-full object-cover" />
        ) : showFacade ? (
          <VideoFacadeButton
            thumbnailUrl={video.thumbnailUrl}
            caption={caption}
            onPlay={() => setPlaying(true)}
          />
        ) : (
          <iframe
            src={video.embedUrl!}
            title={caption ?? 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
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
