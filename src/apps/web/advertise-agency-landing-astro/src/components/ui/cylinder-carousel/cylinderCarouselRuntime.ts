// Keep each slide node mounted while moving it around the active position.

const DEFAULT_INTERVAL_MS = 7000;
const MINIMUM_SLIDES = 2;
const DEFAULT_GAP_PX = 16;
const MAX_PEEK_PERCENT = 45;
const PERCENT_SCALE = 100;
const HALF = 2;
const SWIPE_INTENT_PX = 8;
const SWIPE_COMMIT_PX = 30;
const TRANSITION_DURATION_MS = 420;
const TRANSITION_FALLBACK_MS = 460;
const TRANSITION_TIMING = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const TRANSITION_STYLE =
  "transform " + TRANSITION_DURATION_MS + "ms " + TRANSITION_TIMING;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CURRENT_TOKEN = "{current}";
const TOTAL_TOKEN = "{total}";

type Options = {
  autoplay: boolean;
  interval: number;
};

function initialize(element: HTMLElement): () => void {
  const slides = Array.from(
    element.querySelectorAll<HTMLElement>("[data-cylinder-slide]"),
  );
  const status = element.querySelector<HTMLElement>("[role=status]");
  const count = slides.length;
  const announcementTemplate =
    element.dataset.announcement || "Slide {current} of {total}";
  const options: Options = {
    autoplay: element.dataset.autoplay === "true",
    interval: Number(element.dataset.interval) || DEFAULT_INTERVAL_MS,
  };
  if (count < MINIMUM_SLIDES) {
    element
      .querySelector<HTMLElement>(".cylinder-controls")
      ?.setAttribute("hidden", "");
    return () => {};
  }

  const dotsContainer = element.querySelector<HTMLElement>(".cylinder-dots");
  dotsContainer?.replaceChildren();
  const manualNavigation = element.dataset.manual === "true";
  const slideLabel = element.dataset.slideLabel || "Show slide";
  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement(manualNavigation ? "button" : "span");
      dot.className = "cylinder-dot";
      dot.dataset.cylinderIndex = String(index);
      if (manualNavigation && dot instanceof HTMLButtonElement) {
        dot.type = "button";
        dot.setAttribute("aria-label", `${slideLabel} ${index + 1}`);
      }
      dotsContainer.append(dot);
    });
  }
  const dots = Array.from(
    element.querySelectorAll<HTMLElement>("[data-cylinder-index]"),
  );

  const abort = new AbortController();
  const motion = window.matchMedia?.(REDUCED_MOTION_QUERY);
  let inViewport =
    !options.autoplay || typeof IntersectionObserver !== "function";
  let visibilityObserver: IntersectionObserver | undefined;
  let sizeObserver: ResizeObserver | undefined;
  let index = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;
  let pointer: { id: number; x: number; y: number } | undefined;
  let hovered = element.matches(":hover");
  let moving = false;
  let announceMove = false;

  const render = (
    animate: boolean,
    dragOffset = 0,
    movement?: { previousIndex: number; direction: number },
  ) => {
    const breakpoint = Number(element.dataset.previewBelow) || 0;
    const preview =
      element.dataset.preview === "true" &&
      (!breakpoint || window.innerWidth >= breakpoint);
    const showBoth = count > MINIMUM_SLIDES;
    const configuredGap = Number.parseFloat(
      getComputedStyle(element).getPropertyValue("--cylinder-gap"),
    );
    const gap = Number.isFinite(configuredGap) ? configuredGap : DEFAULT_GAP_PX;
    const width = element.getBoundingClientRect().width;
    const peek = Math.max(
      0,
      Math.min(MAX_PEEK_PERCENT, Number(element.dataset.peek) || 0),
    );
    const side = (width * peek) / PERCENT_SCALE;
    const slideWidth = preview ? width - HALF * side - gap : width;

    const offsetFrom = (itemIndex: number, activeIndex: number) => {
      let offset = (itemIndex - activeIndex + count) % count;
      if (offset > count / HALF) {
        offset -= count;
      }
      if (count === MINIMUM_SLIDES && offset < 0) {
        offset = 1;
      }
      return offset;
    };

    slides.forEach((slide, itemIndex) => {
      let offset = offsetFrom(itemIndex, index);
      if (movement && count > MINIMUM_SLIDES) {
        offset =
          offsetFrom(itemIndex, movement.previousIndex) - movement.direction;
      }
      const visible =
        !preview ||
        offset === 0 ||
        (showBoth ? Math.abs(offset) === 1 : offset === 1);
      slide.dataset.active = itemIndex === index ? "true" : "false";
      slide.dataset.previewVisible = String(visible);
      slide.setAttribute("aria-hidden", String(itemIndex !== index));
      slide.inert = itemIndex !== index;
      slide.style.width = `${slideWidth}px`;
      const basePosition = offset * (slideWidth + gap);
      const position = preview ? basePosition + side : basePosition;
      slide.style.transform =
        "translateX(calc(" + position + "px + " + dragOffset + "px))";
      slide.style.transition = animate ? TRANSITION_STYLE : "none";
    });
    dots.forEach((dot, dotIndex) => {
      if (dotIndex === index) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  const clearTimer = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const schedule = () => {
    clearTimer();
    if (
      !element.isConnected ||
      !options.autoplay ||
      !inViewport ||
      motion?.matches ||
      hovered ||
      document.hidden ||
      element.contains(document.activeElement) ||
      moving
    ) {
      return;
    }
    timer = setTimeout(() => move(1, false), options.interval);
  };
  const finish = () => {
    moving = false;
    clearTimeout(transitionTimer);
    render(false);
    if (announceMove && status) {
      status.textContent = announcementTemplate
        .replace(CURRENT_TOKEN, String(index + 1))
        .replace(TOTAL_TOKEN, String(count));
    }
    announceMove = false;
    schedule();
  };
  const move = (step: number, announce: boolean) => {
    if (moving) {
      return;
    }
    clearTimer();
    announceMove = announce;
    const previousIndex = index;
    index = (index + step + count) % count;
    moving = !motion?.matches && element.dataset.animation !== "false";
    const movement =
      moving && Math.abs(step) === 1
        ? { previousIndex, direction: Math.sign(step) }
        : undefined;
    render(moving, 0, movement);
    if (announce && status) {
      status.textContent = announcementTemplate
        .replace(CURRENT_TOKEN, String(index + 1))
        .replace(TOTAL_TOKEN, String(count));
    }
    if (moving) {
      transitionTimer = setTimeout(finish, TRANSITION_FALLBACK_MS);
    } else {
      schedule();
    }
  };

  element
    .querySelector<HTMLButtonElement>("[data-cylinder-prev]")
    ?.addEventListener("click", () => move(-1, true), { signal: abort.signal });
  element
    .querySelector<HTMLButtonElement>("[data-cylinder-next]")
    ?.addEventListener("click", () => move(1, true), { signal: abort.signal });
  dots.forEach((dot) => {
    if (dot instanceof HTMLButtonElement) {
      dot.addEventListener(
        "click",
        () => {
          const target = Number(dot.dataset.cylinderIndex);
          const forward = (target - index + count) % count;
          const backward = forward - count;
          move(
            Math.abs(forward) <= Math.abs(backward) ? forward : backward,
            true,
          );
        },
        { signal: abort.signal },
      );
    }
  });
  element.addEventListener(
    "pointerenter",
    () => {
      hovered = true;
      clearTimer();
    },
    { signal: abort.signal },
  );
  element.addEventListener(
    "pointerleave",
    () => {
      hovered = false;
      schedule();
    },
    { signal: abort.signal },
  );
  element.addEventListener("focusin", clearTimer, { signal: abort.signal });
  element.addEventListener("focusout", () => setTimeout(schedule), {
    signal: abort.signal,
  });
  document.addEventListener("visibilitychange", schedule, {
    signal: abort.signal,
  });
  motion?.addEventListener("change", schedule, { signal: abort.signal });
  if (options.autoplay && typeof IntersectionObserver === "function") {
    visibilityObserver = new IntersectionObserver((entries) => {
      const entry = entries.find((candidate) => candidate.target === element);
      if (!entry) {
        return;
      }
      inViewport = entry.isIntersecting && entry.intersectionRatio > 0;
      schedule();
    });
    visibilityObserver.observe(element);
  }
  if (typeof ResizeObserver === "function") {
    sizeObserver = new ResizeObserver(() => render(false));
    sizeObserver.observe(element);
  }
  element.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (element.dataset.manual !== "true") {
        return;
      }
      if (
        event.target instanceof Element &&
        event.target.closest("input,textarea,select,[contenteditable=true]")
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        move(-1, true);
      }
      if (event.key === "ArrowRight") {
        move(1, true);
      }
    },
    { signal: abort.signal },
  );
  element.addEventListener(
    "pointerdown",
    (event: PointerEvent) => {
      if (
        !event.isPrimary ||
        event.button !== 0 ||
        (event.target instanceof Element &&
          event.target.closest("a,button,input,textarea,select"))
      ) {
        return;
      }
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      window.getSelection()?.removeAllRanges();
      try {
        element.setPointerCapture?.(event.pointerId);
      } catch {
        // Synthetic events do not have an active pointer to capture.
      }
      element.dataset.dragging = "true";
      clearTimer();
    },
    { signal: abort.signal },
  );
  element.addEventListener(
    "pointermove",
    (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) {
        return;
      }
      const deltaX = event.clientX - pointer.x;
      const deltaY = event.clientY - pointer.y;
      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > SWIPE_INTENT_PX
      ) {
        event.preventDefault();
        element.dataset.swiping = "true";
        window.getSelection()?.removeAllRanges();
        render(false, deltaX);
      }
    },
    { signal: abort.signal },
  );
  element.addEventListener(
    "pointerup",
    (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) {
        return;
      }
      const deltaX = event.clientX - pointer.x;
      const deltaY = event.clientY - pointer.y;
      pointer = undefined;
      delete element.dataset.dragging;
      delete element.dataset.swiping;
      if (
        Math.abs(deltaX) > SWIPE_COMMIT_PX &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        move(deltaX < 0 ? 1 : -1, true);
      } else {
        render(true);
        schedule();
      }
    },
    { signal: abort.signal },
  );
  element.addEventListener(
    "pointercancel",
    () => {
      if (!pointer) {
        return;
      }
      pointer = undefined;
      delete element.dataset.dragging;
      delete element.dataset.swiping;
      render(true);
      schedule();
    },
    { signal: abort.signal },
  );
  window.addEventListener("resize", () => render(false), {
    signal: abort.signal,
  });
  render(false);
  const controlContainer =
    element.querySelector<HTMLElement>(".cylinder-controls");
  if (controlContainer) {
    controlContainer.hidden = false;
  }
  element.dataset.ready = "true";
  schedule();
  return () => {
    abort.abort();
    visibilityObserver?.disconnect();
    sizeObserver?.disconnect();
    clearTimer();
    clearTimeout(transitionTimer);
    delete element.dataset.dragging;
    delete element.dataset.swiping;
  };
}

class CylinderCarouselElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    this.cleanup ??= initialize(this);
  }
  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

if (!customElements.get("cylinder-carousel")) {
  customElements.define("cylinder-carousel", CylinderCarouselElement);
}

export {};
