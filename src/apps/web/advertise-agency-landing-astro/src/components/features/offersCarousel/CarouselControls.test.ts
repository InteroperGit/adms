// @vitest-environment node
import { expect, it } from "vitest";
import CarouselControls from "./CarouselControls.astro";
import { render } from "../../../../tests/helpers/render";

const dotCount = 2;

it("renders manual arrows, dots, and a live status", async () => {
  const body = await render(CarouselControls, {
    dotCount,
    showArrows: true,
    showDots: true,
    manualNavigation: true,
  });
  const controls = body.querySelector(".carousel-controls");

  expect(controls).toHaveAttribute("hidden");
  expect(controls?.querySelectorAll(".carousel-arrow")).toHaveLength(2);
  expect(controls?.querySelectorAll("button.carousel-dot")).toHaveLength(2);
  expect(controls?.querySelector('[role="status"]')).toBeInTheDocument();
});

it("keeps automatic dots passive and hides arrows when disabled", async () => {
  const body = await render(CarouselControls, {
    dotCount,
    showArrows: false,
    showDots: true,
    manualNavigation: false,
  });
  const controls = body.querySelector(".carousel-controls");

  expect(controls?.querySelectorAll(".carousel-arrow")).toHaveLength(0);
  expect(controls?.querySelectorAll("span.carousel-dot")).toHaveLength(2);
  expect(controls?.querySelector("[role='status']")).toBeNull();
  expect(controls?.querySelector(".carousel-dots")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

it("renders no control shell when all controls are disabled", async () => {
  const body = await render(CarouselControls, {
    dotCount,
    showArrows: false,
    showDots: false,
    manualNavigation: false,
  });

  expect(body.querySelector(".carousel-controls")).toBeNull();
});
