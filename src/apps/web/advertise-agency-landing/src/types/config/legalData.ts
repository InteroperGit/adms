import raw from '@data/config/legal.json';
import { z } from 'zod';

/**
 * @module config/legalData
 * @description Legal company information (registration, contact) and legal document versions.
 */

/**
 * @description Version information for legal documents
 */
const DocumentVersionSchema = z.object({
  /** Version number or identifier (e.g., "1.0") */
  version: z.string(),
  /** Date when this version became effective (ISO date format) */
  effectiveDate: z.string(),
});

/**
 * @description Document version details
 */
export type DocumentVersion = z.infer<typeof DocumentVersionSchema>;

/**
 * @description Legal and company information used in legal documents and footer
 */
export const LegalDataSchema = z.object({
  /** Company registration and contact details */
  company: z.object({
    /** Legal company name */
    name: z.string(),
    /** Russian tax ID (ИНН) */
    inn: z.string(),
    /** Russian business registration number (ОГРН) */
    ogrn: z.string(),
    /** Official legal address */
    legalAddress: z.string(),
    /** Main website URL */
    siteUrl: z.string(),
    /** Contact email address */
    email: z.string(),
    /** Contact phone number */
    phone: z.string(),
    /** Name/title of responsible person */
    responsible: z.string(),
  }),
  /** Version information for published legal documents */
  documents: z.object({
    /** Privacy policy version and effective date */
    privacyPolicy: DocumentVersionSchema,
    /** Consent form version and effective date */
    consent: DocumentVersionSchema,
    /** User agreement version and effective date */
    userAgreement: DocumentVersionSchema,
  }),
});

/**
 * @description Parsed and validated legal configuration
 */
export type LegalData = z.infer<typeof LegalDataSchema>;

/**
 * @description Exported legal data constant parsed from data/config/legal.json
 */
export const legalData = LegalDataSchema.parse(raw);
