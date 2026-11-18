// Browser-only enhancement. Keep build-time validation and image imports
// out of this module; the rendered shell already supplies validated settings.

/** Own one instance's state, event listeners, observers, and rotation timer. */
function initializeCarousel(carousel: HTMLElement): (() => void) | undefined {
  const slides = [...carousel.querySelectorAll<HTMLElement>(".carousel-slide")];
  // A single image never needs client-side carousel state.
  if (slides.length < 2) {
    return;
  }
  // Unsupported observers reveal the complete static gallery.
  if (
    typeof IntersectionObserver !== "function" ||
    typeof ResizeObserver !== "function"
  ) {
    slides.forEach((slide) => {
      slide.removeAttribute("aria-hidden");
      slide.inert = false;
    });
    return;
  }
  const controls = carousel.querySelector<HTMLElement>(".carousel-controls");
  const indicators = carousel.querySelector<HTMLElement>(".carousel-dots");
  const status = carousel.querySelector<HTMLElement>('[role="status"]');
  const dots = [...carousel.querySelectorAll<HTMLElement>(".carousel-dot")];
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const abort = new AbortController();
  const { signal } = abort;
  const autoplay = carousel.dataset.autoplay === "true";
  const manual = carousel.dataset.manual === "true";
  const interval = Number(carousel.dataset.interval);
  let currentSlide = 0;
  let inViewport = false;
  let suspended = false;
  let hovered =
    matchMedia("(hover: hover)").matches && carousel.matches(":hover");
  let timer: ReturnType<typeof setTimeout> | undefined;
  const transitionTimers = new Map<
    HTMLElement,
    ReturnType<typeof setTimeout>
  >();

  // Nonmanual instances expose a static gallery when automatic rotation
  // is unavailable, so reduced motion never strands hidden images.
  const navigable =
    manual &&
    (carousel.dataset.arrows === "true" || carousel.dataset.circles === "true");
  const shouldEnhance = () => navigable || (autoplay && !motion.matches);
  const canRotate = () =>
    shouldEnhance() &&
    autoplay &&
    !motion.matches &&
    !hovered &&
    !document.hidden &&
    inViewport &&
    !suspended &&
    !carousel.contains(document.activeElement);

  // Keep one timer; every restart/resume receives a full fresh interval.
  const reconcileRotation = () => {
    clearTimeout(timer);
    timer = undefined;
    if (!canRotate()) {
      return;
    }
    timer = setTimeout(() => {
      if (canRotate()) {
        selectSlide(currentSlide + 1);
      }
      reconcileRotation();
    }, interval);
  };

  // Apply one selection snapshot to slides, indicators and the live region.
  // Hidden slides retain sizing but cannot expose content or tab stops.
  const clearExiting = (slide: HTMLElement) => {
    const transitionTimer = transitionTimers.get(slide);
    if (transitionTimer) {
      clearTimeout(transitionTimer);
      transitionTimers.delete(slide);
    }
    slide.removeAttribute("data-exiting");
  };
  const clearTransitions = () => {
    transitionTimers.forEach((transitionTimer) =>
      clearTimeout(transitionTimer),
    );
    transitionTimers.clear();
    slides.forEach((slide) => slide.removeAttribute("data-exiting"));
  };
  const applySelection = (
    ready: boolean,
    announce = false,
    outgoingIndex?: number,
  ) => {
    const animate =
      ready &&
      carousel.dataset.animation === "true" &&
      !motion.matches &&
      outgoingIndex !== undefined &&
      outgoingIndex !== currentSlide;
    if (animate) {
      clearExiting(slides[currentSlide]);
    } else {
      clearTransitions();
    }
    slides.forEach((slide, position) => {
      const inactive = ready && position !== currentSlide;
      if (inactive) {
        slide.setAttribute("aria-hidden", "true");
      } else {
        slide.removeAttribute("aria-hidden");
      }
      slide.inert = inactive;
      if (animate && position === outgoingIndex) {
        slide.setAttribute("data-exiting", "true");
        const transitionTimer = setTimeout(() => {
          slide.removeAttribute("data-exiting");
          transitionTimers.delete(slide);
        }, 900);
        transitionTimers.set(slide, transitionTimer);
      }
    });
    dots.forEach((dot, position) => {
      if (ready && position === currentSlide) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
    if (announce && status) {
      status.textContent =
        `${carousel.dataset.itemLabel} ` +
        `${currentSlide + 1} из ${slides.length}`;
    }
  };

  // Selection owns only the current index; presentation updates reuse the same
  // snapshot so motion changes cannot leave slides and indicators out of sync.
  const selectSlide = (index: number, announce = false) => {
    const outgoingIndex = currentSlide;
    const nextSlide = (index + slides.length) % slides.length;
    if (nextSlide === currentSlide) {
      if (announce && status) {
        status.textContent =
          `${carousel.dataset.itemLabel} ` +
          `${currentSlide + 1} РёР· ${slides.length}`;
      }
      return;
    }
    currentSlide = nextSlide;
    applySelection(shouldEnhance(), announce, outgoingIndex);
  };

  // Control spacing follows actual indicator wrapping and font size.
  const reserveIndicators = () => {
    carousel.style.setProperty(
      "--indicator-height",
      `${indicators?.getBoundingClientRect().height ?? 0}px`,
    );
  };
  const updatePresentation = () => {
    const ready = shouldEnhance();
    if (ready) {
      carousel.dataset.ready = "true";
      carousel.setAttribute("aria-roledescription", "карусель");
    } else {
      delete carousel.dataset.ready;
      carousel.removeAttribute("aria-roledescription");
    }
    applySelection(ready);
    if (controls) {
      controls.hidden = !ready;
    }
    reserveIndicators();
    reconcileRotation();
  };

  // Only rendered manual buttons receive selection listeners.
  if (manual) {
    carousel
      .querySelectorAll<HTMLButtonElement>(
        ".carousel-arrow, button.carousel-dot",
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            const index = button.dataset.direction
              ? currentSlide + Number(button.dataset.direction)
              : Number(button.dataset.index);
            selectSlide(index, true);
            reconcileRotation();
          },
          { signal },
        );
      });
  }

  // Touch never latches hover; focused content is never auto-replaced.
  carousel.addEventListener(
    "pointerenter",
    (event) => {
      if (event.pointerType === "touch") {
        return;
      }
      hovered = true;
      reconcileRotation();
    },
    { signal },
  );
  carousel.addEventListener(
    "pointerleave",
    () => {
      hovered = false;
      reconcileRotation();
    },
    { signal },
  );
  carousel.addEventListener("focusin", reconcileRotation, { signal });
  carousel.addEventListener(
    "focusout",
    () => {
      queueMicrotask(() => {
        if (!signal.aborted) {
          reconcileRotation();
        }
      });
    },
    { signal },
  );
  document.addEventListener("visibilitychange", reconcileRotation, { signal });
  motion.addEventListener("change", updatePresentation, { signal });
  window.addEventListener(
    "pagehide",
    () => {
      suspended = true;
      reconcileRotation();
    },
    { signal },
  );
  window.addEventListener(
    "pageshow",
    () => {
      suspended = false;
      reconcileRotation();
    },
    { signal },
  );

  // Observe each instance independently; stop observers on disconnection.
  const visibility = new IntersectionObserver(([entry]) => {
    inViewport = entry.isIntersecting;
    reconcileRotation();
  });
  const resize = new ResizeObserver(reserveIndicators);
  const cleanup = () => {
    abort.abort();
    clearTimeout(timer);
    clearTransitions();
    visibility.disconnect();
    resize.disconnect();
    delete carousel.dataset.ready;
    carousel.removeAttribute("aria-roledescription");
    slides.forEach((slide) => {
      slide.inert = false;
      slide.removeAttribute("aria-hidden");
    });
    if (controls) {
      controls.hidden = true;
    }
  };
  // Roll back any partial initialization instead of stranding slides.
  try {
    visibility.observe(carousel);
    if (indicators) {
      resize.observe(indicators);
    }
    updatePresentation();
  } catch {
    cleanup();
    return undefined;
  }
  return cleanup;
}

// Custom-element callbacks handle DOM removal/reinsertion without coupling
// instance behavior to page-level initialization or global slide state.
class ImageCarouselElement extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    if (!this.cleanup) {
      this.cleanup = initializeCarousel(this);
    }
  }

  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

if (!customElements.get("image-carousel")) {
  customElements.define("image-carousel", ImageCarouselElement);
}

export {};
