import { describe, it, expect } from 'vitest';
import { resolveImageSrcSet } from './imageSrcSet';

describe('resolveImageSrcSet()', () => {
  it('should return a srcset with default widths for a valid /images/ path', () => {
    expect(resolveImageSrcSet('/images/portfolio/hero.jpg')).toBe(
      '/images/_optimized/portfolio/hero-320w.webp 320w, ' +
        '/images/_optimized/portfolio/hero-640w.webp 640w, ' +
        '/images/_optimized/portfolio/hero-960w.webp 960w, ' +
        '/images/_optimized/portfolio/hero-1280w.webp 1280w, ' +
        '/images/_optimized/portfolio/hero-1920w.webp 1920w'
    );
  });

  it('should return a srcset with custom widths', () => {
    expect(resolveImageSrcSet('/images/icons/logo.png', [48, 96, 192])).toBe(
      '/images/_optimized/icons/logo-48w.webp 48w, ' +
        '/images/_optimized/icons/logo-96w.webp 96w, ' +
        '/images/_optimized/icons/logo-192w.webp 192w'
    );
  });

  it('should return empty string for a non-/images/ path', () => {
    expect(resolveImageSrcSet('/assets/portfolio/hero.jpg')).toBe('');
    expect(resolveImageSrcSet('images/hero.jpg')).toBe('');
    expect(resolveImageSrcSet('')).toBe('');
  });

  it('should handle a file without an extension', () => {
    expect(resolveImageSrcSet('/images/portfolio/image-no-ext', [320, 640])).toBe(
      '/images/_optimized/portfolio/image-no-ext-320w.webp 320w, ' +
        '/images/_optimized/portfolio/image-no-ext-640w.webp 640w'
    );
  });

  it('should handle deeply nested paths', () => {
    expect(resolveImageSrcSet('/images/a/b/c/photo.jpeg', [320, 640])).toBe(
      '/images/_optimized/a/b/c/photo-320w.webp 320w, ' +
        '/images/_optimized/a/b/c/photo-640w.webp 640w'
    );
  });
});
