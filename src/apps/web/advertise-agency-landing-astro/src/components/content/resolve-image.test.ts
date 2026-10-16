// @vitest-environment node
// Astro performs encoding; this boundary owns lookup, limits and metadata.
import { beforeEach, expect, it, vi } from 'vitest';
import { getImage } from 'astro:assets';
import { getContentImageMetadata, resolveContentImage } from './resolve-image';

vi.mock('astro:assets', () => ({
  getImage: vi.fn().mockResolvedValue({ src: '/optimized.webp' }),
}));

// Supply one large asset to test the cap independently of editorial sizes.
vi.mock('/src/assets/services/vyveski-demo.png', () => ({
  default: {
    src: '/fixture-large.png',
    width: 2400,
    height: 1600,
    format: 'png',
  },
}));

beforeEach(() => {
  vi.mocked(getImage)
    .mockReset()
    .mockResolvedValue({
      src: '/optimized.webp',
      options: { src: '/fixture.webp' },
      attributes: {},
      rawOptions: { src: '/fixture.webp' },
      srcSet: { values: [], attribute: '' },
    });
});

it(
  'preserves public and remote media a' + 'nd rejects missing bundled assets',
  async () => {
    for (const src of ['/image.png', 'https://example.test/a.png']) {
      const image = { src, alt: 'Fixture', width: 100, height: 50 };
      expect(await resolveContentImage(image)).toBe(image);
      expect(getContentImageMetadata(src)).toBeUndefined();
    }
    expect(getImage).not.toHaveBeenCalled();
    expect(() => getContentImageMetadata('/src/assets/missing.png')).toThrow(
      'Content image not found',
    );
    await expect(
      resolveContentImage({
        src: '/src/assets/missing.png',
        alt: 'Missing',
        width: 1,
        height: 1,
      }),
    ).rejects.toThrow('not found');
    expect(getImage).not.toHaveBeenCalled();
  },
);

it('caps width and preserves editorial image metadata', async () => {
  const src = '/src/assets/introduction/storefront-sign.webp';
  const original = getContentImageMetadata(src)!;
  expect(original.width).toBeGreaterThan(0);
  for (const width of [50, 5000]) {
    const image = {
      src,
      alt: 'Fixture',
      width,
      height: 100,
      caption: 'Caption',
      kind: 'demo' as const,
      cropGuidance: 'Keep the sign visible',
      focalPoint: { x: 25, y: 40 },
      mobileFocalPoint: { x: 60, y: 50 },
    };
    const before = structuredClone(image);
    expect(await resolveContentImage(image)).toEqual({
      ...image,
      src: '/optimized.webp',
    });
    expect(getImage).toHaveBeenLastCalledWith({
      src: original,
      width: Math.min(original.width, width, 1440),
      format: 'webp',
    });
    expect(image).toEqual(before);
  }
});

it('returns stable bundled metadata from the Astro asset pipeline', () => {
  const src = '/src/assets/introduction/storefront-sign.webp';
  const metadata = getContentImageMetadata(src)!;
  expect(metadata).toMatchObject({
    width: 1200,
    height: 900,
    format: 'webp',
  });
  expect(metadata.src).toEqual(expect.any(String));
  expect(getContentImageMetadata(src)).toBe(metadata);
  expect(getImage).not.toHaveBeenCalled();
});

it('caps a large bundled image at 1440px', async () => {
  const src = '/src/assets/services/vyveski-demo.png';
  const original = getContentImageMetadata(src)!;
  expect(original.width).toBeGreaterThan(1440);
  const image = { src, alt: 'Fixture', width: 5000, height: 3000 };
  expect(await resolveContentImage(image)).toEqual({
    ...image,
    src: '/optimized.webp',
  });
  expect(getImage).toHaveBeenCalledWith({
    src: original,
    width: 1440,
    format: 'webp',
  });
});

it('preserves image optimization failures for the build caller', async () => {
  const failure = new Error('Fixture encoding failure');
  vi.mocked(getImage).mockRejectedValueOnce(failure);
  await expect(
    resolveContentImage({
      src: '/src/assets/introduction/storefront-sign.webp',
      alt: 'Fixture',
      width: 600,
      height: 450,
    }),
  ).rejects.toBe(failure);
});
