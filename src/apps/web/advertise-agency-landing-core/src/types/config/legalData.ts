import raw from '@data/config/legal.json';
import { z } from 'zod';

const DocumentVersionSchema = z.object({
  version: z.string(),
  effectiveDate: z.string(),
});

export type DocumentVersion = z.infer<typeof DocumentVersionSchema>;

export const LegalDataSchema = z.object({
  company: z.object({
    name: z.string(),
    inn: z.string(),
    ogrn: z.string(),
    legalAddress: z.string(),
    siteUrl: z.string(),
    email: z.string(),
    phone: z.string(),
    responsible: z.string(),
  }),
  documents: z.object({
    privacyPolicy: DocumentVersionSchema,
    consent: DocumentVersionSchema,
    userAgreement: DocumentVersionSchema,
  }),
});

export type LegalData = z.infer<typeof LegalDataSchema>;

export const legalData = LegalDataSchema.parse(raw);
