// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import "./cylinderCarouselRuntime";

it("moves slides and updates preview and selection state", async () => {
  const carousel = document.createElement("cylinder-carousel");
  carousel.dataset.preview = "true";
  carousel.dataset.peek = "4";
  carousel.dataset.autoplay = "false";
  carousel.dataset.animation = "false";
  carousel.dataset.announcement = "Slide {current} / {total}";
  carousel.innerHTML = `
    <div data-cylinder-slide><input value="kept"></div>
    <div data-cylinder-slide><a href="#next">Second</a></div>
    <div data-cylinder-slide>Third</div>
    <div class="cylinder-controls" hidden>
      <button data-cylinder-prev></button>
      <button data-cylinder-next></button>
      <button data-cylinder-index="0"></button>
      <button data-cylinder-index="1"></button>
      <button data-cylinder-index="2"></button>
      <span role="status"></span>
    </div>
  `;
  document.body.append(carousel);
  const slides = [
    ...carousel.querySelectorAll<HTMLElement>("[data-cylinder-slide]"),
  ];
  const input = slides[0].querySelector("input")!;
  input.value = "edited";
  const next = carousel.querySelector<HTMLButtonElement>(
    "[data-cylinder-next]",
  )!;
  next.click();

  expect(carousel.dataset.ready).toBe("true");
  expect(carousel.querySelectorAll("[data-cylinder-slide]")).toHaveLength(3);
  expect(slides[1].dataset.active).toBe("true");
  expect(slides[0].inert).toBe(true);
  expect(input.value).toBe("edited");
  expect(carousel.querySelector('[data-cylinder-index="1"]')).toHaveAttribute(
    "aria-current",
    "true",
  );

  const secondCarousel = carousel.cloneNode(true) as HTMLElement;
  secondCarousel.removeAttribute("data-ready");
  document.body.append(secondCarousel);
  secondCarousel
    .querySelector<HTMLButtonElement>("[data-cylinder-next]")!
    .click();
  expect(
    secondCarousel.querySelector('[data-cylinder-slide][data-active="true"]'),
  ).toBe(secondCarousel.querySelectorAll("[data-cylinder-slide]")[1]);
  expect(
    carousel.querySelector('[data-cylinder-slide][data-active="true"]'),
  ).toBe(slides[1]);
  carousel.querySelector<HTMLButtonElement>("[data-cylinder-next]")!.click();
  expect(
    secondCarousel.querySelector('[data-cylinder-slide][data-active="true"]'),
  ).toBe(secondCarousel.querySelectorAll("[data-cylinder-slide]")[1]);

  secondCarousel.remove();
  carousel.remove();
});

it("pauses autoplay while a slide control has focus", async () => {
  vi.useFakeTimers();
  const carousel = document.createElement("cylinder-carousel");
  carousel.dataset.autoplay = "true";
  carousel.dataset.interval = "1000";
  carousel.innerHTML = `
    <div data-cylinder-slide>One</div>
    <div data-cylinder-slide>Two</div>
    <div class="cylinder-controls">
      <button data-cylinder-index="0"></button>
      <button data-cylinder-index="1"></button>
    </div>
  `;
  document.body.append(carousel);
  const dots = carousel.querySelectorAll<HTMLButtonElement>(
    "[data-cylinder-index]",
  );

  await vi.advanceTimersByTimeAsync(1000);
  expect(dots[1]).toHaveAttribute("aria-current", "true");
  dots[0].focus();
  await vi.advanceTimersByTimeAsync(2000);
  expect(dots[1]).toHaveAttribute("aria-current", "true");

  carousel.remove();
  vi.useRealTimers();
});

it("pauses autoplay while the carousel is outside the viewport", async () => {
  vi.useFakeTimers();
  const originalObserver = globalThis.IntersectionObserver;
  let callback: IntersectionObserverCallback | undefined;
  let disconnected = false;
  class ObserverStub {
    constructor(nextCallback: IntersectionObserverCallback) {
      callback = nextCallback;
    }
    observe() {}
    disconnect() {
      disconnected = true;
    }
    unobserve() {}
    takeRecords() {
      return [];
    }
  }
  const observerConstructor =
    ObserverStub as unknown as typeof IntersectionObserver;
  globalThis.IntersectionObserver = observerConstructor;

  const carousel = document.createElement("cylinder-carousel");
  carousel.dataset.autoplay = "true";
  carousel.dataset.interval = "1000";
  carousel.dataset.animation = "false";
  carousel.innerHTML = `
    <div data-cylinder-slide>One</div>
    <div data-cylinder-slide>Two</div>
  `;
  document.body.append(carousel);
  const reportVisibility = (ratio: number) => {
    callback?.(
      [
        {
          target: carousel,
          isIntersecting: ratio > 0,
          intersectionRatio: ratio,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  };

  reportVisibility(0);
  await vi.advanceTimersByTimeAsync(1000);
  expect(
    carousel.querySelector('[data-cylinder-slide][data-active="true"]'),
  ).toBe(carousel.querySelectorAll("[data-cylinder-slide]")[0]);

  reportVisibility(0.5);
  await vi.advanceTimersByTimeAsync(1000);
  expect(
    carousel.querySelector('[data-cylinder-slide][data-active="true"]'),
  ).toBe(carousel.querySelectorAll("[data-cylinder-slide]")[1]);

  carousel.remove();
  expect(disconnected).toBe(true);
  globalThis.IntersectionObserver = originalObserver;
  vi.useRealTimers();
});

it.each([2, 3, 10])("shows cyclic neighbors for %i slides", (count) => {
  const carousel = document.createElement("cylinder-carousel");
  carousel.dataset.preview = "true";
  carousel.dataset.autoplay = "false";
  carousel.innerHTML = Array.from(
    { length: count },
    (_, index) => `<div data-cylinder-slide>Slide ${index + 1}</div>`,
  ).join("");
  document.body.append(carousel);
  const slides = [
    ...carousel.querySelectorAll<HTMLElement>("[data-cylinder-slide]"),
  ];
  const visibleIndexes = slides.flatMap((slide, index) =>
    slide.dataset.previewVisible === "true" ? [index] : [],
  );

  expect(visibleIndexes).toEqual(count === 2 ? [0, 1] : [0, 1, count - 1]);
  carousel.remove();
});

it("wraps one step and recenters the offscreen slide", async () => {
  vi.useFakeTimers();
  const carousel = document.createElement("cylinder-carousel");
  carousel.dataset.preview = "true";
  carousel.dataset.autoplay = "false";
  carousel.innerHTML = `
    <div data-cylinder-slide>First</div>
    <div data-cylinder-slide>Second</div>
    <div data-cylinder-slide>Third</div>
    <div class="cylinder-controls">
      <button data-cylinder-prev></button>
      <button data-cylinder-next></button>
    </div>
  `;
  Object.defineProperty(carousel, "getBoundingClientRect", {
    value: () => ({ width: 300 }),
  });
  document.body.append(carousel);
  carousel.querySelector<HTMLButtonElement>("[data-cylinder-prev]")!.click();
  await vi.advanceTimersByTimeAsync(460);

  carousel.querySelector<HTMLButtonElement>("[data-cylinder-next]")!.click();
  const secondSlide = carousel.querySelectorAll<HTMLElement>(
    "[data-cylinder-slide]",
  )[1];
  expect(secondSlide.style.transform).toBe("translateX(calc(-600px + 0px))");

  await vi.advanceTimersByTimeAsync(460);
  expect(secondSlide.style.transform).toBe("translateX(calc(300px + 0px))");
  carousel.remove();
  vi.useRealTimers();
});
