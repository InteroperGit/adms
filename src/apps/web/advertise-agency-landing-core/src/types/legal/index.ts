import { z } from 'zod';
import rawPrivacyPolicy from '@data/legal/privacyPolicy.json';
import rawUserAgreement from '@data/legal/userAgreement.json';
import rawConsent from '@data/legal/consent.json';

const LegalContactItemSchema = z.object({
  label: z.string(),
  field: z.string(),
});

const LegalBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('p'), text: z.string() }),
  z.object({ type: z.literal('ul'), items: z.array(z.string()) }),
  z.object({ type: z.literal('ol'), items: z.array(z.string()) }),
  z.object({
    type: z.literal('dl'),
    items: z.array(z.object({ term: z.string(), def: z.string() })),
  }),
  z.object({ type: z.literal('contact'), items: z.array(LegalContactItemSchema) }),
]);

const LegalSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  blocks: z.array(LegalBlockSchema),
});

export const LegalContentSchema = z.object({
  title: z.string(),
  sections: z.array(LegalSectionSchema),
});

export type LegalContactItem = z.infer<typeof LegalContactItemSchema>;
export type LegalBlock = z.infer<typeof LegalBlockSchema>;
export type LegalSection = z.infer<typeof LegalSectionSchema>;
export type LegalContent = z.infer<typeof LegalContentSchema>;

export const privacyPolicyContent = LegalContentSchema.parse(rawPrivacyPolicy);
export const userAgreementContent = LegalContentSchema.parse(rawUserAgreement);
export const consentContent = LegalContentSchema.parse(rawConsent);
