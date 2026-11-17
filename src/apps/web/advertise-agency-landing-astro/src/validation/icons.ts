import { z } from "astro/zod";

export const iconsSchema = z
  .object({
    phone: z.string(),
    email: z.string(),
    address: z.string(),
    clock: z.string(),
    arrow: z.string(),
    butterfly: z.string(),
    sparkles: z.string(),
    mail: z.string(),
    menu: z.object({ open: z.string(), close: z.string() }).strict(),
    social: z
      .object({
        youtube: z.string(),
        telegram: z.string(),
        vk: z.string(),
      })
      .strict(),
  })
  .strict();
