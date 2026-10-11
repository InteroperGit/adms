// Enhance the static catalogue with filtering, URL state and pagination.

const SEARCH_DELAY = 250;
/** Normalize Russian text while preserving useful word boundaries. */
export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('ru-RU').replace(/С‘/g, 'Рµ')
    .replace(/\s+/g, ' ').trim();
}

/** Return true when every entered word appears in the searchable text. */
export function matchesSearch(text: string, query: string): boolean {
  const normalizedText = normalizeSearch(text);
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  return words.every((word) => normalizedText.includes(word));
}

interface CatalogElements {
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
}

export interface CatalogRecord {
  category: string;
  searchText: string;
}

/** Select matching records without depending on a browser or the DOM. */
export function filterCatalog(
  records: CatalogRecord[], query: string, selectedCategory: string,
): CatalogRecord[] {
  return records.filter((record) => {
    const matchesCategory = !selectedCategory ||
      record.category === selectedCategory;
    return matchesCategory && matchesSearch(record.searchText, query);
  });
}

function getElements(): CatalogElements | undefined {
  const form = document.querySelector<HTMLFormElement>(
    '[data-catalog-controls]',
  );
  const input = document.querySelector<HTMLInputElement>('#project-search');
  const category = document.querySelector<HTMLSelectElement>(
    '#project-category',
  );
  const count = document.querySelector<HTMLElement>('[data-catalog-count]');
  const countValue = document.querySelector<HTMLElement>(
    '[data-catalog-count-value]',
  );
  const empty = document.querySelector<HTMLElement>(
    '[data-catalog-search-empty]',
  );
  const reset = document.querySelector<HTMLButtonElement>(
    '[data-catalog-reset]',
  );
  const pagination = document.querySelector<HTMLElement>(
    '[data-catalog-pagination]',
  );
  const pages = document.querySelector<HTMLElement>('[data-catalog-pages]');
  const rawPageSize = pagination?.dataset.pageSize;
  const pageSize = Number(rawPageSize);
  const cards = Array.from(document.querySelectorAll<HTMLElement>(
    '[data-project-card]',
  ));
  if (!form || !input || !category || !count || !countValue || !empty ||
    !reset ||
    !pagination || !pages || !Number.isInteger(pageSize) || pageSize < 1) {
    return undefined;
  }
  return {
    form, input, category, cards, count, countValue, empty, reset,
    pagination, pages,
    pageSize,
  };
}

function readState(): { query: string; category: string; page: number } {
  const params = new URLSearchParams(window.location.search);
  const rawPage = params.get('page') ?? '';
  const parsedPage = /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  return { query: params.get('q') ?? '', category: params.get('category') ?? '',
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1 };
}

function writeState(elements: CatalogElements, page: number,
  mode: 'push' | 'replace'): void {
  const params = new URLSearchParams(window.location.search);
  params.delete('q');
  params.delete('category');
  params.delete('page');
  const query = elements.input.value.trim();
  if (query) params.set('q', query);
  if (elements.category.value) params.set('category', elements.category.value);
  if (page > 1) params.set('page', String(page));
  const suffix = params.toString();
  const hash = window.location.hash;
  const url = `${window.location.pathname}${suffix ? `?${suffix}` : ''}${hash}`;
  const current = `${window.location.pathname}${window.location.search}${hash}`;
  if (url === current) return;
  if (mode === 'push') window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
}

function renderPagination(elements: CatalogElements, current: number,
  total: number): void {
  elements.pages.replaceChildren();
  elements.pagination.hidden = total <= 1;
  if (total <= 1) return;
  const add = (label: string, page: number, disabled = false,
    accessibleLabel = label) => {
    const link = document.createElement('a');
    link.className = 'catalog-pagination__link';
    link.textContent = label;
    link.setAttribute('aria-label', accessibleLabel);
    link.setAttribute('aria-disabled', String(disabled));
    link.href = pageUrl(elements, page);
    if (page === current) link.setAttribute('aria-current', 'page');
    if (disabled) link.tabIndex = -1;
    link.addEventListener('click', (event) => {
      if (disabled || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      update(elements, page, true, true);
    });
    elements.pages.append(link);
  };
  add('←', Math.max(1, current - 1), current === 1, 'Previous page');
  const siblings = 1;
  const boundaries = 1;
  const totalPageNumbers = boundaries * 2 + siblings * 2 + 3;
  const paginationItems: Array<number | 'ellipsis'> = [];
  const leftDots = current > siblings + boundaries + 2;
  const rightDots = current < total - siblings - boundaries - 1;
  if (total <= totalPageNumbers) {
    for (let page = 1; page <= total; page += 1) paginationItems.push(page);
  } else if (!leftDots && rightDots) {
    for (let page = 1; page <= totalPageNumbers - 2; page += 1) {
      paginationItems.push(page);
    }
    paginationItems.push('ellipsis', total);
  } else if (leftDots && !rightDots) {
    paginationItems.push(1, 'ellipsis');
    for (let page = total - totalPageNumbers + 3; page <= total; page += 1) {
      paginationItems.push(page);
    }
  } else {
    paginationItems.push(1, 'ellipsis');
    for (let page = current - siblings; page <= current + siblings; page += 1) {
      paginationItems.push(page);
    }
    paginationItems.push('ellipsis', total);
  }
  for (const page of paginationItems) {
    if (page === 'ellipsis') {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'catalog-pagination__ellipsis';
      ellipsis.textContent = '…';
      ellipsis.setAttribute('aria-hidden', 'true');
      elements.pages.append(ellipsis);
      continue;
    }
    add(String(page), page, false,
      page === 1 ? 'First page' : page === total ? 'Last page' : `Page ${page}`);
  }
  add('→', Math.min(total, current + 1), current === total, 'Next page');
}

function pageUrl(elements: CatalogElements, page: number): string {
  const params = new URLSearchParams(window.location.search);
  params.delete('q');
  params.delete('category');
  params.delete('page');
  const query = elements.input.value.trim();
  if (query) params.set('q', query);
  if (elements.category.value) params.set('category', elements.category.value);
  if (page > 1) params.set('page', String(page));
  const suffix = params.toString();
  return `${window.location.pathname}${suffix ? `?${suffix}` : ''}`
    + window.location.hash;
}

/** Apply filters and show only the requested page of matching cards. */
function applyFilters(
  elements: CatalogElements,
  requestedPage: number,
): number {
  const records = elements.cards.map((card) => ({
    category: card.dataset.category ?? '',
    searchText: card.dataset.search ?? '',
  }));
  const matching = filterCatalog(records, elements.input.value,
    elements.category.value);
  const total = Math.max(1,
    Math.ceil(matching.length / elements.pageSize));
  const page = Math.min(Math.max(requestedPage, 1), total);
  const start = (page - 1) * elements.pageSize;
  elements.cards.forEach((card, index) => {
    const matchIndex = matching.indexOf(records[index]);
    card.hidden = matchIndex < start ||
      matchIndex >= start + elements.pageSize;
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
  const actualPage = applyFilters(elements, page);
  writeState(elements, actualPage, push ? 'push' : 'replace');
  if (moveFocus) {
    document.querySelector<HTMLElement>('[data-catalog-results]')?.focus();
  }
}

/** Install progressive enhancement without changing the no-JS HTML. */
function initializeCatalog(): void {
  const elements = getElements();
  if (!elements) return;
  elements.form.hidden = false;
  const state = readState();
  elements.input.value = state.query;
  elements.category.value = state.category;
  let timer: number | undefined;
  const resetPage = (push: boolean) => update(elements, 1, push);
  elements.input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => resetPage(false), SEARCH_DELAY);
  });
  elements.form.addEventListener('submit', (event) => {
    event.preventDefault(); window.clearTimeout(timer); resetPage(true);
  });
  elements.category.addEventListener('change', () => resetPage(true));
  elements.reset.addEventListener('click', () => {
    elements.input.value = ''; elements.category.value = '';
    resetPage(true); elements.input.focus();
  });
  window.addEventListener('popstate', () => {
    const next = readState(); elements.input.value = next.query;
    elements.category.value = next.category; applyFilters(elements, next.page);
  });
  const actualPage = applyFilters(elements, state.page);
  if (state.category !== elements.category.value ||
    actualPage !== state.page) {
    writeState(elements, actualPage, 'replace');
  }
}

if (typeof document !== 'undefined') initializeCatalog();
