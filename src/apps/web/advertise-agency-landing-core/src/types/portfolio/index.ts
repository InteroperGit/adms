import raw from '@data/sections/portfolio/portfolioSection.json';
import { z } from 'zod';
import { ContentBlockSchema } from './blocks';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { GalleryImage } from './blocks';
export type { LabeledLink } from '@/types/shared/labeledLink';

export const PortfolioSectionContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  allCategory: z.string(),
  detailsLabel: z.string(),
  cta: LabeledLinkSchema,
});

export type PortfolioSectionContent = z.infer<typeof PortfolioSectionContentSchema>;

export const portfolioSectionContent = PortfolioSectionContentSchema.parse(raw);

export const PortfolioCaseSchema = z.object({
  slug: z.string(),
  publishDate: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  hero: z.object({
    image: z.string().optional(),
    gradient: z.string(),
  }),
  tags: z.array(z.string()),
  meta: z.object({
    title: z.string(),
    description: z.string(),
    ogUrl: z.string().optional(),
    ogImage: z.string().optional(),
  }),
  overview: z.object({
    client: z.string(),
    year: z.string(),
    services: z.string(),
  }),
  content: z.array(ContentBlockSchema),
  images: z
    .object({
      preview: z.string().optional(),
      og: z.string().optional(),
    })
    .optional(),
});

export type PortfolioCase = z.infer<typeof PortfolioCaseSchema>;
