import raw from '@data/sections/callToAction.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { LabeledLink } from '@/types/shared/labeledLink';

export const CallToActionContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  cta: z.array(LabeledLinkSchema),
});

export type CallToActionContent = z.infer<typeof CallToActionContentSchema>;

export const callToActionContent = CallToActionContentSchema.parse(raw);
