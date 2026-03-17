import { z } from 'zod';
import rawPrivacyPolicy from '@data/legal/privacyPolicy.json';
import rawUserAgreement from '@data/legal/userAgreement.json';
import rawConsent from '@data/legal/consent.json';

/**
 * @module legal/index
 * @description Legal document content types and constants for privacy policy, user agreement,
 * and consent forms. Supports structured legal blocks (paragraphs, lists, definition lists,
 * and contact information) with dynamic company field references via {company.X} tokens.
 * Exported as privacyPolicyContent, userAgreementContent, and consentContent constants.
 */

/**
 * @description Contact information line with label and company field reference
 */
const LegalContactItemSchema = z.object({
  /** Display label (e.g., "Email:") */
  label: z.string(),
  /** Key to company field from legalData.company (e.g., "email", "phone") */
  field: z.string(),
});

/**
 * @description Discriminated union of legal content blocks (paragraph, lists, contact)
 */
const LegalBlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('p'),
    /** Text content; supports {company.X} tokens and inline HTML */
    text: z.string(),
  }),
  z.object({
    type: z.literal('ul'),
    /** Unordered list items */
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal('ol'),
    /** Ordered list items */
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal('dl'),
    /** Definition list (term-definition pairs) */
    items: z.array(
      z.object({
        /** Term being defined */
        term: z.string(),
        /** Definition text */
        def: z.string(),
      })
    ),
  }),
  z.object({
    type: z.literal('contact'),
    /** Contact information lines (labels + company field references) */
    items: z.array(LegalContactItemSchema),
  }),
]);

/**
 * @description Section of legal document with title and content blocks
 */
const LegalSectionSchema = z.object({
  /** Optional unique identifier for deep linking */
  id: z.string().optional(),
  /** Section heading */
  title: z.string(),
  /** Section content blocks */
  blocks: z.array(LegalBlockSchema),
});

/**
 * @description Complete legal document (privacy policy, user agreement, consent)
 */
export const LegalContentSchema = z.object({
  /** Document title */
  title: z.string(),
  /** Document sections */
  sections: z.array(LegalSectionSchema),
});

/**
 * @description Contact item with label and company field reference
 */
export type LegalContactItem = z.infer<typeof LegalContactItemSchema>;

/**
 * @description Legal content block (p, ul, ol, dl, or contact)
 */
export type LegalBlock = z.infer<typeof LegalBlockSchema>;

/**
 * @description Section with title and content blocks
 */
export type LegalSection = z.infer<typeof LegalSectionSchema>;

/**
 * @description Complete legal document structure
 */
export type LegalContent = z.infer<typeof LegalContentSchema>;

/**
 * @description Exported privacy policy content parsed from data/legal/privacyPolicy.json
 */
export const privacyPolicyContent = LegalContentSchema.parse(rawPrivacyPolicy);

/**
 * @description Exported user agreement content parsed from data/legal/userAgreement.json
 */
export const userAgreementContent = LegalContentSchema.parse(rawUserAgreement);

/**
 * @description Exported consent form content parsed from data/legal/consent.json
 */
export const consentContent = LegalContentSchema.parse(rawConsent);
