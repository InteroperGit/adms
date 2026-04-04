import raw from '@data/config/defaultArticleCta.json';
import { z } from 'zod';

/**
 * @module config/defaultArticleCta
 * @description Default fallback CTA data rendered at the bottom of article pages
 * when the article itself doesn't define its own `cta` object.
 */

export const DefaultArticleCtaSchema = z.object({
  /** Section heading */
  title: z.string(),
  /** Supporting text below the heading */
  subtitle: z.string(),
  /** Button label */
  label: z.string(),
  /** Button link target */
  href: z.string(),
});

export type DefaultArticleCta = z.infer<typeof DefaultArticleCtaSchema>;

/**
 * Parsed and validated default article CTA content.
 * Throws at module initialisation if `data/config/defaultArticleCta.json`
 * fails schema validation.
 */
export const defaultArticleCta = DefaultArticleCtaSchema.parse(raw);
