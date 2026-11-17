// Resolve articles before applying public project and category views.
import { afterEach, expect, it, vi } from "vitest";
import { buildProject } from "../../tests/helpers/fixtures";
import { projectCategories } from "./projectCategories";

afterEach(() => {
  vi.doUnmock("astro:content");
  vi.doUnmock("@/data/content/site/lists/projects.json");
  vi.resetModules();
});

function record(id: number, format: "json" | "mdx" = "json") {
  const { content, ...metadata } = buildProject({
    id,
    status: "demo",
    content: [{ type: "paragraph", paragraphs: ["Article"] }],
  });
  return {
    ...metadata,
    article:
      format === "json"
        ? { format, reason: "Synthetic fixture", content }
        : { format, entry: String(id) },
  };
}

function load(records: unknown[], entries: unknown[] = []) {
  vi.resetModules();
  const render = vi.fn(async () => ({
    remarkPluginFrontmatter: {
      content: [{ type: "paragraph", paragraphs: ["Rendered MDX"] }],
    },
  }));
  vi.doMock("@/data/content/site/lists/projects.json", () => ({
    default: records,
  }));
  vi.doMock("astro:content", () => ({
    getCollection: vi.fn(async () => entries),
    render,
  }));
  return { result: import("./projects"), render };
}

it("resolves article formats and hides draft categories", async () => {
  const [visibleCategory, draftCategory] = projectCategories;
  const draft = {
    ...record(3),
    status: "draft",
    category: draftCategory.slug,
  };
  const { result, render } = load(
    [
      { ...record(1), category: visibleCategory.slug },
      { ...record(2, "mdx"), category: null },
      draft,
    ],
    [{ id: "2", data: { projectId: 2 } }],
  );
  const parsed = await result;
  expect(parsed.projectRecords.map(({ id }) => id)).toEqual([1, 2, 3]);
  expect(parsed.projects.map(({ id }) => id)).toEqual([1, 2]);
  expect(parsed.projects[1].content[0]).toEqual({
    type: "paragraph",
    paragraphs: ["Rendered MDX"],
  });
  expect(parsed.availableProjectCategories).toEqual([visibleCategory]);
  expect(render).toHaveBeenCalledOnce();
});

it.each([{ entries: [] }, { entries: [{ id: "1", data: { projectId: 2 } }] }])(
  "rejects absent or mismatched MDX without fallback %#",
  async ({ entries }) => {
    const { result, render } = load([record(1, "mdx")], entries);
    await expect(result).rejects.toThrow("Missing/mismatched project article");
    expect(render).not.toHaveBeenCalled();
  },
);

it("rejects a reference whose entry ID differs from its project", async () => {
  const source = record(1, "mdx");
  source.article = { format: "mdx", entry: "2" };
  await expect(
    load([source], [{ id: "2", data: { projectId: 1 } }]).result,
  ).rejects.toThrow("Missing/mismatched project article");
});

it("resets collections between imports", async () => {
  expect((await load([record(1)]).result).projects).toHaveLength(1);
  expect((await load([]).result).projects).toEqual([]);
});
