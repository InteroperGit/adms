// Service aggregate imports resolve authored articles and gate public cards.
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/services.json";

const collection = vi.hoisted(() => ({ entries: [] as unknown[] }));
vi.mock("astro:content", () => ({
  getCollection: async () => collection.entries,
  render: async () => ({
    remarkPluginFrontmatter: {
      content: [{ type: "paragraph", paragraphs: ["Rendered MDX"] }],
    },
  }),
}));

afterEach(() => {
  vi.doUnmock("@/data/content/config/services.json");
  vi.resetModules();
});

function load(data: unknown, entries: unknown[] = []) {
  vi.resetModules();
  vi.doUnmock("@/data/content/config/services.json");
  collection.entries = entries;
  vi.doMock("@/data/content/config/services.json", () => ({ default: data }));
  return { result: import("./services") };
}

function mdxData(entry = fixture.items[0].id) {
  return {
    ...fixture,
    items: [{ ...fixture.items[0], article: { format: "mdx", entry } }],
  };
}

it("normalizes JSON and gates unapproved cards", async () => {
  const parsed = await load({ ...fixture, demoMode: false }).result;
  expect(parsed.services.items.map(({ id }) => id)).toEqual(
    fixture.items.map(({ id }) => id),
  );
  expect(parsed.services.items[0].article.content).toEqual(
    fixture.items[0].article.content,
  );
  expect(parsed.publishedServices).toEqual([]);
  expect(parsed.visibleServices).toEqual([]);
  const preview = await load(fixture).result;
  expect(preview.visibleServices).toEqual(preview.services.items);
}, 15_000);

it("renders MDX metadata and blocks", async () => {
  const id = fixture.items[0].id;
  const { result } = load(mdxData(), [
    {
      id,
      data: { title: "MDX", description: "Article", approved: false },
    },
  ]);
  const parsed = await result;
  expect(parsed.services.items[0].article.title).toBe("MDX");
  expect(parsed.services.items[0].article.content[0]).toEqual({
    type: "paragraph",
    paragraphs: ["Rendered MDX"],
  });
});

it("rejects missing articles instead of selecting JSON", async () => {
  const { result } = load(mdxData());
  await expect(result).rejects.toThrow("Missing service article");
});

it("rejects mismatched article IDs before rendering", async () => {
  const { result } = load(mdxData("different"));
  await expect(result).rejects.toThrow("Service article id mismatch");
});
