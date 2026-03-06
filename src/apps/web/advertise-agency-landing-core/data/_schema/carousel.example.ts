import type { CarouselSlide } from '@/types/carousel';

// image: path to slide image relative to /public; leave empty string to use gradient fallback
export default [
  {
    id: 1,
    image: '/images/carousel/slide-1.jpg',
    alt: 'Alt text for the slide image',
    gradient: 'from-orange-600 via-rose-500 to-pink-600',
    title: 'Slide heading',
    subtitle: 'Slide subheading or description',
  },
] satisfies CarouselSlide[];
