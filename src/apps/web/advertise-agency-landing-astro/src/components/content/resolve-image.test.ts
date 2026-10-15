// @vitest-environment node
// Astro performs encoding; this boundary owns lookup, limits and metadata.
import { expect, it, vi } from 'vitest';
import { getImage } from 'astro:assets';
import { getContentImageMetadata, resolveContentImage } from
  './resolve-image';

vi.mock('astro:assets', () => ({
  getImage: vi.fn().mockResolvedValue({ src: '/optimized.webp' }),
}));

it('preserves public and remote media and rejects missing bundled assets',
  async () => {
    for (const src of ['/image.png', 'https://example.test/a.png']) {
      const image = { src, alt: 'Fixture', width: 100, height: 50 };
      expect(await resolveContentImage(image)).toBe(image);
      expect(getContentImageMetadata(src)).toBeUndefined();
    }
    expect(() => getContentImageMetadata('/src/assets/missing.png'))
      .toThrow('Content image not found');
    await expect(resolveContentImage({ src: '/src/assets/missing.png',
      alt: 'Missing', width: 1, height: 1 })).rejects.toThrow('not found');
  });

it('caps width and preserves editorial image metadata', async () => {
  const src = '/src/assets/introduction/storefront-sign.webp';
  const original = getContentImageMetadata(src)!;
  expect(original.width).toBeGreaterThan(0);
  for (const width of [50, 5000]) {
    const image = { src, alt: 'Fixture', width, height: 100,
      caption: 'Caption' };
    expect(await resolveContentImage(image)).toEqual({
      ...image, src: '/optimized.webp',
    });
    expect(getImage).toHaveBeenLastCalledWith({
      src: original, width: Math.min(original.width, width, 1440),
      format: 'webp',
    });
  }
});
