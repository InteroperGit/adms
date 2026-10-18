// Each discriminant must keep its own payload contract.
import type * as Domain from '@/types/content-blocks';

export const HeadingBlock = {
  type: 'heading',
  id: 'intro',
  level: 2,
  text: 'Fixture heading',
} satisfies Domain.HeadingBlock;
export const ParagraphBlock = {
  type: 'paragraph',
  paragraphs: ['Read https://example.test/guide and javascript:alert(1).'],
} satisfies Domain.ParagraphBlock;
export const OrderedListBlock = {
  type: 'ordered-list',
  items: ['First', 'Second'],
} satisfies Domain.OrderedListBlock;
export const UnorderedListBlock = {
  type: 'unordered-list',
  items: ['Alpha', 'Beta'],
} satisfies Domain.UnorderedListBlock;
export const TableBlock = {
  type: 'table',
  caption: 'Fixture comparison',
  columns: [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'amount',
      label: 'Amount',
    },
  ],
  rows: [
    {
      cells: ['A', '12'],
    },
    {
      cells: ['B', '24'],
    },
  ],
} satisfies Domain.TableBlock;
export const ChartBlock = {
  type: 'chart',
  id: 'chart',
  chartType: 'bar',
  unit: '%',
  caption: 'Fixture chart',
  series: [
    {
      name: 'Reach',
      points: [
        {
          label: 'Jan',
          value: 12,
        },
        {
          label: 'Feb',
          value: 24,
        },
      ],
    },
  ],
} satisfies Domain.ChartBlock;
export const ImageBlock = {
  type: 'image',
  id: 'image',
  src: '/media/fixture.jpg',
  alt: 'Fixture image',
  width: 800,
  height: 450,
  caption: 'Fixture image caption',
  focalPoint: {
    x: 20,
    y: 30,
  },
  mobileFocalPoint: {
    x: 40,
    y: 50,
  },
} satisfies Domain.ImageBlock;
export const ImageGalleryBlock = {
  type: 'image-gallery',
  id: 'gallery',
  caption: 'Fixture gallery',
  images: [
    {
      src: '/media/one.jpg',
      alt: 'One',
      width: 400,
      height: 300,
    },
    {
      src: '/media/two.jpg',
      alt: 'Two',
      width: 400,
      height: 300,
    },
  ],
} satisfies Domain.ImageGalleryBlock;
export const VideoBlock = {
  type: 'video',
  id: 'video',
  src: '/media/fixture.mp4',
  alt: 'Fixture video',
  width: 16,
  height: 9,
  caption: 'Fixture video caption',
  transcript: 'Fixture transcript',
} satisfies Domain.VideoBlock;
export const OrderFormBlock = {
  type: 'order-form',
  id: 'form',
  formId: 'general-inquiry',
  context: 'project',
} satisfies Domain.OrderFormBlock;
export const QuoteBlock = {
  type: 'quote',
  id: 'quote',
  text: 'A fixture quote.',
  author: 'Author',
  source: 'Source',
} satisfies Domain.QuoteBlock;
export const FootnoteBlock = {
  type: 'footnote',
  id: 'note',
  text: 'Fixture note.',
  reference: '1',
  targetId: 'intro',
} satisfies Domain.FootnoteBlock;

export const all = [
  HeadingBlock,
  ParagraphBlock,
  OrderedListBlock,
  UnorderedListBlock,
  TableBlock,
  ChartBlock,
  ImageBlock,
  ImageGalleryBlock,
  VideoBlock,
  OrderFormBlock,
  QuoteBlock,
  FootnoteBlock,
] satisfies Domain.ContentBlock[];
export const level = 6 satisfies Domain.HeadingLevel;
export const status = 'demo' satisfies Domain.ContentBlockStatus;
export const meta = { status } satisfies Domain.ContentBlockMeta;
export const provenance = {
  source: 'Fixture editor',
} satisfies Domain.ContentBlockProvenance;
export const image = ImageBlock satisfies Domain.ContentImage;

// @ts-expect-error Heading levels stop at six.
export const invalid = 7 satisfies Domain.HeadingLevel;
const missingLevel = {
  type: 'heading' as const,
  text: 'Heading',
};
// @ts-expect-error A heading cannot omit its level.
export const missing = missingLevel satisfies Domain.ContentBlock;
