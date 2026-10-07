// About owns its image list and per-instance feature configuration.
import data from '@/data/content/about-carousel.json';
import { carouselContentSchema } from '@/validation/image-carousel';
import { parseContent } from '@/validation/parse-content';

export const aboutCarousel = parseContent(
  carouselContentSchema, data, 'data/content/about-carousel.json',
);
