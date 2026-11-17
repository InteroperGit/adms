import type { z } from "astro/zod";
import type { AboutContent } from "@/types/about";
import type { Icons } from "@/types/icons";
import type { LegalDocument } from "@/types/legal";
import type { SiteConfig } from "@/types/site";
import type { AssertContract, SameContract } from "@/validation/shared";
import type { aboutSchema } from "@/validation/about";
import type { iconsSchema } from "@/validation/icons";
import type { legalDocumentSchema } from "@/validation/legal";
import type { siteSchema } from "@/validation/site";

export type AboutSchemaOutput = AssertContract<
  SameContract<z.output<typeof aboutSchema>, AboutContent>
>;
export type IconsSchemaOutput = AssertContract<
  SameContract<z.output<typeof iconsSchema>, Icons>
>;
export type LegalSchemaOutput = AssertContract<
  SameContract<z.output<typeof legalDocumentSchema>, LegalDocument>
>;
export type SiteSchemaOutput = AssertContract<
  SameContract<z.output<typeof siteSchema>, SiteConfig>
>;
