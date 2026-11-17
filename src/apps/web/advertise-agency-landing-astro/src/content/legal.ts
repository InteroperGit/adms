// src/content/legal.ts
import privacyData from "@/data/content/site/pages/legal/privacyPolicy.json";
import termsData from "@/data/content/site/pages/legal/termsOfUse.json";
import type { LegalDocument } from "@/types";
import { parseContent } from "@/validation/parse-content";
import { legalDocumentSchema } from "@/validation/legal";

export const privacyPolicy: LegalDocument = parseContent(
  legalDocumentSchema,
  privacyData,
  "data/content/site/pages/legal/privacyPolicy.json",
);
export const termsOfUse: LegalDocument = parseContent(
  legalDocumentSchema,
  termsData,
  "data/content/site/pages/legal/termsOfUse.json",
);
