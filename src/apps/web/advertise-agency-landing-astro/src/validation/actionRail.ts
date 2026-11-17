import { z } from "astro/zod";
import type { ActionRailConfig } from "../types/actionRail";
import type { AssertContract, SameContract } from "./shared";

export const actionRailConfigSchema = z
  .object({
    callReminderIntervalSeconds: z.number().int().min(30).default(30),
  })
  .strict();

export type ActionRailConfigContract = AssertContract<
  SameContract<z.output<typeof actionRailConfigSchema>, ActionRailConfig>
>;
