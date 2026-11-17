import actionRailData from "@/data/content/site/sections/actionRail.json";
import { actionRailConfigSchema } from "@/validation/actionRail";
import type { ActionRailConfig } from "@/types/actionRail";

export const actionRail: ActionRailConfig =
  actionRailConfigSchema.parse(actionRailData);
