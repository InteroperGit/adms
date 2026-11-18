// Keep every offer card on one track for navigation and pointer swipes.

function initializeCarousel(element: HTMLElement): (() => void) | undefined {
  const track = element.querySelector<HTMLElement>(".offers-track");
  const slots = track?.querySelectorAll<HTMLElement>(".offers-track-slot");
  const controls = element.querySelector<HTMLElement>(".carousel-controls");
  const arrows = element.querySelectorAll<HTMLButtonElement>(".carousel-arrow");
  const dots = element.querySelectorAll<HTMLButtonElement>(".carousel-dot");
  const status = element.querySelector<HTMLElement>('[role="status"]');
  const count = Number(element.dataset.count);
  const hasTrack = track !== null;
  const hasTrackSlots = slots !== undefined && slots.length >= 3;
  const hasMultipleOffers = count > 1;
  const canInitializeOffersCarousel =
    hasTrack && hasTrackSlots && hasMultipleOffers;
  if (!canInitializeOffersCarousel) {
    return;
  }

  const abort = new AbortController();
  const { signal } = abort;
  const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const autoplay = element.dataset.autoplay === "true";
  const interval = Number(element.dataset.interval) || 7000;
  let index = 0;
  let targetIndex = 0;
  let stepIndex = 0;
  let preferredDirection: 1 | -1 | undefined;
  let announce = false;
  let settling = false;
  let pointerStart: { id: number; x: number; y: number } | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;
  let recenterTimer: ReturnType<typeof setTimeout> | undefined;
  let recenterFrame: number | undefined;
  let hovered = element.matches(":hover");

  const render = (activeIndex: number) => {
    slots.forEach((slot) => {
      const offset = Number(slot.dataset.trackOffset);
      const itemIndex = (activeIndex + offset + count) % count;
      const active = offset === 0;
      slot.toggleAttribute("data-active", active);
      slot.inert = !active;
      if (active) {
        slot.id = "offers-carousel-active";
        slot.removeAttribute("aria-hidden");
        slot.setAttribute(
          "aria-label",
          `Предложение ${itemIndex + 1} из ${count}`,
        );
      } else {
        slot.removeAttribute("id");
        slot.setAttribute("aria-hidden", "true");
        slot.setAttribute(
          "aria-label",
          `Предпросмотр предложения ${itemIndex + 1}`,
        );
      }
      slot
        .querySelectorAll<HTMLElement>("[data-track-index]")
        .forEach((card, cardIndex) => {
          card.hidden = cardIndex !== itemIndex;
        });
    });
    dots.forEach((dot, dotIndex) => {
      if (activeIndex === dotIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  const clearAutoplay = () => {
    clearTimeout(timer);
    timer = undefined;
  };

  const scheduleAutoplay = () => {
    clearAutoplay();
    if (
      !autoplay ||
      motion?.matches ||
      hovered ||
      document.hidden ||
      element.contains(document.activeElement) ||
      settling
    ) {
      return;
    }
    timer = setTimeout(() => moveTo((index + 1) % count, false), interval);
  };

  const completeMove = () => {
    settling = false;
    delete element.dataset.settling;
    delete element.dataset.recentering;
    element.style.removeProperty("--offers-drag-offset");
    if (announce && status) {
      status.textContent = `Предложение ${index + 1} из ${count}`;
    }
    announce = false;
    preferredDirection = undefined;
    scheduleAutoplay();
  };

  const finishStep = () => {
    if (!settling) {
      return;
    }
    clearTimeout(transitionTimer);
    transitionTimer = undefined;
    index = stepIndex;
    render(index);
    element.dataset.recentering = "true";
    element.style.setProperty("--offers-drag-offset", "0px");
    const afterRecenter = () => {
      delete element.dataset.recentering;
      if (index !== targetIndex) {
        moveOneStep();
      } else {
        completeMove();
      }
    };
    if (typeof requestAnimationFrame === "function") {
      recenterFrame = requestAnimationFrame(() => {
        recenterFrame = undefined;
        afterRecenter();
      });
    } else {
      recenterTimer = setTimeout(() => {
        recenterTimer = undefined;
        afterRecenter();
      });
    }
  };

  const moveOneStep = () => {
    if (index === targetIndex) {
      completeMove();
      return;
    }
    const forward = (targetIndex - index + count) % count;
    const backward = (index - targetIndex + count) % count;
    const direction = preferredDirection ?? (forward <= backward ? 1 : -1);
    preferredDirection = undefined;
    stepIndex = (index + direction + count) % count;

    if (motion?.matches || element.dataset.animation === "false") {
      index = stepIndex;
      render(index);
      moveOneStep();
      return;
    }

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const width = slots[2].getBoundingClientRect().width;
    settling = true;
    element.dataset.settling = "true";
    element.style.setProperty(
      "--offers-drag-offset",
      `${direction > 0 ? -(width + gap) : width + gap}px`,
    );
    transitionTimer = setTimeout(finishStep, 520);
  };

  function moveTo(
    nextIndex: number,
    shouldAnnounce: boolean,
    direction?: 1 | -1,
  ) {
    clearAutoplay();
    targetIndex = (nextIndex + count) % count;
    announce = shouldAnnounce;
    preferredDirection = direction;
    if (targetIndex === index) {
      completeMove();
      return;
    }
    moveOneStep();
  }

  track.addEventListener(
    "transitionend",
    (event: TransitionEvent) => {
      if (
        event.target === track &&
        event.propertyName === "transform" &&
        settling
      ) {
        finishStep();
      }
    },
    { signal },
  );

  arrows.forEach((arrow) => {
    arrow.addEventListener(
      "click",
      () => {
        if (settling) {
          return;
        }
        const direction = Number(arrow.dataset.direction);
        const step = direction > 0 ? 1 : -1;
        moveTo(index + step, true, step);
      },
      { signal },
    );
  });

  dots.forEach((dot) => {
    dot.addEventListener(
      "click",
      () => {
        if (!settling) {
          moveTo(Number(dot.dataset.index), true);
        }
      },
      { signal },
    );
  });

  element.addEventListener(
    "pointerenter",
    () => {
      hovered = true;
      clearAutoplay();
    },
    { signal },
  );
  element.addEventListener(
    "pointerleave",
    () => {
      hovered = false;
      scheduleAutoplay();
    },
    { signal },
  );
  element.addEventListener("focusin", clearAutoplay, { signal });
  element.addEventListener("focusout", () => setTimeout(scheduleAutoplay), {
    signal,
  });
  document.addEventListener("visibilitychange", scheduleAutoplay, { signal });
  motion?.addEventListener("change", scheduleAutoplay, { signal });

  element.addEventListener(
    "pointerdown",
    (event: PointerEvent) => {
      const targetIsInteractive =
        event.target instanceof Element &&
        Boolean(event.target.closest("a, button, input, select, textarea"));
      const canStartPointerDrag =
        !settling &&
        event.isPrimary &&
        event.button === 0 &&
        !targetIsInteractive;
      if (!canStartPointerDrag) {
        pointerStart = undefined;
        return;
      }
      pointerStart = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      try {
        element.setPointerCapture?.(event.pointerId);
      } catch {
        // Synthetic pointer events have no active pointer to capture.
      }
      element.dataset.dragging = "true";
      element.style.setProperty("--offers-drag-offset", "0px");
      clearAutoplay();
    },
    { signal },
  );
  element.addEventListener(
    "pointermove",
    (event: PointerEvent) => {
      const start = pointerStart;
      if (!start || start.id !== event.pointerId) {
        return;
      }
      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }
      event.preventDefault();
      element.style.setProperty("--offers-drag-offset", `${deltaX}px`);
      if (Math.abs(deltaX) >= 12) {
        element.dataset.swiping = "true";
        window.getSelection()?.removeAllRanges();
      }
    },
    { signal },
  );
  element.addEventListener(
    "pointerup",
    (event: PointerEvent) => {
      const start = pointerStart;
      pointerStart = undefined;
      if (!start || start.id !== event.pointerId) {
        return;
      }
      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      delete element.dataset.dragging;
      delete element.dataset.swiping;
      if (Math.abs(deltaX) < 12 || Math.abs(deltaX) <= Math.abs(deltaY)) {
        element.style.removeProperty("--offers-drag-offset");
        scheduleAutoplay();
        return;
      }
      moveTo(index + (deltaX < 0 ? 1 : -1), true, deltaX < 0 ? 1 : -1);
    },
    { signal },
  );
  element.addEventListener(
    "pointercancel",
    () => {
      if (!pointerStart) {
        return;
      }
      pointerStart = undefined;
      delete element.dataset.dragging;
      delete element.dataset.swiping;
      element.style.setProperty("--offers-drag-offset", "0px");
      scheduleAutoplay();
    },
    { signal },
  );

  render(index);
  if (controls) {
    controls.hidden = false;
  }
  element.dataset.ready = "true";
  scheduleAutoplay();
  return () => {
    abort.abort();
    clearAutoplay();
    clearTimeout(transitionTimer);
    clearTimeout(recenterTimer);
    if (recenterFrame !== undefined) {
      cancelAnimationFrame(recenterFrame);
    }
    delete element.dataset.ready;
    delete element.dataset.dragging;
    delete element.dataset.swiping;
    delete element.dataset.settling;
    delete element.dataset.recentering;
    element.style.removeProperty("--offers-drag-offset");
  };
}

class OffersImageCarouselElement extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    this.cleanup ??= initializeCarousel(this);
  }

  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

if (!customElements.get("offers-image-carousel")) {
  customElements.define("offers-image-carousel", OffersImageCarouselElement);
}

export {};
