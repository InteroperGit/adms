// Chart enhancement uses mocked ECharts; no canvas, media or network is needed.
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import fixture from "../../tests/fixtures/content/chartRuntime.json";
import { installBrowserMocks } from "../../tests/helpers/browser";
import { renderChart } from "./chartRuntime";

const runtime = vi.hoisted(() => ({
  use: vi.fn(),
  getInstanceByDom: vi.fn(),
  init: vi.fn(),
}));

vi.mock("echarts/core", () => runtime);
vi.mock("echarts/lib/chart/bar", () => ({}));
vi.mock("echarts/lib/chart/line", () => ({}));
vi.mock("echarts/lib/chart/pie", () => ({}));
vi.mock("echarts/components", () => ({
  GridComponent: "grid",
  LegendComponent: "legend",
  TooltipComponent: "tooltip",
}));
vi.mock("echarts/renderers", () => ({ CanvasRenderer: "canvas" }));

let chart: {
  setOption: ReturnType<typeof vi.fn>;
  resize: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  chart = { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() };
  runtime.init.mockReset().mockReturnValue(chart);
  runtime.getInstanceByDom.mockReset().mockReturnValue(undefined);
});

afterEach(() => {
  // Complete teardown before shared mocks and DOM are reset by test setup.
  window.dispatchEvent(new PageTransitionEvent("pagehide"));
});

function target(data: unknown = fixture, width = 640) {
  const element = document.createElement("div");
  element.dataset.chart = JSON.stringify(data);
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: width,
  });
  document.body.append(element);
  return element;
}

function lastOptions() {
  return chart.setOption.mock.lastCall![0];
}

it("registers shared components and the canvas renderer", async () => {
  // Re-import to observe registration independently of test execution order.
  vi.resetModules();
  await import("./chartRuntime");
  expect(runtime.use).toHaveBeenCalledWith([
    "grid",
    "legend",
    "tooltip",
    "canvas",
  ]);
});

it.each(["bar", "line"])(
  "aligns %s series with shared ordered labels",
  async (chartType) => {
    const browser = installBrowserMocks();
    const element = target({ ...fixture, chartType });
    await renderChart(element);
    expect(runtime.init).toHaveBeenCalledWith(element, undefined, {
      renderer: "canvas",
    });
    expect(lastOptions()).toMatchObject({
      animation: true,
      tooltip: { trigger: "axis" },
      legend: { type: "scroll", bottom: 0 },
      grid: { containLabel: true, left: 12, right: 12, bottom: 42 },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar"],
        axisLabel: { interval: 0, hideOverlap: true, rotate: 0 },
      },
      yAxis: { type: "value", name: "orders" },
      series: [
        { name: "Online", type: chartType, data: [0, 12, null] },
        { name: "Offline", type: chartType, data: [null, 8, 5] },
      ],
    });
    expect(browser.resizeObservers[0].observed.has(element)).toBe(true);
    expect(browser.fetch).not.toHaveBeenCalled();
  },
);

it("omits the single-series legend and respects reduced motion", async () => {
  installBrowserMocks({ reducedMotion: true });
  await renderChart(target({ ...fixture, series: [fixture.series[0]] }, 519));
  expect(lastOptions()).toMatchObject({
    animation: false,
    legend: undefined,
    grid: { bottom: 20 },
    xAxis: { axisLabel: { rotate: 28 } },
  });
});

it("maps pie points directly and omits Cartesian axes", async () => {
  installBrowserMocks();
  await renderChart(
    target({
      ...fixture,
      chartType: "pie",
      series: [fixture.series[0]],
    }),
  );
  expect(lastOptions()).toMatchObject({
    tooltip: { trigger: "item" },
    legend: undefined,
    grid: undefined,
    xAxis: undefined,
    yAxis: undefined,
    series: [
      {
        type: "pie",
        radius: ["35%", "70%"],
        data: [
          { name: "Jan", value: 0 },
          { name: "Feb", value: 12 },
        ],
      },
    ],
  });
});

it.each(["bar", "pie"])("renders empty %s series safely", async (chartType) => {
  installBrowserMocks();
  await renderChart(target({ chartType, series: [] }));
  expect(lastOptions().series).toEqual(
    chartType === "pie"
      ? [{ type: "pie", radius: ["35%", "70%"], data: [] }]
      : [],
  );
});

it("skips detached elements and existing chart instances", async () => {
  const browser = installBrowserMocks();
  const element = target();
  element.remove();
  await renderChart(element);
  expect(runtime.getInstanceByDom).not.toHaveBeenCalled();
  document.body.append(element);
  runtime.getInstanceByDom.mockReturnValue(chart);
  await renderChart(element);
  expect(runtime.init).not.toHaveBeenCalled();
  expect(browser.resizeObservers).toHaveLength(0);
});

it("resizes Cartesian charts and updates labels", async () => {
  const browser = installBrowserMocks();
  const element = target(fixture, 519);
  await renderChart(element);
  Object.defineProperty(element, "clientWidth", { value: 520 });
  browser.resizeObservers[0].trigger([]);
  expect(chart.resize).toHaveBeenCalledOnce();
  expect(lastOptions()).toEqual({
    xAxis: { axisLabel: { rotate: 0 } },
  });
  Object.defineProperty(element, "clientWidth", { value: 519 });
  browser.resizeObservers[0].trigger([]);
  expect(lastOptions()).toEqual({
    xAxis: { axisLabel: { rotate: 28 } },
  });
});

it("resizes pie charts without adding Cartesian options", async () => {
  const browser = installBrowserMocks();
  await renderChart(target({ ...fixture, chartType: "pie" }));
  browser.resizeObservers[0].trigger([]);
  expect(chart.resize).toHaveBeenCalledOnce();
  expect(chart.setOption).toHaveBeenCalledOnce();
});

it("preserves cached charts and disposes on a final page exit", async () => {
  const browser = installBrowserMocks();
  const element = target();
  await renderChart(element);
  window.dispatchEvent(
    new PageTransitionEvent("pagehide", {
      persisted: true,
    }),
  );
  expect(chart.dispose).not.toHaveBeenCalled();
  expect(browser.resizeObservers[0].observed.has(element)).toBe(true);
  window.dispatchEvent(new PageTransitionEvent("pagehide"));
  expect(chart.dispose).toHaveBeenCalledOnce();
  expect(browser.resizeObservers[0].observed.size).toBe(0);
});

it.each(["{", "null", "{}", '{"series":null}'])(
  "propagates malformed data %s to the caller fallback",
  async (raw) => {
    const browser = installBrowserMocks();
    const element = target();
    element.dataset.chart = raw;
    await expect(renderChart(element)).rejects.toThrow();
    expect(chart.setOption).not.toHaveBeenCalled();
    expect(browser.resizeObservers).toHaveLength(0);
    expect(browser.fetch).not.toHaveBeenCalled();
  },
);

it("propagates missing data to the caller fallback", async () => {
  installBrowserMocks();
  const element = target();
  delete element.dataset.chart;
  await expect(renderChart(element)).rejects.toThrow();
});

it(
  "propagates an unavailable canvas ru" + "ntime without installing observers",
  async () => {
    const browser = installBrowserMocks();
    runtime.init.mockImplementation(() => {
      throw new Error("Canvas unavailable");
    });
    await expect(renderChart(target())).rejects.toThrow("Canvas unavailable");
    expect(browser.resizeObservers).toHaveLength(0);
    expect(browser.fetch).not.toHaveBeenCalled();
  },
);
