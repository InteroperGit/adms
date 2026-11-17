// About owns its image list and per-instance feature configuration.
import data from "@/data/content/site/sections/aboutCarousel.json";
import { carouselContentSchema } from "@/validation/imageCarousel";
import { parseContent } from "@/validation/parseContent";

export const aboutCarousel = parseContent(
  carouselContentSchema,
  data,
  "data/content/site/sections/aboutCarousel.json",
);
