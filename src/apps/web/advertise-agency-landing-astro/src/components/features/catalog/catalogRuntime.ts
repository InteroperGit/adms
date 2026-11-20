// Enhance the static catalogue with filtering, URL state and pagination.

import { getPaginationItems } from "@/components/ui/pagination/pagination";

const SEARCH_DELAY = 250;
/** Normalize Russian text while preserving useful word boundaries. */
export function normalizeSearch(value: string): string {
  return value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ")
    .trim();
}

/** Return true when every entered word appears in the searchable text. */
export function matchesSearch(text: string, query: string): boolean {
  const normalizedText = normalizeSearch(text);
  const words = normalizeSearch(query).split(" ").filter(Boolean);
  return words.every((word) => normalizedText.includes(word));
}

interface CatalogElements {
  root: HTMLElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  category: HTMLSelectElement;
  cards: HTMLElement[];
  count: HTMLElement;
  countValue: HTMLElement;
  empty: HTMLElement;
  reset: HTMLButtonElement;
  pagination: HTMLElement;
  pages: HTMLElement;
  pageSize: number;
  basePath: string;
  /** Cancel superseded input when a visitor commits another navigation. */
  searchTimer?: number;
}

export interface CatalogRecord {
  category: string;
  searchText: string;
}

/** Select matching records without depending on a browser or the DOM. */
export function filterCatalog(
  records: CatalogRecord[],
  query: string,
  selectedCategory: string,
): CatalogRecord[] {
  return records.filter((record) => {
    const matchesCategory =
      !selectedCategory || record.category === selectedCategory;
    return matchesCategory && matchesSearch(record.searchText, query);
  });
}

function getElements(): CatalogElements | undefined {
  const root = document.querySelector<HTMLElement>("[data-catalog]");
  if (!root) {
    return undefined;
  }
  const form = root.querySelector<HTMLFormElement>("[data-catalog-controls]");
  const input = root.querySelector<HTMLInputElement>('input[name="q"]');
  const category = root.querySelector<HTMLSelectElement>(
    'select[name="category"]',
  );
  const count = root.querySelector<HTMLElement>("[data-catalog-count]");
  const countValue = root.querySelector<HTMLElement>(
    "[data-catalog-count-value]",
  );
  const empty = root.querySelector<HTMLElement>("[data-catalog-search-empty]");
  const reset = root.querySelector<HTMLButtonElement>("[data-catalog-reset]");
  const pagination = root.querySelector<HTMLElement>(
    "[data-catalog-pagination]",
  );
  const pages = root.querySelector<HTMLElement>("[data-catalog-pages]");
  const rawPageSize = root.dataset.catalogPageSize;
  const pageSize = Number(rawPageSize);
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>("[data-catalog-item]"),
  );
  if (
    !form ||
    !input ||
    !category ||
    !count ||
    !countValue ||
    !empty ||
    !reset ||
    !pagination ||
    !pages ||
    !Number.isInteger(pageSize) ||
    pageSize < 1
  ) {
    return undefined;
  }
  return {
    root,
    form,
    input,
    category,
    cards,
    count,
    countValue,
    empty,
    reset,
    pagination,
    pages,
    pageSize,
    basePath: root.dataset.catalogBasePath ?? "/projects/",
  };
}

function readState(basePath: string): {
  query: string;
  category: string;
  page: number;
} {
  const params = new URLSearchParams(window.location.search);
  const pagePrefix = `${basePath}page/`;
  const routeSuffix = window.location.pathname.startsWith(pagePrefix)
    ? window.location.pathname.slice(pagePrefix.length)
    : "";
  const routePage = routeSuffix.match(/^(\d+)\/?$/)?.[1];
  const rawPage = routePage ?? params.get("page") ?? "";
  const parsedPage = /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  return {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "",
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
}

function writeState(
  elements: CatalogElements,
  page: number,
  mode: "push" | "replace",
): void {
  const params = new URLSearchParams(window.location.search);
  params.delete("q");
  params.delete("category");
  params.delete("page");
  const query = elements.input.value.trim();
  if (query) params.set("q", query);
  if (elements.category.value) params.set("category", elements.category.value);
  const path =
    page > 1 ? `${elements.basePath}page/${page}/` : elements.basePath;
  const suffix = params.toString();
  const hash = window.location.hash;
  const url = `${path}${suffix ? `?${suffix}` : ""}${hash}`;
  const current = `${window.location.pathname}${window.location.search}${hash}`;
  if (url === current) return;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

function renderPagination(
  elements: CatalogElements,
  current: number,
  total: number,
): void {
  elements.pages.replaceChildren();
  elements.pagination.hidden = total <= 1;
  if (total <= 1) return;
  const add = (
    label: string,
    page: number,
    disabled = false,
    accessibleLabel = label,
  ) => {
    const link = document.createElement("a");
    link.className =
      label === "←" || label === "→"
        ? "catalog-pagination__link catalog-pagination__direction"
        : "catalog-pagination__link";
    link.textContent = label;
    link.setAttribute("aria-label", accessibleLabel);
    link.setAttribute("aria-disabled", String(disabled));
    link.href = pageUrl(elements, page);
    if (page === current && !disabled) {
      link.setAttribute("aria-current", "page");
    }
    if (disabled) link.tabIndex = -1;
    link.addEventListener("click", (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      // Modified clicks keep native new-tab/window behavior and link URLs.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      update(elements, page, true, true);
    });
    elements.pages.append(link);
  };
  add("←", Math.max(1, current - 1), current === 1, "Previous page");
  for (const page of getPaginationItems(total, current)) {
    if (page === "ellipsis") {
      const ellipsis = document.createElement("span");
      ellipsis.className = "catalog-pagination__ellipsis";
      ellipsis.textContent = "…";
      ellipsis.setAttribute("aria-hidden", "true");
      elements.pages.append(ellipsis);
      continue;
    }
    const pageLabel =
      page === 1 ? "First page" : page === total ? "Last page" : `Page ${page}`;
    add(String(page), page, false, pageLabel);
  }
  add("→", Math.min(total, current + 1), current === total, "Next page");
}

function pageUrl(elements: CatalogElements, page: number): string {
  const params = new URLSearchParams(window.location.search);
  params.delete("q");
  params.delete("category");
  params.delete("page");
  const query = elements.input.value.trim();
  if (query) params.set("q", query);
  if (elements.category.value) params.set("category", elements.category.value);
  const path =
    page > 1 ? `${elements.basePath}page/${page}/` : elements.basePath;
  const suffix = params.toString();
  return `${path}${suffix ? `?${suffix}` : ""}` + window.location.hash;
}

/** Apply filters and show only the requested page of matching cards. */
function applyFilters(
  elements: CatalogElements,
  requestedPage: number,
): number {
  const records = elements.cards.map((card) => ({
    category: card.dataset.category ?? "",
    searchText: card.dataset.search ?? "",
  }));
  const matching = filterCatalog(
    records,
    elements.input.value,
    elements.category.value,
  );
  const total = Math.max(1, Math.ceil(matching.length / elements.pageSize));
  const page = Math.min(Math.max(requestedPage, 1), total);
  const start = (page - 1) * elements.pageSize;
  elements.cards.forEach((card, index) => {
    const matchIndex = matching.indexOf(records[index]);
    card.hidden = matchIndex < start || matchIndex >= start + elements.pageSize;
  });
  elements.countValue.textContent = String(matching.length);
  elements.empty.hidden = matching.length !== 0 || elements.cards.length === 0;
  renderPagination(elements, page, total);
  return page;
}

function update(
  elements: CatalogElements,
  page: number,
  push: boolean,
  moveFocus = false,
): void {
  // Explicit actions supersede pending input so it cannot reset their page.
  window.clearTimeout(elements.searchTimer);
  elements.searchTimer = undefined;
  const actualPage = applyFilters(elements, page);
  writeState(elements, actualPage, push ? "push" : "replace");
  if (moveFocus) {
    elements.root.querySelector<HTMLElement>("[data-catalog-results]")?.focus();
  }
}

/** Install progressive enhancement without changing the no-JS HTML. */
function initializeCatalog(): void {
  const elements = getElements();
  if (!elements) return;
  elements.form.hidden = false;
  const state = readState(elements.basePath);
  elements.input.value = state.query;
  elements.category.value = state.category;
  const resetPage = (push: boolean) => update(elements, 1, push);
  elements.input.addEventListener("input", () => {
    window.clearTimeout(elements.searchTimer);
    elements.searchTimer = window.setTimeout(
      () => resetPage(false),
      SEARCH_DELAY,
    );
  });
  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    resetPage(true);
  });
  elements.category.addEventListener("change", () => resetPage(true));
  elements.reset.addEventListener("click", () => {
    elements.input.value = "";
    elements.category.value = "";
    resetPage(true);
    elements.input.focus();
  });
  window.addEventListener("popstate", () => {
    // Restored history wins over input scheduled on the page being left.
    window.clearTimeout(elements.searchTimer);
    elements.searchTimer = undefined;
    const next = readState(elements.basePath);
    elements.input.value = next.query;
    elements.category.value = next.category;
    applyFilters(elements, next.page);
  });
  const actualPage = applyFilters(elements, state.page);
  if (state.category !== elements.category.value || actualPage !== state.page) {
    writeState(elements, actualPage, "replace");
  }
}

if (typeof document !== "undefined") initializeCatalog();
