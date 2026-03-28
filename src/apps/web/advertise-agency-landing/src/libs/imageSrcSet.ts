/**
 * @description Builds a responsive image srcset string for use in <img> elements.
 * Assumes the imageResizePlugin has pre-generated WebP variants with standard width breakpoints.
 * Returns an empty string if the source path doesn't start with /images/ (invalid paths are silently
 * ignored, allowing fallback to single image loading).
 *
 * @param {string} src - Original image path, must start with /images/ (e.g., /images/portfolio/hero.jpg)
 * @param {number[]} [widths=[320, 640, 960, 1280, 1920]] - Breakpoint widths in pixels for responsive variants
 * @returns {string} Comma-separated srcset string (e.g., "/images/_optimized/portfolio/hero-320w.webp 320w, ...") or empty string if invalid
 *
 * @example
 * const srcset = resolveImageSrcSet('/images/portfolio/case-study.jpg');
 * // Returns: "/images/_optimized/portfolio/case-study-320w.webp 320w, /images/_optimized/portfolio/case-study-640w.webp 640w, ..."
 *
 * @example
 * // Custom widths for small images
 * const srcset = resolveImageSrcSet('/images/icons/logo.png', [48, 96, 192]);
 * // Returns: "/images/_optimized/icons/logo-48w.webp 48w, ..."
 */
export function resolveImageSrcSet(
  src: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  const prefix = '/images/';
  if (!src.startsWith(prefix)) {
    if (import.meta.env.DEV) {
      console.warn(`[imageSrcSet] unexpected path: ${src}`);
    }
    return '';
  }
  const relPath = src.slice(prefix.length);
  const dotIdx = relPath.lastIndexOf('.');
  const relNoExt = dotIdx !== -1 ? relPath.slice(0, dotIdx) : relPath;
  return widths.map((w) => `/images/_optimized/${relNoExt}-${w}w.webp ${w}w`).join(', ');
}
