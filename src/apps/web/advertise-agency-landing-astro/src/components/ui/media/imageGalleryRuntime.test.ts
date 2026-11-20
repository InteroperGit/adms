import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeImageGalleries } from "./imageGallery";

function renderGallery(imageCount = 3, withDialog = true): HTMLElement {
  const gallery = document.createElement("section");
  gallery.dataset.gallery = "";
  gallery.innerHTML = Array.from({ length: imageCount }, (_, index) => {
    const number = index + 1;
    const caption = index === 1 ? "Second caption" : "";

    return `<a href="/full-${number}.webp" data-gallery-open="${index}">
      <img src="/tile-${number}.webp" alt="Image ${number}"
        width="${800 + index}" height="${600 + index}"
        data-caption="${caption}">
    </a>`;
  }).join("");

  if (withDialog) {
    gallery.insertAdjacentHTML(
      "beforeend",
      `<dialog data-gallery-dialog>
        <button data-gallery-close>Close</button>
        <button data-gallery-previous>Previous</button>
        <img data-gallery-image>
        <figcaption data-gallery-caption></figcaption>
        <button data-gallery-next>Next</button>
        <p data-gallery-announcement></p>
        ${Array.from(
          { length: imageCount },
          (_, index) =>
            `<button data-gallery-lightbox-thumb="${index}"></button>`,
        ).join("")}
      </dialog>`,
    );
  }

  document.body.append(gallery);
  const dialog = gallery.querySelector<HTMLDialogElement>(
    "[data-gallery-dialog]",
  );

  if (dialog) {
    dialog.showModal = vi.fn(() => dialog.setAttribute("open", ""));
    dialog.close = vi.fn(() => {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    });
  }

  gallery
    .querySelectorAll<HTMLButtonElement>("[data-gallery-lightbox-thumb]")
    .forEach((thumbnail) => {
      thumbnail.scrollIntoView = vi.fn();
    });

  return gallery;
}

function click(element: Element): boolean {
  return element.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
}

function fullSizeUrl(index: number): string {
  return new URL(`/full-${index + 1}.webp`, document.baseURI).href;
}

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("initializeImageGalleries", () => {
  it("preserves native links when the enhancement markup is missing", () => {
    const gallery = renderGallery(2, false);
    const tile = gallery.querySelector<HTMLAnchorElement>("a");
    let preventedBeforeNavigation = true;
    document.addEventListener(
      "click",
      (event) => {
        preventedBeforeNavigation = event.defaultPrevented;
        event.preventDefault();
      },
      { capture: true, once: true },
    );
    initializeImageGalleries();

    click(tile!);
    expect(preventedBeforeNavigation).toBe(false);
    expect(tile).toHaveAttribute("href", "/full-1.webp");
    expect(document.body.style.overflow).toBe("");
  });

  it.each([0, 1, 2])("opens and synchronizes tile %i", (index) => {
    const gallery = renderGallery();
    const tiles = gallery.querySelectorAll<HTMLAnchorElement>(
      "[data-gallery-open]",
    );
    const dialog = gallery.querySelector<HTMLDialogElement>(
      "[data-gallery-dialog]",
    )!;
    const image = gallery.querySelector<HTMLImageElement>(
      "[data-gallery-image]",
    )!;
    const caption = gallery.querySelector<HTMLElement>(
      "[data-gallery-caption]",
    )!;
    const announcement = gallery.querySelector<HTMLElement>(
      "[data-gallery-announcement]",
    )!;
    initializeImageGalleries();

    expect(click(tiles[index])).toBe(false);
    expect(dialog.open).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(image).toHaveAttribute("src", fullSizeUrl(index));
    expect(image).toHaveAttribute("alt", `Image ${index + 1}`);
    expect(image).toHaveAttribute("width", `${800 + index}`);
    expect(image).toHaveAttribute("height", `${600 + index}`);
    expect(announcement.textContent).toContain(`${index + 1}`);
    expect(tiles[index]).toHaveAttribute("aria-current", "true");
    expect(tiles[(index + 1) % tiles.length]).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      gallery.querySelectorAll("[data-gallery-lightbox-thumb][aria-current]"),
    ).toHaveLength(1);

    if (index === 1) {
      expect(caption).toHaveTextContent("Second caption");
      expect(caption).not.toHaveAttribute("hidden");
    } else {
      expect(caption).toBeEmptyDOMElement();
      expect(caption).toHaveAttribute("hidden");
    }

    expect(document.activeElement).toBe(
      gallery.querySelector("[data-gallery-close]"),
    );
  });

  it("wraps directional navigation and selects thumbnails", () => {
    const gallery = renderGallery();
    const tiles = gallery.querySelectorAll<HTMLAnchorElement>(
      "[data-gallery-open]",
    );
    const image = gallery.querySelector<HTMLImageElement>(
      "[data-gallery-image]",
    )!;
    const caption = gallery.querySelector<HTMLElement>(
      "[data-gallery-caption]",
    )!;
    const thumbnails = gallery.querySelectorAll<HTMLButtonElement>(
      "[data-gallery-lightbox-thumb]",
    );
    initializeImageGalleries();
    click(tiles[0]);

    click(gallery.querySelector("[data-gallery-previous]")!);
    expect(image).toHaveAttribute("src", fullSizeUrl(2));
    expect(tiles[2]).toHaveAttribute("aria-current", "true");

    click(gallery.querySelector("[data-gallery-next]")!);
    expect(image).toHaveAttribute("src", fullSizeUrl(0));

    click(thumbnails[1]);
    expect(image).toHaveAttribute("src", fullSizeUrl(1));
    expect(caption).toHaveTextContent("Second caption");
    expect(thumbnails[1]).toHaveAttribute("aria-current", "true");
    expect(tiles[1]).toHaveAttribute("aria-current", "true");
  });

  it.each(["button", "backdrop", "escape"] as const)(
    "restores focus and scroll after %s close",
    (method) => {
      const gallery = renderGallery();
      const opener = gallery.querySelector<HTMLAnchorElement>(
        '[data-gallery-open="1"]',
      )!;
      const dialog = gallery.querySelector<HTMLDialogElement>(
        "[data-gallery-dialog]",
      )!;
      document.body.style.overflow = "auto";
      initializeImageGalleries();
      click(opener);

      if (method === "button") {
        click(gallery.querySelector("[data-gallery-close]")!);
      } else if (method === "backdrop") {
        dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      } else {
        const cancel = new Event("cancel", { cancelable: true });
        dialog.dispatchEvent(cancel);
        expect(cancel.defaultPrevented).toBe(true);
      }

      expect(dialog.open).toBe(false);
      expect(document.body.style.overflow).toBe("auto");
      expect(document.activeElement).toBe(opener);
    },
  );

  it("opens a single image without directional controls", () => {
    const gallery = renderGallery(1);
    gallery.querySelector("[data-gallery-previous]")?.remove();
    gallery.querySelector("[data-gallery-next]")?.remove();
    gallery
      .querySelectorAll("[data-gallery-lightbox-thumb]")
      .forEach((item) => {
        item.remove();
      });
    initializeImageGalleries();
    const dialog = gallery.querySelector<HTMLDialogElement>(
      "[data-gallery-dialog]",
    )!;

    expect(gallery.querySelector("[data-gallery-previous]")).toBeNull();
    expect(gallery.querySelector("[data-gallery-next]")).toBeNull();
    click(gallery.querySelector("a")!);
    expect(dialog.open).toBe(true);
  });

  it("wraps forward and backward Tab at the dialog boundaries", () => {
    const gallery = renderGallery();
    const dialog = gallery.querySelector<HTMLDialogElement>(
      "[data-gallery-dialog]",
    )!;
    const close = gallery.querySelector<HTMLButtonElement>(
      "[data-gallery-close]",
    )!;
    const last = gallery.querySelector<HTMLButtonElement>(
      '[data-gallery-lightbox-thumb="2"]',
    )!;
    initializeImageGalleries();
    click(gallery.querySelector("a")!);

    last.focus();
    const forward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    dialog.dispatchEvent(forward);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(close);

    const backward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
      shiftKey: true,
    });
    dialog.dispatchEvent(backward);
    expect(backward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it("uses arrow keys to move between images", () => {
    const gallery = renderGallery();
    const dialog = gallery.querySelector<HTMLDialogElement>(
      "[data-gallery-dialog]",
    )!;
    const image = gallery.querySelector<HTMLImageElement>(
      "[data-gallery-image]",
    )!;
    initializeImageGalleries();
    click(gallery.querySelector("a")!);

    const next = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
      cancelable: true,
    });
    dialog.dispatchEvent(next);
    expect(next.defaultPrevented).toBe(true);
    expect(image).toHaveAttribute("src", fullSizeUrl(1));

    const previous = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
      bubbles: true,
      cancelable: true,
    });
    dialog.dispatchEvent(previous);
    expect(previous.defaultPrevented).toBe(true);
    expect(image).toHaveAttribute("src", fullSizeUrl(0));
  });

  it("initializes a fresh gallery after the previous DOM is removed", () => {
    const first = renderGallery();
    initializeImageGalleries();
    document.body.replaceChildren();

    const second = renderGallery(1);
    initializeImageGalleries();
    const dialog = second.querySelector<HTMLDialogElement>(
      "[data-gallery-dialog]",
    )!;

    click(second.querySelector("a")!);
    expect(dialog.open).toBe(true);
    expect(first.isConnected).toBe(false);
  });
});
