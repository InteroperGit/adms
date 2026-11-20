// Enhance native gallery links with modal navigation and focus restoration.

interface GalleryItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

const slideClasses = ["gallery-image-slide-left", "gallery-image-slide-right"];

// Cache full-size resources and intrinsic dimensions from the static tiles.
function readItem(tile: HTMLAnchorElement): GalleryItem {
  const source = tile.querySelector<HTMLImageElement>("img");

  return {
    src: tile.href,
    alt: source?.alt ?? "",
    width: Number(source?.getAttribute("width")) || 0,
    height: Number(source?.getAttribute("height")) || 0,
    caption: source?.dataset.caption || undefined,
  };
}

// Keep tiles and modal thumbnails in sync without leaving false attributes.
function markCurrent(elements: HTMLElement[], currentIndex: number): void {
  elements.forEach((element, index) => {
    if (index === currentIndex) {
      element.setAttribute("aria-current", "true");
    } else {
      element.removeAttribute("aria-current");
    }
  });
}

// Wrap Tab explicitly so the native dialog keeps a predictable focus order.
function wrapFocus(dialog: HTMLDialogElement, event: KeyboardEvent): void {
  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not([hidden]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled"));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const target = event.shiftKey ? last : first;
  const boundary = event.shiftKey ? first : last;

  if (target && document.activeElement === boundary) {
    event.preventDefault();
    target.focus();
  }
}

// Leave native image links intact if the required modal markup is missing.
function initializeGallery(gallery: HTMLElement): void {
  const tiles = Array.from(
    gallery.querySelectorAll<HTMLAnchorElement>("[data-gallery-open]"),
  );
  const dialog = gallery.querySelector<HTMLDialogElement>(
    "[data-gallery-dialog]",
  );
  const image = gallery.querySelector<HTMLImageElement>("[data-gallery-image]");
  const caption = gallery.querySelector<HTMLElement>("[data-gallery-caption]");
  const announcement = gallery.querySelector<HTMLElement>(
    "[data-gallery-announcement]",
  );
  const thumbnails = Array.from(
    gallery.querySelectorAll<HTMLButtonElement>(
      "[data-gallery-lightbox-thumb]",
    ),
  );
  const closeButton = gallery.querySelector<HTMLButtonElement>(
    "[data-gallery-close]",
  );
  const previousButton = gallery.querySelector<HTMLButtonElement>(
    "[data-gallery-previous]",
  );
  const nextButton = gallery.querySelector<HTMLButtonElement>(
    "[data-gallery-next]",
  );

  if (
    !dialog ||
    !image ||
    !caption ||
    !announcement ||
    !closeButton ||
    tiles.length === 0
  ) {
    return;
  }

  const items = tiles.map(readItem);
  let currentIndex = 0;
  let opener: HTMLElement | null = null;
  let previousOverflow = "";

  // Scroll only after opening: a closed dialog has no thumbnail geometry.
  const revealThumbnail = (): void => {
    if (dialog.open) {
      thumbnails[currentIndex]?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  // Update the viewer, accessible selection and animation in one place.
  const showImage = (index: number): void => {
    const previousIndex = currentIndex;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];

    image.src = item.src;
    image.alt = item.alt;
    image.width = item.width;
    image.height = item.height;
    caption.textContent = item.caption ?? "";
    caption.hidden = !item.caption;
    const position = currentIndex + 1;
    announcement.textContent = `Изображение ${position} из ${items.length}`;
    markCurrent(tiles, currentIndex);
    markCurrent(thumbnails, currentIndex);
    revealThumbnail();

    // Restart the CSS transition even when selecting the same image again.
    image.classList.remove(...slideClasses);
    void image.offsetWidth;
    image.classList.add(slideClasses[currentIndex >= previousIndex ? 0 : 1]);
  };

  // Remember the actual clicked tile, including browsers that do not focus it.
  const openGallery = (index: number, tile: HTMLElement): void => {
    opener = tile;
    showImage(index);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    revealThumbnail();
    closeButton.focus();
  };

  const closeGallery = (): void => {
    if (dialog.open) {
      dialog.close();
    }
  };

  // The static image count determines whether directional controls are useful.
  if (previousButton) previousButton.hidden = items.length < 2;
  if (nextButton) nextButton.hidden = items.length < 2;
  tiles.forEach((tile, index) => {
    tile.addEventListener("click", (event) => {
      event.preventDefault();
      openGallery(index, tile);
    });
  });
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => showImage(index));
  });
  closeButton.addEventListener("click", closeGallery);
  previousButton?.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton?.addEventListener("click", () => showImage(currentIndex + 1));

  // Pointer activation must not leave a sticky focus highlight on controls.
  [closeButton, previousButton, nextButton].forEach((button) => {
    if (!button) return;
    button.addEventListener("pointerup", () => button.blur());
  });

  // Closing by button, backdrop or Escape shares the same cleanup path.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeGallery();
    }
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeGallery();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus();
    opener = null;
  });
  dialog.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "Tab":
        wrapFocus(dialog, event);
        break;
      case "ArrowLeft":
        if (items.length > 1) {
          event.preventDefault();
          showImage(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        if (items.length > 1) {
          event.preventDefault();
          showImage(currentIndex + 1);
        }
        break;
    }
  });
}

// Astro bundles this entry once; each gallery keeps its own modal state.
export function initializeImageGalleries(): void {
  document
    .querySelectorAll<HTMLElement>("[data-gallery]")
    .forEach(initializeGallery);
}
