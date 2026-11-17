import actionRailData from "@/data/content/site/sections/action-rail.json";
import { actionRailConfigSchema } from "@/validation/action-rail";
import type { ActionRailConfig } from "@/types/action-rail";

export const actionRail: ActionRailConfig =
  actionRailConfigSchema.parse(actionRailData);
