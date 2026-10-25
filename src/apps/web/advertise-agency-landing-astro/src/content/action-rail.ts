import actionRailData from "@/data/content/config/action-rail.json";
import { actionRailConfigSchema } from "@/validation/action-rail";
import type { ActionRailConfig } from "@/types/action-rail";

export const actionRail: ActionRailConfig =
  actionRailConfigSchema.parse(actionRailData);
