import { z } from 'zod';

export const LabeledLinkSchema = z.object({ label: z.string(), href: z.string() });
export type LabeledLink = z.infer<typeof LabeledLinkSchema>;
