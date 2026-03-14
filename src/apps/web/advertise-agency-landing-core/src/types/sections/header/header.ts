import raw from '@data/sections/header.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { LabeledLink } from '@/types/shared/labeledLink';

export const HeaderContentSchema = z.object({
  lang: z.string(),
  logo: z.object({ href: z.string(), src: z.string() }),
  nav: z.array(LabeledLinkSchema),
  navCta: z.string(),
  openMenuLabel: z.string(),
  closeMenuLabel: z.string(),
});

export type HeaderContent = z.infer<typeof HeaderContentSchema>;

export const headerContent = HeaderContentSchema.parse(raw);
