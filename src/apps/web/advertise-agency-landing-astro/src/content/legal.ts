// src/content/legal.ts
import privacyData from "@/data/content/site/pages/legal/privacyPolicy.json";
import termsData from "@/data/content/site/pages/legal/termsOfUse.json";
import type { LegalDocument } from "@/types";

export const privacyPolicy: LegalDocument = privacyData;
export const termsOfUse: LegalDocument = termsData;
