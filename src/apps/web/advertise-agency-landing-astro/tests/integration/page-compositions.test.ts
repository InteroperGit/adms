// Integration coverage checks the contracts between pages and their sections.
// Child renderer details remain covered by focused component tests.
// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Header from '../../src/components/Header.astro';
import Homepage from '../../src/pages/index.astro';
import OrderInquiry from '../../src/components/sections/OrderInquiry.astro';
import ContentBlocks from '../../src/components/content/ContentBlocks.astro';
import OrderFormBlock from '../../src/components/content/OrderFormBlock.astro';
import ServiceArticle from '../../src/components/sections/ServiceArticle.astro';
import CookieBanner from '../../src/components/CookieBanner.astro';
import ProjectCatalogControls
  from '../../src/components/projects/ProjectCatalogControls.astro';
import ProjectCatalogCount
  from '../../src/components/projects/ProjectCatalogCount.astro';
import ProjectCatalogGrid
  from '../../src/components/projects/ProjectCatalogGrid.astro';
import ProjectCatalogEmpty
  from '../../src/components/projects/ProjectCatalogEmpty.astro';
import ProjectCatalogPagination
  from '../../src/components/projects/ProjectCatalogPagination.astro';
import fixture from '../fixtures/content/content-blocks.json';
import type { ContentBlock } from '../../src/types/content-blocks';
import type { Project } from '../../src/types/project';
import { render } from '../helpers/render';

it('composes shared header controls with mobile navigation and settings',
  async () => {
  const body = await render(Header);

  expect(
    body.querySelector('header[data-auto-hide-header]'),
  ).toBeInTheDocument();
  expect(body.querySelector('#mobile-menu-open')).toHaveAttribute(
    'aria-controls',
    'mobile-menu',
  );
  expect(body.querySelector('#mobile-menu')).toBeInTheDocument();
  expect(
    getByRole(body, 'navigation', { name: /Основная/ }),
  ).toBeInTheDocument();
  expect(body.querySelector('[data-theme-settings]')).toBeInTheDocument();
});

it('composes inquiry section with disabled delivery and no-JS fallback',
  async () => {
  const body = await render(OrderInquiry);

  expect(body.querySelector('#order-inquiry')).toBeInTheDocument();
  expect(body.querySelector('[data-inquiry]')).toHaveAttribute(
    'data-enabled',
    'false',
  );
  expect(body.querySelector('fieldset')).toBeDisabled();
  expect(body.querySelector('noscript')).toHaveTextContent('JavaScript');
});

it('composes a service article with content, fallback actions and noindex',
  async () => {
  const body = await render(ServiceArticle, { serviceId: 'neon' });

  expect(body.querySelector('article.service-article')).toBeInTheDocument();
  expect(body.querySelector('h1')).toBeInTheDocument();
  expect(body.querySelector('.content-blocks')).toBeInTheDocument();
  expect(body.querySelector('meta[name="robots"]')).toBeNull();
  expect(body.querySelector('a[href="/#order-inquiry"]')).toBeInTheDocument();
});

it('composes the homepage sections in the configured editorial order',
  async () => {
  const body = await render(Homepage);
  const sections = [...body.querySelectorAll('section[id]')].map(
    (section) => section.id,
  );

  expect(sections).toEqual([
    'offers',
    'introduction',
    'about',
    'services',
    'projects',
    'ordering-process',
    'production-and-guarantees',
    'reviews',
    'business-solutions',
    'contacts',
    'order-inquiry',
  ]);
  expect(body.querySelector('#pricing')).toBeNull();
  expect(body.querySelector('#faq')).toBeNull();
  expect(body.querySelector('h1')).toBeInTheDocument();
  expect(body.querySelector('[data-inquiry]')).toBeInTheDocument();
});

it('composes content blocks with article ownership and safe fallback',
  async () => {
  const body = await render(ContentBlocks, {
    blocks: fixture as ContentBlock[],
    context: {
      kind: 'project',
      projectId: 1,
      category: 'sample',
      published: true,
    },
  });

  expect(body.querySelector('.content-blocks')).toBeInTheDocument();
  expect(body.querySelector('h2')).toBeInTheDocument();
  expect(body.querySelector('.inquiry-link')).toBeInTheDocument();
  expect(body.querySelector('a[href^="javascript:"]')).toBeNull();
  expect(body.querySelectorAll('ol, ul').length).toBeGreaterThanOrEqual(2);
});

it('keeps an empty article stream renderable and free of unsafe links',
  async () => {
  const body = await render(ContentBlocks, { blocks: [] });

  expect(body.querySelector('.content-blocks')).toBeInTheDocument();
  expect(body.querySelector('.block-demo-notice')).toBeNull();
  expect(body.querySelector('a[href^="javascript:"]')).toBeNull();
  expect(body.querySelectorAll('.content-block')).toHaveLength(0);
});

it('keeps published article forms tied to their owning context', async () => {
  const block = {
    type: 'order-form',
    id: 'led-letters',
    formId: 'led-letters',
    context: 'service',
    category: 'svetovye-bukvy',
    status: 'published',
    provenance: { source: 'integration fixture' },
  } as const;
  const published = await render(OrderFormBlock, {
    block,
    context: {
      kind: 'service',
      serviceId: 'svetovye-bukvy',
      category: 'svetovye-bukvy',
      published: true,
    },
  });
  const rejected = await render(OrderFormBlock, {
    block,
    context: {
      kind: 'service',
      serviceId: 'neon',
      category: 'neon',
      published: true,
    },
  });

  expect(published.querySelector('section#led-letters')).toBeInTheDocument();
  expect(published.querySelector('input[name="serviceId"]')).toHaveValue(
    'svetovye-bukvy',
  );
  expect(rejected.querySelector('[data-led-letters]')).toBeNull();
  expect(
    rejected.querySelector('a[href="/#order-inquiry"]'),
  ).toBeInTheDocument();
});

it('composes catalog controls, results, empty state and pagination',
  async () => {
  const project: Project = {
    id: 1,
    category: 'sample',
    status: 'published',
    notice: null,
    title: 'Fixture project',
    client: 'Fixture client',
    attribution: 'generic',
    description: 'Fixture description',
    content: [],
  };
  const body = await render(ProjectCatalogControls, {
    categories: [
      {
        slug: 'sample',
        label: 'Sample',
        color: '#000000',
        textColor: '#ffffff',
      },
    ],
  });
  const count = await render(ProjectCatalogCount, { count: 1 });
  const grid = await render(ProjectCatalogGrid, {
    projects: [project],
    page: 1,
    pageSize: 12,
  });
  const empty = await render(ProjectCatalogEmpty, { type: 'search' });
  const pagination = await render(ProjectCatalogPagination, {
    items: [1, 2],
    currentPage: 1,
    pageCount: 2,
    pageSize: 1,
    pageHref: (page: number) => `/projects/?page=${page}`,
  });

  expect(body.querySelector('[data-catalog-controls]')).toBeInTheDocument();
  expect(count.querySelector('[data-catalog-count]')).toBeInTheDocument();
  expect(grid.querySelector('[data-project-card]')).toBeInTheDocument();
  expect(
    empty.querySelector('[data-catalog-search-empty]'),
  ).toBeInTheDocument();
  expect(
    pagination.querySelector('[data-catalog-pagination]'),
  ).toBeInTheDocument();
});

it('keeps cookie choices and legal links in the composed banner', async () => {
  const body = await render(CookieBanner);

  expect(body.querySelector('#cookie-banner')).toBeInTheDocument();
  expect(body.querySelectorAll('[data-cookie-choice]')).toHaveLength(2);
  expect(body.querySelector('a[href="/privacy-policy"]')).toBeInTheDocument();
  expect(body.querySelector('a[href="/terms-of-use"]')).toBeInTheDocument();
});
