// Isolated documents exercise real catalog initialization and browser state.
// @vitest-environment node
import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fixture from '../../tests/fixtures/content/project-catalog-runtime.json';

describe('catalog matching', () => {
  it('normalizes Russian letters, case, and whitespace', async () => {
    const { normalizeSearch } = await import('./project-catalog');
    expect(normalizeSearch(' \tЁЛКА\n Световая  ')).toBe('елка световая');
    expect(normalizeSearch(' \n\t ')).toBe('');
  });

  it('requires every query word but permits any word order', async () => {
    const { matchesSearch } = await import('./project-catalog');
    expect(matchesSearch('Ёлка Световая вывеска', 'ВЫВЕСКА елка')).toBe(true);
    expect(matchesSearch('Alpha bright sign', 'sign alpha')).toBe(true);
    expect(matchesSearch('Alpha bright sign', 'alpha missing')).toBe(false);
    expect(matchesSearch('', 'alpha')).toBe(false);
    expect(matchesSearch('', '  ')).toBe(true);
  });

  it('filters records without mutation or reordering', async () => {
    const { filterCatalog } = await import('./project-catalog');
    const records = fixture.records.map((record) => ({
      category: record.category ?? '',
      searchText: record.searchText ?? '',
    }));
    const original = structuredClone(records);
    expect(filterCatalog(records, 'alpha', 'signs')).toEqual([records[2]]);
    expect(filterCatalog(records, '', 'letters')).toEqual([records[1]]);
    expect(filterCatalog(records, 'alpha', '')).toEqual([
      records[1],
      records[2],
    ]);
    expect(filterCatalog(records, '', 'unknown')).toEqual([]);
    expect(filterCatalog(records, 'missing', 'signs')).toEqual([]);
    expect(records).toEqual(original);
  });
});

describe('catalog browser state', () => {
  let dom: JSDOM;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    // A fresh window owns every listener, history entry, and storage value.
    // Closing it prevents module auto-initialization leaking to another test.
    dom = new JSDOM('', { url: 'https://catalog.example.test/projects/' });
    vi.stubGlobal('window', dom.window);
    vi.stubGlobal('document', dom.window.document);
    vi.stubGlobal('Element', dom.window.Element);
    vi.stubGlobal('sessionStorage', dom.window.sessionStorage);
  });

  afterEach(() => {
    dom.window.close();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function markup(count = 24, pageSize = '2') {
    document.body.innerHTML = `
      <form data-catalog-controls hidden>
        <input id="project-search">
        <select id="project-category"><option value="">All</option></select>
      </form>
      <div data-catalog-count><span data-catalog-count-value></span></div>
      <section data-catalog-search-empty hidden>
        <button type="button" data-catalog-reset>Reset</button>
      </section>
      <div data-catalog-results tabindex="-1"></div>
      <nav data-catalog-pagination><div data-catalog-pages></div></nav>`;
    const form = document.querySelector('form')!;
    const input = document.querySelector('input')!;
    const category = document.querySelector('select')!;
    const pagination = document.querySelector<HTMLElement>('nav')!;
    const results = document.querySelector<HTMLElement>(
      '[data-catalog-results]',
    )!;
    pagination.dataset.pageSize = pageSize;
    fixture.categories.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      category.append(option);
    });
    const cards = Array.from({ length: count }, (_, index) => {
      const record = fixture.records[index % fixture.records.length];
      const card = document.createElement('article');
      card.setAttribute('data-project-card', '');
      if (record.category) card.dataset.category = record.category;
      if (record.searchText) card.dataset.search = record.searchText;
      const link = document.createElement('a');
      link.href = `/projects/${index + 1}/`;
      link.setAttribute('data-project-link', '');
      // Nested targets verify delegated clicks from card contents.
      link.innerHTML = '<span>Project</span>';
      card.append(link);
      results.append(card);
      return card;
    });
    return {
      form,
      input,
      category,
      cards,
      results,
      pagination,
      count: document.querySelector('[data-catalog-count-value]')!,
      empty: document.querySelector<HTMLElement>(
        '[data-catalog-search-empty]',
      )!,
      reset: document.querySelector<HTMLButtonElement>('[data-catalog-reset]')!,
    };
  }

  async function start(url = '/projects/', count = 24, pageSize = '2') {
    window.history.replaceState(null, '', url);
    const elements = markup(count, pageSize);
    await import('./project-catalog');
    return elements;
  }

  function visible(cards: HTMLElement[]) {
    return cards.flatMap((card, index) => (card.hidden ? [] : [index]));
  }

  function link(label: string) {
    return document.querySelector<HTMLAnchorElement>(
      `a[aria-label="${label}"]`,
    )!;
  }

  it('initializes only this document without inherited state', async () => {
    const elements = await start();
    expect(elements.form.hidden).toBe(false);
    expect(elements.input.value).toBe('');
    expect(sessionStorage.length).toBe(0);
    expect(visible(elements.cards)).toEqual([0, 1]);
    expect(elements.count.textContent).toBe('24');
    expect(elements.empty.hidden).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['0', '-1', '1.5', 'bad', ''])(
    'keeps the fallback HTML for invalid page size %s',
    async (size) => {
      const elements = await start('/projects/', 4, size);
      expect(elements.form.hidden).toBe(true);
      expect(visible(elements.cards)).toEqual([0, 1, 2, 3]);
    },
  );

  it('does nothing on pages with incomplete catalog markup', async () => {
    document.body.innerHTML = '<form data-catalog-controls hidden></form>';
    await import('./project-catalog');
    expect(document.querySelector('form')?.hidden).toBe(true);
  });

  it('preserves static pagination, query and hash on entry', async () => {
    const url = '/projects/page/2/?keep=1&page=10#results';
    const elements = await start(url);
    expect(visible(elements.cards)).toEqual([2, 3]);
    expect(
      window.location.pathname + window.location.search + window.location.hash,
    ).toBe(url);
    expect(link('Next page').getAttribute('href')).toBe(
      '/projects/page/3/?keep=1#results',
    );
  });

  it('restores initial filters and clamps an out-of-range page', async () => {
    const elements = await start(
      '/projects/page/999/?q=alpha&category=signs&keep=1#results',
    );
    expect(elements.input.value).toBe('alpha');
    expect(elements.category.value).toBe('signs');
    expect(visible(elements.cards)).toEqual([18, 22]);
    expect(elements.count.textContent).toBe('6');
    expect(window.location.pathname).toBe('/projects/page/3/');
    expect(window.location.search).toBe('?keep=1&q=alpha&category=signs');
    expect(window.location.hash).toBe('#results');
  });

  it.each(['-2', 'junk', '0', '1e999'])(
    'uses page one for invalid initial page %s',
    async (page) => {
      const elements = await start(`/projects/?page=${page}`);
      expect(visible(elements.cards)).toEqual([0, 1]);
    },
  );

  it('drops unknown categories without losing other params', async () => {
    const elements = await start('/projects/?category=unknown&keep=1');
    expect(elements.category.value).toBe('');
    expect(elements.count.textContent).toBe('24');
    expect(window.location.search).toBe('?keep=1');
  });

  it('debounces input and replaces URL after the last edit', async () => {
    const elements = await start('/projects/page/3/?keep=1#results');
    const replace = vi.spyOn(window.history, 'replaceState');
    const push = vi.spyOn(window.history, 'pushState');
    elements.input.value = 'no match';
    fireEvent.input(elements.input);
    await vi.advanceTimersByTimeAsync(200);
    expect(visible(elements.cards)).toEqual([4, 5]);
    elements.input.value = '  еЛКА  ';
    fireEvent.input(elements.input);
    await vi.advanceTimersByTimeAsync(249);
    expect(replace).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(elements.count.textContent).toBe('6');
    expect(visible(elements.cards)).toEqual([0, 4]);
    expect(new URLSearchParams(window.location.search).get('q')).toBe('еЛКА');
    expect(window.location.pathname).toBe('/projects/');
    expect(window.location.hash).toBe('#results');
    expect(replace).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
  });

  it('combines filters, submits immediately and resets', async () => {
    const elements = await start('/projects/?keep=1');
    const push = vi.spyOn(window.history, 'pushState');
    elements.input.value = 'Alpha';
    fireEvent.input(elements.input);
    fireEvent.change(elements.category, { target: { value: 'signs' } });
    expect(elements.count.textContent).toBe('6');
    expect(visible(elements.cards)).toEqual([2, 6]);
    expect(push).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    elements.input.value = 'not found';
    fireEvent.input(elements.input);
    expect(fireEvent.submit(elements.form)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    expect(elements.count.textContent).toBe('0');
    expect(elements.empty.hidden).toBe(false);
    expect(elements.pagination.hidden).toBe(true);
    expect(visible(elements.cards)).toEqual([]);
    fireEvent.click(elements.reset);
    expect(elements.input.value).toBe('');
    expect(elements.category.value).toBe('');
    expect(elements.empty.hidden).toBe(true);
    expect(elements.count.textContent).toBe('24');
    expect(document.activeElement).toBe(elements.input);
    expect(window.location.search).toBe('?keep=1');
  });

  it('does not create history entries for an unchanged state', async () => {
    const elements = await start();
    const push = vi.spyOn(window.history, 'pushState');
    fireEvent.submit(elements.form);
    fireEvent.click(elements.reset);
    expect(push).not.toHaveBeenCalled();
  });

  it('hides search-empty for an unpublished catalog', async () => {
    const elements = await start('/projects/', 0);
    expect(elements.count.textContent).toBe('0');
    expect(elements.empty.hidden).toBe(true);
    expect(elements.pagination.hidden).toBe(true);
  });

  it.each([
    [1, ['←', '1', '2', '3', '4', '5', '…', '12', '→']],
    [6, ['←', '1', '…', '5', '6', '7', '…', '12', '→']],
    [12, ['←', '1', '…', '8', '9', '10', '11', '12', '→']],
  ])('renders pagination for page %s', async (page, labels) => {
    await start(`/projects/page/${page}/`);
    const pages = document.querySelector('[data-catalog-pages]')!;
    expect([...pages.children].map((item) => item.textContent)).toEqual(labels);
    expect(pages.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(pages.querySelector('[aria-current="page"]')?.textContent).toBe(
      String(page),
    );
    pages.querySelectorAll('span').forEach((ellipsis) => {
      expect(ellipsis.getAttribute('aria-hidden')).toBe('true');
    });
    const disabled =
      page === 1
        ? link('Previous page')
        : page === 12
          ? link('Next page')
          : null;
    if (disabled) {
      expect(disabled.tabIndex).toBe(-1);
      expect(fireEvent.click(disabled)).toBe(false);
      expect(window.location.pathname).toBe(`/projects/page/${page}/`);
    }
  });

  it('pages a small catalog and focuses its results', async () => {
    const elements = await start('/projects/?keep=1#results', 6);
    fireEvent.click(link('Next page'));
    expect(visible(elements.cards)).toEqual([2, 3]);
    expect(window.location.pathname).toBe('/projects/page/2/');
    expect(window.location.search).toBe('?keep=1');
    expect(window.location.hash).toBe('#results');
    expect(document.activeElement).toBe(elements.results);
    fireEvent.click(link('Last page'));
    expect(visible(elements.cards)).toEqual([4, 5]);
  });

  it.each([
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ])('preserves native modified paging: %j', async (options) => {
    await start();
    const push = vi.spyOn(window.history, 'pushState');
    const event = new dom.window.MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ...options,
    });
    link('Next page').dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(push).not.toHaveBeenCalled();
  });

  it('honors an already prevented pagination click', async () => {
    await start();
    const event = new dom.window.MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    event.preventDefault();
    link('Next page').dispatchEvent(event);
    expect(window.location.pathname).toBe('/projects/');
  });

  it('cancels pending input when paging', async () => {
    const elements = await start();
    elements.input.value = 'Alpha';
    fireEvent.input(elements.input);
    fireEvent.click(link('Next page'));
    expect(visible(elements.cards)).toEqual([5, 6]);
    await vi.advanceTimersByTimeAsync(300);
    expect(visible(elements.cards)).toEqual([5, 6]);
    expect(window.location.pathname).toBe('/projects/page/2/');
  });

  it('restores history and cancels pending searches', async () => {
    const elements = await start('/projects/?keep=1#results');
    fireEvent.click(link('Next page'));
    elements.input.value = 'Alpha';
    fireEvent.submit(elements.form);
    elements.input.value = 'missing';
    fireEvent.input(elements.input);
    window.history.back();
    await vi.runAllTimersAsync();
    expect(elements.input.value).toBe('');
    expect(visible(elements.cards)).toEqual([2, 3]);
    expect(window.location.pathname).toBe('/projects/page/2/');
    expect(window.location.search).toBe('?keep=1');
    window.history.forward();
    await vi.runAllTimersAsync();
    expect(elements.input.value).toBe('Alpha');
    expect(visible(elements.cards)).toEqual([1, 2]);
    expect(window.location.pathname).toBe('/projects/');
    expect(window.location.search).toBe('?keep=1&q=Alpha');
    expect(window.location.hash).toBe('#results');
  });

  it('saves card return URLs and tolerates blocked storage', async () => {
    const elements = await start('/projects/page/2/?keep=1');
    const target = elements.cards[2].querySelector('span')!;
    // Cancel navigation; the delegated handler must still save its context.
    target.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(target);
    expect(sessionStorage.getItem('project-catalog-return')).toBe(
      '/projects/page/2/?keep=1#catalog-results',
    );
    vi.spyOn(dom.window.Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    expect(() => fireEvent.click(target)).not.toThrow();
    // Non-card and non-element click targets must not touch storage.
    fireEvent.click(elements.count);
    document.dispatchEvent(new dom.window.MouseEvent('click'));
  });
});
