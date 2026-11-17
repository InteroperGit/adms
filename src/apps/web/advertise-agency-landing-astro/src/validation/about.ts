import { z } from "astro/zod";

export const aboutSchema = z
  .object({
    description1: z.string(),
    description2: z.string(),
    stats: z.array(
      z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .strict(),
    ),
    icon: z.string(),
  })
  .strict();
