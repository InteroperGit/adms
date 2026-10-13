// Resolve bundled content images to emitted URLs for figures and galleries.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { ContentImage } from '@/types/content-blocks';

const originals = import.meta.glob<ImageMetadata>(
  '/src/assets/**/*.{avif,jpeg,jpg,png,webp}',
  { eager: true, import: 'default' },
);

/** Share asset lookup with responsive media and full-size gallery links. */
export function getContentImageMetadata(src: string) {
  const original = originals[src];
  if (src.startsWith('/src/assets/') && !original) {
    throw new Error(`Content image not found: ${src}`);
  }
  return original;
}

/** Remote and public images retain their URL; missing bundled media fails. */
export async function resolveContentImage(image: ContentImage) {
  if (!image.src.startsWith('/src/assets/')) return image;
  const original = getContentImageMetadata(image.src);
  if (!original) throw new Error(`Content image not found: ${image.src}`);
  const optimized = await getImage({
    src: original,
    width: Math.min(original.width, image.width, 1440),
    format: 'webp',
  });
  return { ...image, src: optimized.src };
}
