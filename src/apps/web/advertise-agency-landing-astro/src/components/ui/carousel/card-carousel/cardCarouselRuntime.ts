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

  const scrollToEdge = (edge: "start" | "end") => {
    const left =
      edge === "start" ? 0 : viewport.scrollWidth - viewport.clientWidth;
    viewport.scrollTo({
      left,
      behavior: motion.matches ? "auto" : "smooth",
    });
  };

  const handleViewportKeydown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      scrollToEdge(event.key === "Home" ? "start" : "end");
    }
  };

  let activePointerId: number | null = null;
  let pointerStartY = 0;
  let pointerStartX = 0;
  let scrollStartLeft = 0;
  let didDrag = false;
  let isTouchDragging = false;
  let suppressNextClick = false;

  const startPointerDrag = (event: PointerEvent) => {
    if (
      (event.pointerType !== "mouse" && event.pointerType !== "touch") ||
      event.button !== 0
    ) {
      return;
    }

    activePointerId = event.pointerId;
    pointerStartY = event.clientY;
    pointerStartX = event.clientX;
    scrollStartLeft = viewport.scrollLeft;
    didDrag = false;
    isTouchDragging = false;
    suppressNextClick = false;
    viewport.classList.add("is-dragging");
    if (event.pointerType === "mouse") {
      viewport.classList.add("is-mouse-pressed");
    }
  };

  const movePointerDrag = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    const distance = event.clientX - pointerStartX;
    const verticalDistance = event.clientY - pointerStartY;
    if (
      event.pointerType === "touch" &&
      !isTouchDragging &&
      (Math.abs(distance) < MOUSE_DRAG_THRESHOLD_PX ||
        Math.abs(distance) < Math.abs(verticalDistance))
    ) {
      return;
    }
    if (
      event.pointerType === "mouse" &&
      Math.abs(distance) < MOUSE_DRAG_THRESHOLD_PX
    ) {
      return;
    }

    isTouchDragging ||= event.pointerType === "touch";
    didDrag = Math.abs(distance) >= MOUSE_DRAG_THRESHOLD_PX;
    viewport.scrollLeft = scrollStartLeft - distance;
    event.preventDefault();
  };

  const finishPointerDrag = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    activePointerId = null;
    isTouchDragging = false;
    viewport.classList.remove("is-dragging");
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
  viewport.addEventListener("keydown", handleViewportKeydown, { signal });
  viewport.addEventListener("pointerdown", startPointerDrag, { signal });
  window.addEventListener("pointermove", movePointerDrag, { signal });
  window.addEventListener("pointerup", finishPointerDrag, { signal });
  window.addEventListener("pointercancel", finishPointerDrag, { signal });
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
