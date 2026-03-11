import raw from '@data/config/categories.json';
import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string(), // display name, matches PortfolioCase.category
  slug: z.string(), // URL segment, e.g. "branding"
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoriesSchema = z.array(CategorySchema);

export const categories = CategoriesSchema.parse(raw);
