// src/content/icons.ts
import iconsData from "@/data/content/site/settings/icons.json";
import type { Icons } from "@/types";
import { parseContent } from "@/validation/parse-content";
import { iconsSchema } from "@/validation/icons";

export const icons: Icons = parseContent(
  iconsSchema,
  iconsData,
  "data/content/site/settings/icons.json",
);
