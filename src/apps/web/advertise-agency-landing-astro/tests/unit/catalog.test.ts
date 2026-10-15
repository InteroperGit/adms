// Synthetic DOM covers URL filters and pagination without a development server.
import { expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';

it('normalizes search and combines words with category filters', async () => {
  const { normalizeSearch, matchesSearch, filterCatalog } =
    await import('../../src/scripts/project-catalog');
  expect(normalizeSearch('  HELLO   World ')).toBe('hello world');
  expect(normalizeSearch('  ЁЛКА  ')).toBe('елка');
  expect(matchesSearch('Alpha Beta', ' beta ALPHA ')).toBe(true);
  expect(matchesSearch('Alpha', 'Alpha Beta')).toBe(false);
  const records = [{ category: 'sample', searchText: 'Alpha Beta' },
    { category: 'other', searchText: 'Beta' }];
  expect(filterCatalog(records, 'beta', 'sample')).toEqual([records[0]]);
  expect(filterCatalog(records, '', '')).toEqual(records);
  expect(filterCatalog([], '', '')).toEqual([]);
});

it('restores URL state, paginates, clamps pages and preserves other params',
  async () => {
    vi.useFakeTimers();
    window.history.replaceState(null, '', '/projects/?keep=1&page=999#results');
    document.body.innerHTML = `
      <form data-catalog-controls hidden>
        <input id="project-search">
        <select id="project-category">
          <option value="">All</option><option value="sample">Sample</option>
        </select>
        <button data-catalog-reset type="button">Reset</button>
      </form>
      <div data-catalog-count><span data-catalog-count-value></span></div>
      <p data-catalog-search-empty hidden>Empty</p>
      <div data-catalog-results tabindex="-1"></div>
      <nav data-catalog-pagination data-page-size="1">
        <div data-catalog-pages></div>
      </nav>
      ${Array.from({ length: 10 }, (_, index) => `
        <article data-project-card data-category="sample"
          data-search="Alpha ${index}">
          <a data-project-link href="/projects/${index + 1}/">Project</a>
        </article>`).join('')}`;
    vi.resetModules();
    await import('../../src/scripts/project-catalog');
    const input = document.querySelector('input')!;
    const form = document.querySelector('form')!;
    const cards = [...document.querySelectorAll<HTMLElement>(
      '[data-project-card]',
    )];
    expect(form.hidden).toBe(false);
    expect(cards.filter(card => !card.hidden)).toEqual([cards[9]]);
    expect(window.location.pathname).toBe('/projects/page/10/');
    const first = document.querySelector<HTMLAnchorElement>(
      '[aria-label="First page"]',
    )!;
    expect(first.href).toContain('keep=1#results');
    fireEvent.click(first);
    expect(window.location.pathname).toBe('/projects/');
    expect(document.querySelector('[data-catalog-results]')).toHaveFocus();
    // Middle pages exercise both ellipses; native modified clicks do not page.
    for (const page of [5, 1, 9]) {
      window.history.replaceState(null, '', `/projects/page/${page}/?keep=1`);
      fireEvent.popState(window);
      expect(cards.filter(card => !card.hidden)).toEqual([cards[page - 1]]);
    }
    input.value = 'Missing';
    fireEvent.input(input);
    await vi.advanceTimersByTimeAsync(250);
    expect(document.querySelector('[data-catalog-search-empty]'))
      .not.toHaveAttribute('hidden');
    expect(window.location.search).toContain('q=Missing');
    expect(document.querySelector('[data-catalog-count-value]'))
      .toHaveTextContent('0');
    fireEvent.click(document.querySelector('[data-catalog-reset]')!);
    expect(input).toHaveFocus();
    expect(window.location.search).toBe('?keep=1');
    input.value = 'Alpha 3';
    fireEvent.submit(form);
    expect(cards.filter(card => !card.hidden)).toEqual([cards[3]]);
    fireEvent.click(cards[3].querySelector('a')!);
    expect(sessionStorage.getItem('project-catalog-return'))
      .toBe('/projects/?keep=1&q=Alpha+3#catalog-results');
    window.history.replaceState(
      null, '', '/projects/?category=unknown&page=-1',
    );
    fireEvent.popState(window);
    expect(cards.filter(card => !card.hidden)).toEqual([cards[0]]);
    document.body.replaceChildren();
    vi.useRealTimers();
  });
