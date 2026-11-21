// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { initializeCardCarousel } from "./cardCarouselRuntime";

const VIEWPORT_WIDTH_PX = 300;
const OVERFLOW_WIDTH_PX = 420;
const CARD_WIDTH_PX = 120;
const TEST_POINTER_START_X_PX = 200;
const TEST_POINTER_END_X_PX = 100;
const MOUSE_POINTER_ID = 1;
const MAXIMUM_SCROLL_PX = OVERFLOW_WIDTH_PX - VIEWPORT_WIDTH_PX;

function createPointerEvent(
  type: string,
  pointerType: string,
  clientX: number,
  clientY = 0,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: MOUSE_POINTER_ID },
    pointerType: { value: pointerType },
    button: { value: 0 },
    clientX: { value: clientX },
    clientY: { value: clientY },
  });
  return event as PointerEvent;
}

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
  Object.defineProperty(viewport, "scrollTo", {
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

it("supports arrow and edge keyboard navigation", () => {
  const { carousel, viewport } = createCarousel();
  initializeCardCarousel(carousel);

  const right = new KeyboardEvent("keydown", {
    key: "ArrowRight",
    bubbles: true,
    cancelable: true,
  });
  viewport.dispatchEvent(right);

  expect(right.defaultPrevented).toBe(true);
  expect(viewport.scrollBy).toHaveBeenCalledWith({
    left: CARD_WIDTH_PX,
    behavior: "smooth",
  });

  viewport.dispatchEvent(
    new KeyboardEvent("keydown", { key: "End", bubbles: true }),
  );
  expect(viewport.scrollTo).toHaveBeenCalledWith({
    left: MAXIMUM_SCROLL_PX,
    behavior: "smooth",
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

it("drags with the mouse without selecting text or clicking a card", () => {
  const { carousel, viewport } = createCarousel();
  initializeCardCarousel(carousel);
  const firstCard = carousel.querySelector("article")!;
  const cardClick = vi.fn();
  firstCard.addEventListener("click", cardClick);

  viewport.dispatchEvent(
    createPointerEvent("pointerdown", "mouse", TEST_POINTER_START_X_PX),
  );
  expect(viewport.classList.contains("is-mouse-pressed")).toBe(true);

  const move = createPointerEvent(
    "pointermove",
    "mouse",
    TEST_POINTER_END_X_PX,
  );
  window.dispatchEvent(move);
  expect(viewport.scrollLeft).toBe(
    TEST_POINTER_START_X_PX - TEST_POINTER_END_X_PX,
  );
  expect(move.defaultPrevented).toBe(true);

  window.dispatchEvent(
    createPointerEvent("pointerup", "mouse", TEST_POINTER_END_X_PX),
  );
  expect(viewport.classList.contains("is-mouse-pressed")).toBe(false);
  firstCard.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
  expect(cardClick).not.toHaveBeenCalled();
});

it("prevents native image dragging inside the carousel", () => {
  const { carousel } = createCarousel();
  const image = document.createElement("img");
  carousel.querySelector("article")?.append(image);
  initializeCardCarousel(carousel);

  const dragStart = new Event("dragstart", {
    bubbles: true,
    cancelable: true,
  });
  image.dispatchEvent(dragStart);

  expect(dragStart.defaultPrevented).toBe(true);
});

it("keeps touch-dragged cards under the pointer", () => {
  const { carousel, viewport } = createCarousel();
  initializeCardCarousel(carousel);

  viewport.dispatchEvent(
    createPointerEvent("pointerdown", "touch", TEST_POINTER_START_X_PX),
  );
  const move = createPointerEvent(
    "pointermove",
    "touch",
    TEST_POINTER_END_X_PX,
  );
  window.dispatchEvent(move);

  expect(viewport.scrollLeft).toBe(
    TEST_POINTER_START_X_PX - TEST_POINTER_END_X_PX,
  );
  expect(move.defaultPrevented).toBe(true);
  expect(viewport.classList.contains("is-dragging")).toBe(true);
  expect(viewport.classList.contains("is-mouse-pressed")).toBe(false);

  window.dispatchEvent(
    createPointerEvent("pointerup", "touch", TEST_POINTER_END_X_PX),
  );
  expect(viewport.classList.contains("is-dragging")).toBe(false);
});

it("leaves predominantly vertical touch gestures to the page", () => {
  const { carousel, viewport } = createCarousel();
  initializeCardCarousel(carousel);

  viewport.dispatchEvent(
    createPointerEvent("pointerdown", "touch", TEST_POINTER_START_X_PX),
  );
  const move = createPointerEvent(
    "pointermove",
    "touch",
    TEST_POINTER_START_X_PX - 2,
    10,
  );
  window.dispatchEvent(move);

  expect(viewport.scrollLeft).toBe(0);
  expect(move.defaultPrevented).toBe(false);
  expect(viewport.classList.contains("is-dragging")).toBe(true);
});
