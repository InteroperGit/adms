// @vitest-environment jsdom
// Browser-state coverage verifies carousel lifecycle and cleanup behavior.
import { afterEach, expect, it, vi } from "vitest";

class ObserverMock {
  static instances: ObserverMock[] = [];
  callback: IntersectionObserverCallback | ResizeObserverCallback;
  disconnected = false;
  observed: Element[] = [];

  constructor(callback: IntersectionObserverCallback | ResizeObserverCallback) {
    this.callback = callback;
    ObserverMock.instances.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }

  emit(entry: Partial<IntersectionObserverEntry>) {
    (this.callback as unknown as (entries: unknown[]) => void)([
      {
        isIntersecting: false,
        target: this.observed[0],
        ...entry,
      } as IntersectionObserverEntry,
    ]);
  }
  disconnect() {
    this.disconnected = true;
  }
}

const matchMedia = (matches = false) => ({
  matches,
  media: "",
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(() => true),
});

function carouselMarkup() {
  return `
    <image-carousel data-autoplay="true" data-interval="1000"
      data-manual="true" data-arrows="true" data-circles="true"
      data-animation="true" data-item-label="Slide">
      <div class="carousel-controls"><button class="carousel-arrow"
        data-direction="1">Next</button></div>
      <div class="carousel-dots">
        <button class="carousel-dot" data-index="0"></button>
        <button class="carousel-dot" data-index="1"></button>
      </div>
      <div role="status"></div>
      <div class="carousel-slide" id="one">One</div>
      <div class="carousel-slide" id="two">Two</div>
    </image-carousel>`;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.useRealTimers();
  ObserverMock.instances = [];
});

it("initializes manual state and disconnects observers", async () => {
  vi.stubGlobal("IntersectionObserver", ObserverMock);
  vi.stubGlobal("ResizeObserver", ObserverMock);
  vi.stubGlobal("matchMedia", () => matchMedia());
  vi.resetModules();
  await import("./imageCarousel");
  document.body.innerHTML = carouselMarkup();
  const carousel = document.querySelector<HTMLElement>("image-carousel")!;
  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".carousel-dot");

  expect(carousel.dataset.ready).toBe("true");
  expect(slides[0]).not.toHaveAttribute("aria-hidden");
  expect(slides[1]).toHaveAttribute("aria-hidden", "true");
  expect(dots[0]).toHaveAttribute("aria-current", "true");
  expect(dots[1]).not.toHaveAttribute("aria-current");

  (dots[1] as HTMLElement).click();
  expect(slides[0]).toHaveAttribute("aria-hidden", "true");
  expect(slides[1]).not.toHaveAttribute("aria-hidden");
  expect(carousel.querySelector('[role="status"]')).toHaveTextContent(
    "Slide 2",
  );

  (carousel.querySelector(".carousel-arrow") as HTMLElement).click();
  expect(slides[0]).not.toHaveAttribute("aria-hidden");

  carousel.remove();
  expect(
    ObserverMock.instances.every((observer) => observer.disconnected),
  ).toBe(true);
  expect(carousel.dataset.ready).toBeUndefined();
  expect(slides[0]).not.toHaveAttribute("aria-hidden");
});

it("does not enhance when observer support is unavailable", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  vi.stubGlobal("ResizeObserver", undefined);
  vi.stubGlobal("matchMedia", () => matchMedia());
  vi.resetModules();
  await import("./imageCarousel");
  document.body.innerHTML = carouselMarkup();
  const carousel = document.querySelector<HTMLElement>("image-carousel")!;

  expect(carousel.dataset.ready).toBeUndefined();
  expect(carousel.querySelector(".carousel-slide")).not.toHaveAttribute(
    "aria-hidden",
  );
});

it("keeps slide selection independent for each carousel instance", async () => {
  vi.stubGlobal("IntersectionObserver", ObserverMock);
  vi.stubGlobal("ResizeObserver", ObserverMock);
  vi.stubGlobal("matchMedia", () => matchMedia());
  vi.resetModules();
  await import("./imageCarousel");
  document.body.innerHTML = carouselMarkup() + carouselMarkup();
  const carousels = document.querySelectorAll<HTMLElement>("image-carousel");
  const firstSlides = carousels[0].querySelectorAll(".carousel-slide");
  const secondSlides = carousels[1].querySelectorAll(".carousel-slide");

  carousels[0]
    .querySelector<HTMLButtonElement>('.carousel-dot[data-index="1"]')
    ?.click();

  expect(firstSlides[0]).toHaveAttribute("aria-hidden", "true");
  expect(firstSlides[1]).not.toHaveAttribute("aria-hidden");
  expect(secondSlides[0]).not.toHaveAttribute("aria-hidden");
  expect(secondSlides[1]).toHaveAttribute("aria-hidden", "true");
});

it("clears the outgoing slide after the crossfade", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", ObserverMock);
  vi.stubGlobal("ResizeObserver", ObserverMock);
  vi.stubGlobal("matchMedia", () => matchMedia());
  vi.resetModules();
  await import("./imageCarousel");
  document.body.innerHTML = carouselMarkup();
  const carousel = document.querySelector<HTMLElement>("image-carousel")!;
  const slides = carousel.querySelectorAll<HTMLElement>(".carousel-slide");

  carousel
    .querySelector<HTMLButtonElement>('.carousel-dot[data-index="1"]')
    ?.click();

  expect(slides[0]).toHaveAttribute("data-exiting", "true");
  expect(slides[0]).toHaveAttribute("aria-hidden", "true");
  expect(slides[0].inert).toBe(true);
  expect(slides[1]).not.toHaveAttribute("aria-hidden");

  carousel
    .querySelector<HTMLButtonElement>('.carousel-dot[data-index="0"]')
    ?.click();

  expect(slides[0]).not.toHaveAttribute("data-exiting");
  expect(slides[1]).toHaveAttribute("data-exiting", "true");
  expect(slides[0]).not.toHaveAttribute("aria-hidden");
  expect(slides[1]).toHaveAttribute("aria-hidden", "true");

  vi.advanceTimersByTime(900);

  expect(slides[1]).not.toHaveAttribute("data-exiting");
});

it("rotates with fake time and pauses while hovered or hidden", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", ObserverMock);
  vi.stubGlobal("ResizeObserver", ObserverMock);
  vi.stubGlobal("matchMedia", () => matchMedia());
  vi.resetModules();
  await import("./imageCarousel");
  document.body.innerHTML = carouselMarkup();
  const carousel = document.querySelector<HTMLElement>("image-carousel")!;
  const slides = carousel.querySelectorAll(".carousel-slide");
  const observer = ObserverMock.instances[0];

  observer.emit({ isIntersecting: true });
  vi.advanceTimersByTime(1000);
  expect(slides[1]).not.toHaveAttribute("aria-hidden");

  carousel.dispatchEvent(new PointerEvent("pointerenter"));
  vi.advanceTimersByTime(1000);
  expect(slides[1]).not.toHaveAttribute("aria-hidden");

  Object.defineProperty(document, "hidden", {
    value: true,
    configurable: true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
  vi.advanceTimersByTime(1000);
  expect(slides[1]).not.toHaveAttribute("aria-hidden");
});

it("keeps manual controls with reduced motion", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", ObserverMock);
  vi.stubGlobal("ResizeObserver", ObserverMock);
  vi.stubGlobal("matchMedia", () => matchMedia(true));
  vi.resetModules();
  await import("./imageCarousel");
  document.body.innerHTML = carouselMarkup().replace(
    'data-manual="true"',
    'data-manual="false"',
  );
  const carousel = document.querySelector<HTMLElement>("image-carousel")!;
  const slides = carousel.querySelectorAll(".carousel-slide");

  ObserverMock.instances[0].emit({ isIntersecting: true });
  vi.advanceTimersByTime(5000);

  expect(slides[0]).not.toHaveAttribute("aria-hidden");
  expect(slides[1]).not.toHaveAttribute("aria-hidden");
  expect(carousel.dataset.ready).toBeUndefined();
});
