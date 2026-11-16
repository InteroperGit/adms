// Collection registration keeps metadata validation and E2E fixtures isolated.
// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("astro:content", () => ({
  defineCollection: (options: unknown) => options,
}));

vi.mock("astro/loaders", () => ({
  glob: (options: Record<string, unknown>) => ({
    kind: "glob",
    ...options,
  }),
}));

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

function option(collection: unknown, key: string): unknown {
  if (
    typeof collection !== "object" ||
    collection === null ||
    !(key in collection)
  ) {
    throw new Error(`Collection is missing ${key}`);
  }

  return Reflect.get(collection, key);
}

it("registers article collections with their metadata schemas", async () => {
  const { collections } = await import("./content.config");
  const { projectArticleMetadataSchema } = await import(
    "./validation/projects"
  );
  const { serviceArticleMetadataSchema } = await import(
    "./validation/service-articles"
  );
  const names = Object.keys(collections);

  expect(names).toHaveLength(3);
  expect(names).toEqual(
    expect.arrayContaining([
      "serviceArticles",
      "projectArticles",
      "articleFixtures",
    ]),
  );
  expect(option(collections.serviceArticles, "schema")).toBe(
    serviceArticleMetadataSchema,
  );
  expect(option(collections.projectArticles, "schema")).toBe(
    projectArticleMetadataSchema,
  );
  expect(option(collections.articleFixtures, "schema")).toBe(
    serviceArticleMetadataSchema,
  );
  expect(
    serviceArticleMetadataSchema.safeParse({
      title: "Service",
      description: "Description",
      approved: false,
    }).success,
  ).toBe(true);
  expect(
    serviceArticleMetadataSchema.safeParse({
      title: "Service",
      description: "Description",
      approved: "false",
    }).success,
  ).toBe(false);
  expect(
    projectArticleMetadataSchema.safeParse({ projectId: 42 }).success,
  ).toBe(true);
  expect(
    projectArticleMetadataSchema.safeParse({ projectId: -1 }).success,
  ).toBe(false);
  expect(
    serviceArticleMetadataSchema.safeParse({
      title: "Fixture",
      description: "Description",
      approved: true,
    }).success,
  ).toBe(true);
  expect(option(collections.serviceArticles, "loader")).toMatchObject({
    kind: "glob",
    pattern: "**/*.mdx",
    base: "./data/content/articles/services",
  });
  expect(option(collections.projectArticles, "loader")).toMatchObject({
    kind: "glob",
    pattern: "**/*.mdx",
    base: "./data/content/articles/projects",
  });
  expect(option(collections.articleFixtures, "loader")).toMatchObject({
    kind: "glob",
    pattern: "**/*.mdx",
    base: "./tests/fixtures/content/articles",
  });
});

it("uses the E2E content root for synthetic fixture articles", async () => {
  vi.stubEnv("E2E_CONTENT_ROOT", "./output/e2e/content");

  const { collections } = await import("./content.config");

  expect(option(collections.serviceArticles, "loader")).toMatchObject({
    base: "./output/e2e/content/articles/services",
  });
  expect(option(collections.projectArticles, "loader")).toMatchObject({
    base: "./output/e2e/content/articles/projects",
  });
  expect(option(collections.articleFixtures, "loader")).toMatchObject({
    base: "./output/e2e/content/fixtures/articles",
  });
});
