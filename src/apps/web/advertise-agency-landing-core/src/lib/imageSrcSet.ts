/**
 * Returns the `srcset` attribute value for a given original image path.
 * Assumes the imageResizePlugin has generated WebP variants in /images/_optimized/.
 *
 * @param src - Original image path under /images/, e.g. /images/portfolio/hero.jpg
 * @param widths - Breakpoint widths; defaults to [320, 640, 960, 1280, 1920]
 * @returns Comma-separated srcset string, or '' if src doesn't start with /images/
 */
export function resolveImageSrcSet(
  src: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  const prefix = '/images/';
  if (!src.startsWith(prefix)) {
    return '';
  }
  const relPath = src.slice(prefix.length);
  const dotIdx = relPath.lastIndexOf('.');
  const relNoExt = dotIdx !== -1 ? relPath.slice(0, dotIdx) : relPath;
  return widths.map((w) => `/images/_optimized/${relNoExt}-${w}w.webp ${w}w`).join(', ');
}
