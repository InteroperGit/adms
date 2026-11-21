// Add manual controls only when the caller's cards overflow their viewport.
const SCROLL_TOLERANCE_PX = 1;
const MOUSE_DRAG_THRESHOLD_PX = 4;

function initializeCardCarousel(carousel: HTMLElement) {
  const viewport = carousel.querySelector<HTMLElement>(
    ".card-carousel-viewport",
  );
  const track = carousel.querySelector<HTMLElement>(".card-carousel-track");
  const controls = carousel.querySelector<HTMLElement>(
    ".card-carousel-controls",
  );
  const previous = carousel.querySelector<HTMLButtonElement>(
    '[data-direction="-1"]',
  );
  const next = carousel.querySelector<HTMLButtonElement>(
    '[data-direction="1"]',
  );

  if (!viewport || !track || !controls || !previous || !next) {
    return;
  }

  const cards = [...track.children];
  if (cards.length < 2) {
    return;
  }

  const abort = new AbortController();
  const { signal } = abort;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateControls = () => {
    const maximumScroll = viewport.scrollWidth - viewport.clientWidth;
    const overflows = maximumScroll > SCROLL_TOLERANCE_PX;
    controls.hidden = !overflows;
    previous.disabled =
      !overflows || viewport.scrollLeft <= SCROLL_TOLERANCE_PX;
    next.disabled =
      !overflows || viewport.scrollLeft >= maximumScroll - SCROLL_TOLERANCE_PX;
  };

  const scrollByCard = (direction: -1 | 1) => {
    const firstCard = cards[0] as HTMLElement;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;
    viewport.scrollBy({
      left: direction * distance,
      behavior: motion.matches ? "auto" : "smooth",
    });
  };

  let activePointerId: number | null = null;
  let pointerStartX = 0;
  let scrollStartLeft = 0;
  let didDrag = false;
  let suppressNextClick = false;

  const startMouseDrag = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    activePointerId = event.pointerId;
    pointerStartX = event.clientX;
    scrollStartLeft = viewport.scrollLeft;
    didDrag = false;
    suppressNextClick = false;
    viewport.classList.add("is-mouse-pressed");
  };

  const moveMouseDrag = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    const distance = event.clientX - pointerStartX;
    if (Math.abs(distance) < MOUSE_DRAG_THRESHOLD_PX) {
      return;
    }

    didDrag = true;
    viewport.scrollLeft = scrollStartLeft - distance;
    event.preventDefault();
  };

  const finishMouseDrag = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    activePointerId = null;
    viewport.classList.remove("is-mouse-pressed");
    suppressNextClick = didDrag;
    didDrag = false;
  };

  const suppressDragClick = (event: MouseEvent) => {
    if (!suppressNextClick) {
      return;
    }

    suppressNextClick = false;
    event.preventDefault();
    event.stopPropagation();
  };

  previous.addEventListener("click", () => scrollByCard(-1), { signal });
  next.addEventListener("click", () => scrollByCard(1), { signal });
  viewport.addEventListener("pointerdown", startMouseDrag, { signal });
  window.addEventListener("pointermove", moveMouseDrag, { signal });
  window.addEventListener("pointerup", finishMouseDrag, { signal });
  window.addEventListener("pointercancel", finishMouseDrag, { signal });
  viewport.addEventListener("click", suppressDragClick, {
    capture: true,
    signal,
  });
  viewport.addEventListener("scroll", updateControls, { signal });
  window.addEventListener("resize", updateControls, { signal });
  motion.addEventListener("change", updateControls, { signal });

  let resizeObserver: ResizeObserver | undefined;
  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
  }

  window.addEventListener(
    "pagehide",
    () => {
      abort.abort();
      resizeObserver?.disconnect();
    },
    { once: true },
  );
  updateControls();
}

export function initializeCardCarousels() {
  document
    .querySelectorAll<HTMLElement>(".card-carousel")
    .forEach(initializeCardCarousel);
}

export { initializeCardCarousel };
