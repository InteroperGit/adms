import { z } from "astro/zod";

export const legalDocumentSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    effectiveDate: z.string(),
    sections: z.array(
      z
        .object({
          heading: z.string(),
          content: z.string(),
          list: z.array(z.string()).optional(),
        })
        .strict(),
    ),
  })
  .strict();
