// The services menu entry follows the visible service aggregate.
import { afterEach, expect, it, vi } from "vitest";
import fixture from "../../tests/fixtures/content/site/config/site.json";

afterEach(() => {
  vi.doUnmock("./services");
  vi.resetModules();
});

it.each([false, true])(
  "filters service navigation for visibility %s",
  async (visible) => {
    vi.resetModules();
    vi.doMock("./services", () => ({
      visibleServices: visible ? [{ id: "sample" }] : [],
    }));
    const { site } = await import("./site");
    expect(site.menu).toEqual(
      fixture.menu.filter((item) => visible || item.href !== "/#services"),
    );
    expect(site.title).toBe(fixture.title);
  },
);
