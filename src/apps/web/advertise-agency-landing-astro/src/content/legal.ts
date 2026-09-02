// src/content/legal.ts
import privacyData from '@/data/content/legal/privacy-policy.json';
import termsData from '@/data/content/legal/terms-of-use.json';
import type { LegalDocument } from '@/types';

export const privacyPolicy: LegalDocument = privacyData;
export const termsOfUse: LegalDocument = termsData;