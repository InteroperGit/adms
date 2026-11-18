// @vitest-environment jsdom
import { expect, it } from "vitest";
import "./offersImageCarouselRuntime";

function createCarousel(count = 3) {
  const element = document.createElement("offers-image-carousel");
  element.dataset.count = String(count);
  element.dataset.autoplay = "false";
  element.dataset.interval = "7000";
  element.dataset.animation = "true";
  element.innerHTML = `
    <div class="offers-track" style="column-gap:16px">
      ${[-2, -1, 0, 1, 2]
        .map(
          (offset) => `
            <div class="offers-track-slot" data-track-offset="${offset}">
              ${[0, 1, 2]
                .map(
                  (index) =>
                    `<article data-track-index="${index}"${
                      index ? " hidden" : ""
                    }>Offer ${index}</article>`,
                )
                .join("")}
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="carousel-controls" hidden>
      <button class="carousel-arrow" data-direction="-1"></button>
      <div class="carousel-dots">
        ${[0, 1, 2]
          .map(
            (index) =>
              `<button class="carousel-dot" data-index="${index}"></button>`,
          )
          .join("")}
      </div>
      <button class="carousel-arrow" data-direction="1"></button>
    </div>
    <span role="status"></span>
  `;
  document.body.append(element);
  const slots = element.querySelectorAll<HTMLElement>(".offers-track-slot");
  for (const slot of slots) {
    Object.defineProperty(slot, "getBoundingClientRect", {
      value: () => ({ width: 300 }),
    });
  }
  return {
    element,
    track: element.querySelector<HTMLElement>(".offers-track")!,
    slots,
    dots: element.querySelectorAll<HTMLButtonElement>(".carousel-dot"),
    status: element.querySelector<HTMLElement>('[role="status"]')!,
  };
}

function dispatchPointer(
  target: Element,
  type: string,
  values: { x: number; y: number; pointerId?: number },
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    button: { value: 0 },
    clientX: { value: values.x },
    clientY: { value: values.y },
    isPrimary: { value: true },
    pointerId: { value: values.pointerId ?? 1 },
  });
  target.dispatchEvent(event);
}

function finishTrackTransition(track: HTMLElement) {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "transform" });
  track.dispatchEvent(event);
}

it("renders one active item and cyclic previews in a shared track", () => {
  const { element, slots, dots } = createCarousel();

  expect(element).toHaveAttribute("data-ready", "true");
  expect(element.querySelector(".carousel-controls")).not.toHaveAttribute(
    "hidden",
  );
  expect(slots[0].querySelector("[data-track-index='1']")).not.toHaveProperty(
    "hidden",
    true,
  );
  expect(slots[2].querySelector("[data-track-index='0']")).not.toHaveProperty(
    "hidden",
    true,
  );
  expect(slots[4].querySelector("[data-track-index='2']")).not.toHaveProperty(
    "hidden",
    true,
  );
  expect(slots[2]).toHaveAttribute("data-active");
  expect(slots[2]).not.toHaveAttribute("aria-hidden");
  expect(slots[2]).not.toHaveProperty("inert", true);
  expect(dots[0]).toHaveAttribute("aria-current", "true");

  element.remove();
  expect(element).not.toHaveAttribute("data-ready");
});

it("continues a short swipe through the next full card", async () => {
  const { element, track, slots, dots, status } = createCarousel();
  const caption = slots[2].querySelector<HTMLElement>(
    "[data-track-index='0']",
  )!;
  caption.textContent = "Move with the card";
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(caption);
  selection?.addRange(range);

  dispatchPointer(element, "pointerdown", { x: 180, y: 120 });
  dispatchPointer(element, "pointermove", { x: 120, y: 120 });
  expect(element.style.getPropertyValue("--offers-drag-offset")).toBe("-60px");
  expect(element).toHaveAttribute("data-swiping", "true");
  expect(selection?.toString()).toBe("");

  dispatchPointer(element, "pointerup", { x: 120, y: 120 });
  expect(element.style.getPropertyValue("--offers-drag-offset")).toBe("-316px");
  finishTrackTransition(track);
  expect(slots[2].querySelector("[data-track-index='1']")).not.toHaveProperty(
    "hidden",
    true,
  );
  expect(dots[1]).toHaveAttribute("aria-current", "true");
  expect(element).toHaveAttribute("data-recentering", "true");
  await expect.poll(() => status.textContent).toBe("Предложение 2 из 3");
  expect(element).not.toHaveAttribute("data-settling");
  element.remove();
});

it("moves every card toward the previous offer and keeps the step gap", () => {
  const { element, track, slots, dots } = createCarousel();
  dispatchPointer(element, "pointerdown", { x: 120, y: 100 });
  dispatchPointer(element, "pointermove", { x: 180, y: 100 });
  dispatchPointer(element, "pointerup", { x: 180, y: 100 });

  expect(element.style.getPropertyValue("--offers-drag-offset")).toBe("316px");
  finishTrackTransition(track);
  expect(slots[2].querySelector("[data-track-index='2']")).not.toHaveProperty(
    "hidden",
    true,
  );
  expect(dots[2]).toHaveAttribute("aria-current", "true");
  element.remove();
});

it("keeps swipe direction with two items", () => {
  const { element, track } = createCarousel(2);
  dispatchPointer(element, "pointerdown", { x: 180, y: 100 });
  dispatchPointer(element, "pointermove", { x: 240, y: 100 });
  dispatchPointer(element, "pointerup", { x: 240, y: 100 });

  expect(element.style.getPropertyValue("--offers-drag-offset")).toBe("316px");
  finishTrackTransition(track);
  element.remove();
});
