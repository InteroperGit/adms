// src/content/about.ts
import aboutData from "@/data/content/site/sections/about.json";
import type { AboutContent } from "@/types";
import { parseContent } from "@/validation/parseContent";
import { aboutSchema } from "@/validation/about";

export const about: AboutContent = parseContent(
  aboutSchema,
  aboutData,
  "data/content/site/sections/about.json",
);
