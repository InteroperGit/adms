// Catalog export provides a positive integral pagination size.
import { expect, it } from "vitest";
import fixture from "@/data/content/config/project-catalog.json";
import { projectCatalogSettings } from "./project-catalog";

it("exports the configured positive page size", () => {
  expect(projectCatalogSettings).toEqual(fixture);
  expect(Number.isInteger(projectCatalogSettings.pageSize)).toBe(true);
  expect(projectCatalogSettings.pageSize).toBeGreaterThan(0);
});
