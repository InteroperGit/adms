// Catalog export provides a positive integral pagination size.
import { expect, it } from "vitest";
import fixture from "@/data/content/site/pages/projects.json";
import { projectCatalogSettings } from "./projectCatalog";

it("exports the configured positive page size", () => {
  expect(projectCatalogSettings).toEqual(fixture);
  expect(Number.isInteger(projectCatalogSettings.pageSize)).toBe(true);
  expect(projectCatalogSettings.pageSize).toBeGreaterThan(0);
});
