import { z } from "astro/zod";

const imageSchema = z
  .object({
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
  })
  .strict();

const sectionSchema = z
  .object({
    title: z.string(),
    subtitle: z.string().optional(),
  })
  .strict();

const linkSchema = z
  .object({
    label: z.string(),
    href: z.string(),
  })
  .strict();

export const siteSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    logoText: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
    workHours: z.string(),
    workHoursWeekend: z.string(),
    mapSrc: z.string(),
    mapEnabled: z.boolean(),
    mapFallback: imageSchema,
    yandexReviews: z
      .object({
        enabled: z.boolean(),
        organizationId: z.string(),
        reviewsUrl: z.string(),
        placeholder: imageSchema,
      })
      .strict(),
    menu: z.array(linkSchema),
    legal: z.array(linkSchema),
    sections: z
      .object({
        about: sectionSchema,
        projects: sectionSchema,
        reviews: sectionSchema,
        contacts: sectionSchema.extend({ panelTitle: z.string() }).strict(),
      })
      .strict(),
    footer: z
      .object({
        description: z.string(),
        copyright: z.string(),
      })
      .strict(),
  })
  .strict();
