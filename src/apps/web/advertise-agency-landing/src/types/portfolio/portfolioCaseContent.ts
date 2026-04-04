import raw from '@data/sections/portfolio/portfolioCase.json';
import { z } from 'zod';

/**
 * @module portfolio/portfolioCaseContent
 * @description Zod schema, TypeScript type, and parsed constant for UI copy used across
 * portfolio case detail pages. Source file: `data/sections/portfolio/portfolioCase.json`.
 *
 * Components that consume this module:
 * - `CaseCTA` — reads `cta` (title, subtitle, label, href)
 * - `PortfolioCasePage` — reads `backLabel`, `challengeTitle`, `solutionTitle`,
 *   `resultsTitle`, `notFound`
 */

/**
 * Zod schema for portfolio case detail page UI copy.
 *
 * All fields are required strings; the schema throws a `ZodError` at import time
 * if the JSON file is missing any field or has an unexpected type, giving an early
 * validation failure rather than a silent runtime bug.
 */
export const PortfolioCaseContentSchema = z.object({
  /** Label for the back-navigation link at the top of the case page (e.g. `"← Назад к портфолио"`). */
  backLabel: z.string(),
  /** `<h2>` heading for the challenge content block section. */
  challengeTitle: z.string(),
  /** `<h2>` heading for the solution content block section. */
  solutionTitle: z.string(),
  /** `<h2>` heading for the results content block section. */
  resultsTitle: z.string(),
  /**
   * Copy and link target for the {@link CaseCTA} section rendered at the bottom of every case page.
   * - `title` — section heading.
   * - `subtitle` — supporting text below the heading.
   * - `label` — button label.
   * - `href` — button link target (e.g. `"/#contact"`). Configurable to avoid hard-coding.
   */
  cta: z.object({ title: z.string(), subtitle: z.string(), label: z.string(), href: z.string() }),
  /** Copy for the 404 state shown when a case slug is not found. */
  notFound: z.object({ title: z.string(), back: z.string() }),
});

/** TypeScript type inferred from {@link PortfolioCaseContentSchema}. */
export type PortfolioCaseContent = z.infer<typeof PortfolioCaseContentSchema>;

/**
 * Parsed and validated portfolio case page UI content.
 *
 * Throws at module initialisation if `data/sections/portfolio/portfolioCase.json`
 * fails schema validation, surfacing config errors at build time rather than runtime.
 */
export const portfolioCaseContent = PortfolioCaseContentSchema.parse(raw);
