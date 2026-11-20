// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { initializeCardCarousel } from "./cardCarouselRuntime";

const VIEWPORT_WIDTH_PX = 300;
const OVERFLOW_WIDTH_PX = 420;
const CARD_WIDTH_PX = 120;

function createCarousel() {
  document.body.innerHTML = `
    <section class="card-carousel">
      <div class="card-carousel-controls" hidden>
        <button data-direction="-1"></button>
        <button data-direction="1"></button>
      </div>
      <div class="card-carousel-viewport" tabindex="0">
        <div class="card-carousel-track">
          <article>First</article>
          <article>Second</article>
        </div>
      </div>
    </section>`;
  const carousel = document.querySelector<HTMLElement>(".card-carousel")!;
  const viewport = carousel.querySelector<HTMLElement>(
    ".card-carousel-viewport",
  )!;
  Object.defineProperties(viewport, {
    clientWidth: { configurable: true, value: VIEWPORT_WIDTH_PX },
    scrollWidth: { configurable: true, value: OVERFLOW_WIDTH_PX },
  });
  Object.defineProperty(viewport, "scrollBy", {
    configurable: true,
    value: vi.fn(),
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: CARD_WIDTH_PX,
  } as DOMRect);
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
  }));
  vi.stubGlobal("ResizeObserver", undefined);
  return { carousel, viewport };
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("reveals controls and disables arrows at the scroll boundaries", () => {
  const { carousel, viewport } = createCarousel();
  initializeCardCarousel(carousel);
  const controls = carousel.querySelector<HTMLElement>(
    ".card-carousel-controls",
  )!;
  const previous = carousel.querySelector<HTMLButtonElement>(
    '[data-direction="-1"]',
  )!;
  const next = carousel.querySelector<HTMLButtonElement>(
    '[data-direction="1"]',
  )!;

  expect(controls.hidden).toBe(false);
  expect(previous.disabled).toBe(true);
  expect(next.disabled).toBe(false);

  viewport.scrollLeft = OVERFLOW_WIDTH_PX - VIEWPORT_WIDTH_PX;
  viewport.dispatchEvent(new Event("scroll"));

  expect(previous.disabled).toBe(false);
  expect(next.disabled).toBe(true);
});

it("moves one card and honors reduced motion", () => {
  const { carousel, viewport } = createCarousel();
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: vi.fn(),
  }));
  initializeCardCarousel(carousel);
  const next = carousel.querySelector<HTMLButtonElement>(
    '[data-direction="1"]',
  )!;

  next.click();

  expect(viewport.scrollBy).toHaveBeenCalledWith({
    left: CARD_WIDTH_PX,
    behavior: "auto",
  });
});

it("keeps controls hidden when all cards fit", () => {
  const { carousel, viewport } = createCarousel();
  Object.defineProperty(viewport, "scrollWidth", {
    configurable: true,
    value: VIEWPORT_WIDTH_PX,
  });
  initializeCardCarousel(carousel);

  expect(
    carousel.querySelector<HTMLElement>(".card-carousel-controls")?.hidden,
  ).toBe(true);
});
