// Integration coverage checks the contracts between pages and their sections.
// Child renderer details remain covered by focused component tests.
// @vitest-environment node
import { beforeEach, expect, it, vi } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Header from '../../src/components/Header.astro';
import Homepage from '../../src/pages/index.astro';
import OrderInquiry from '../../src/components/sections/OrderInquiry.astro';
import ContentBlocks from '../../src/components/content/ContentBlocks.astro';
import OrderFormBlock from '../../src/components/content/OrderFormBlock.astro';
import ServiceArticle from '../../src/components/sections/ServiceArticle.astro';
import CookieBanner from '../../src/components/CookieBanner.astro';
// prettier-ignore
import ProjectCatalogControls
  from '../../src/components/projects/ProjectCatalogControls.astro';
// prettier-ignore
import ProjectCatalogCount
  from '../../src/components/projects/ProjectCatalogCount.astro';
// prettier-ignore
import ProjectCatalogGrid
  from '../../src/components/projects/ProjectCatalogGrid.astro';
// prettier-ignore
import ProjectCatalogEmpty
  from '../../src/components/projects/ProjectCatalogEmpty.astro';
// prettier-ignore
import ProjectCatalogPagination
  from '../../src/components/projects/ProjectCatalogPagination.astro';
import fixture from '../fixtures/content/content-blocks.json';
import type { ContentBlock } from '../../src/types/content-blocks';
import type { Project } from '../../src/types/project';
import type { ServicesContent } from '../../src/types/services';
import type { LegalDocument } from '../../src/types/legal';
import Layout from '../../src/layouts/Layout.astro';
import LegalLayout from '../../src/layouts/LegalLayout.astro';
import NotFound from '../../src/pages/404.astro';
import Privacy from '../../src/pages/privacy-policy.astro';
import Terms from '../../src/pages/terms-of-use.astro';
import ProjectsIndex from '../../src/pages/projects/index.astro';
import ProjectDetail from '../../src/pages/projects/[id].astro';
import ProjectPage from '../../src/pages/projects/page/[page].astro';
import Montazh from '../../src/pages/services/montazh.astro';
import Neon from '../../src/pages/services/neon.astro';
import Structures from '../../src/pages/services/obyomnye-konstruktsii.astro';
import Letters from '../../src/pages/services/svetovye-bukvy.astro';
import Signs from '../../src/pages/services/vyveski.astro';
import { services } from '../../src/content/services';
import { site } from '../../src/content/site';
import { privacyPolicy, termsOfUse } from '../../src/content/legal';
import { blockDemoNotice } from '../../src/content/block-publication';
import { render, renderDocument } from '../helpers/render';
import { buildProject, cloneFixture } from '../helpers/fixtures';
import routeFixture from '../fixtures/content/page-routes.json';

// Override resolved content at the page boundary. Default cases still use
// the real loaders and validators backed by the Vitest fixture alias.
const overrides = vi.hoisted(() => ({
  services: undefined as ServicesContent | undefined,
  projects: undefined as Project[] | undefined,
  legal: undefined as LegalDocument | undefined,
  hideOffers: false,
}));

vi.mock('@/content/services', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../src/content/services')>();
  const { getVisibleServices } =
    await import('../../src/content/service-publication');
  return {
    ...actual,
    get services() {
      return overrides.services ?? actual.services;
    },
    get visibleServices() {
      return getVisibleServices(overrides.services ?? actual.services);
    },
  };
});

vi.mock('@/content/projects', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../src/content/projects')>();
  const { getAvailableProjectCategories } =
    await import('../../src/content/project-publication');
  return {
    ...actual,
    get projects() {
      return overrides.projects ?? actual.projects;
    },
    get availableProjectCategories() {
      return getAvailableProjectCategories(
        overrides.projects ?? actual.projects,
      );
    },
  };
});

vi.mock('@/content/legal', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../src/content/legal')>();
  return {
    get privacyPolicy() {
      return overrides.legal ?? actual.privacyPolicy;
    },
    get termsOfUse() {
      return overrides.legal ?? actual.termsOfUse;
    },
  };
});

vi.mock('@/content/offers', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../src/content/offers')>();
  return {
    ...actual,
    get enabledOffers() {
      return overrides.hideOffers ? [] : actual.enabledOffers;
    },
  };
});

beforeEach(() => {
  overrides.services = undefined;
  overrides.projects = undefined;
  overrides.legal = undefined;
  overrides.hideOffers = false;
});

it('composes header navigation and settings', async () => {
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

it('composes disabled inquiry and no-JS fallback', async () => {
  const body = await render(OrderInquiry);

  expect(body.querySelector('#order-inquiry')).toBeInTheDocument();
  expect(body.querySelector('[data-inquiry]')).toHaveAttribute(
    'data-enabled',
    'false',
  );
  expect(body.querySelector('fieldset')).toBeDisabled();
  expect(body.querySelector('noscript')).toHaveTextContent('JavaScript');
});

it('composes service content and fallback actions', async () => {
  const body = await render(ServiceArticle, { serviceId: 'neon' });

  expect(body.querySelector('article.service-article')).toBeInTheDocument();
  expect(body.querySelector('h1')).toBeInTheDocument();
  expect(body.querySelector('.content-blocks')).toBeInTheDocument();
  expect(body.querySelector('meta[name="robots"]')).toBeNull();
  expect(body.querySelector('a[href="/#order-inquiry"]')).toBeInTheDocument();
});

it('composes homepage sections in editorial order', async () => {
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

it('composes content blocks with ownership and safe fallback', async () => {
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

it('keeps empty article streams safe and renderable', async () => {
  const body = await render(ContentBlocks, { blocks: [] });

  expect(body.querySelector('.content-blocks')).toBeInTheDocument();
  expect(body.querySelector('.block-demo-notice')).toBeNull();
  expect(body.querySelector('a[href^="javascript:"]')).toBeNull();
  expect(body.querySelectorAll('.content-block')).toHaveLength(0);
});

it('ties published article forms to their owner', async () => {
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

it('composes catalog controls, results and pagination', async () => {
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

it('composes cookie choices and legal links', async () => {
  const body = await render(CookieBanner);

  expect(body.querySelector('#cookie-banner')).toBeInTheDocument();
  expect(body.querySelectorAll('[data-cookie-choice]')).toHaveLength(2);
  expect(body.querySelector('a[href="/privacy-policy"]')).toBeInTheDocument();
  expect(body.querySelector('a[href="/terms-of-use"]')).toBeInTheDocument();
});

// Route assertions use the complete document, never a browser script. Check
// the page-owned heading tree independently from shared navigation headings.
function expectPage(document: Document) {
  expect(document.doctype?.name).toBe('html');
  expect(document.documentElement).toHaveAttribute('lang', 'ru');
  expect(document.querySelectorAll('main')).toHaveLength(1);
  expect(document.querySelectorAll('h1')).toHaveLength(1);
  expect(document.querySelectorAll('head title')).toHaveLength(1);
  const landmarks = [...document.body.children].filter((element) =>
    ['HEADER', 'MAIN', 'FOOTER'].includes(element.tagName),
  );
  expect(landmarks.map((element) => element.tagName)).toEqual([
    'HEADER',
    'MAIN',
    'FOOTER',
  ]);
  expect(document.querySelector('#cookie-banner')).toBeInTheDocument();
  let previous = 0;
  const headings = document.querySelectorAll('main :is(h1,h2,h3,h4,h5,h6)');
  for (const heading of headings) {
    const level = Number(heading.tagName.slice(1));
    expect(level).toBeLessThanOrEqual(previous + 1);
    previous = level;
  }
  expect(document.querySelector('main')).not.toHaveAttribute('hidden');
  expect(document.querySelector('a[href^="javascript:"]')).toBeNull();
}

function expectMetadata(
  document: Document,
  title: string,
  description: string | RegExp,
  noindex = false,
) {
  const head = document.head;
  const expectedDescription =
    typeof description === 'string'
      ? description
      : expect.stringMatching(description);
  expect(document.title).toBe(title);
  expect(head.querySelector('meta[name="description"]')).toHaveAttribute(
    'content',
    expectedDescription,
  );
  for (const property of ['og:title', 'twitter:title']) {
    expect(
      head.querySelector(`[property="${property}"],
      [name="${property}"]`),
    ).toHaveAttribute('content', title);
  }
  for (const property of ['og:description', 'twitter:description']) {
    expect(
      head.querySelector(`[property="${property}"],
      [name="${property}"]`),
    ).toHaveAttribute('content', expectedDescription);
  }
  const robots = head.querySelector('meta[name="robots"]');
  if (noindex) expect(robots).toHaveAttribute('content', 'noindex, follow');
  else expect(robots).toBeNull();
}

function expectCanonical(document: Document, path: string) {
  const canonical = `https://production.test${path}`;
  expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(
    1,
  );
  expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
    'href',
    canonical,
  );
  expect(
    document.head.querySelector('meta[property="og:url"]'),
  ).toHaveAttribute('content', canonical);
}

it('renders layout defaults without a production URL', async () => {
  const document = await renderDocument(Layout, {
    slots: { default: '<h1>Slot heading</h1><p>Slot copy</p>' },
    url: 'https://request.test/preview/?tracking=1',
  });
  expectPage(document);
  expectMetadata(document, site.title, site.description);
  expect(document.querySelector('main')).toHaveTextContent('Slot copy');
  expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
  expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
  expect(document.head.querySelector('meta[name="viewport"]')).toHaveAttribute(
    'content',
    'width=device-width, initial-scale=1.0',
  );
  expect(
    document.head.querySelector('meta[name="color-scheme"]'),
  ).toHaveAttribute('content', 'light dark');
});

it('renders noindex layout overrides and canonical path', async () => {
  const document = await renderDocument(Layout, {
    props: {
      title: 'Fixture title',
      description: 'Fixture summary',
      noindex: true,
    },
    slots: { default: '<h1>Visible heading</h1>' },
    site: 'https://production.test/',
    url: 'https://request.test/fixture/?tracking=1#topic',
  });
  expectPage(document);
  expectMetadata(
    document,
    `Fixture title | ${site.logoText}`,
    'Fixture summary',
    true,
  );
  expectCanonical(document, '/fixture/');
});

it('renders legal layout dates, lists and ordered sections', async () => {
  const document = await renderDocument(LegalLayout, {
    props: { document: routeFixture.legal, title: 'Legal metadata override' },
  });
  expectPage(document);
  expectMetadata(
    document,
    `Legal metadata override | ${site.logoText}`,
    routeFixture.legal.description,
  );
  expect(document.querySelector('h1')).toHaveTextContent(
    'Fixture legal document',
  );
  expect(document.querySelector('.legal-date')).toHaveTextContent('2026-10-18');
  expect(
    [...document.querySelectorAll('main h2')].map((node) => node.textContent),
  ).toEqual(['First legal topic', 'Second legal topic']);
  expect(
    [...document.querySelectorAll('main li')].map((node) => node.textContent),
  ).toEqual(['First condition', 'Second condition']);
  expect(document.querySelector('[data-legal-back]')).toBeNull();
});

it('renders a minimal legal layout and native return link', async () => {
  const document = await renderDocument(LegalLayout, {
    props: {
      document: { ...routeFixture.legal, effectiveDate: '', sections: [] },
      showMobileBackLink: true,
    },
  });
  expectPage(document);
  expect(document.querySelector('.legal-date')).toBeNull();
  expect(document.querySelectorAll('main section')).toHaveLength(0);
  expect(document.querySelector('[data-legal-back]')).toHaveAttribute(
    'href',
    '/',
  );
});

const legalRoutes = [
  {
    component: Privacy,
    path: '/privacy-policy',
    back: true,
    getContent: () => privacyPolicy,
  },
  {
    component: Terms,
    path: '/terms-of-use',
    back: false,
    getContent: () => termsOfUse,
  },
];

it.each(legalRoutes)(
  'renders legal route $path metadata and content',
  async ({ component, path, back, getContent }) => {
    const content = getContent();
    const document = await renderDocument(component, {
      url: `https://request.test${path}`,
      site: 'https://production.test/',
    });
    expectPage(document);
    expectMetadata(
      document,
      `${content.title} | ${site.logoText}`,
      content.description,
    );
    expectCanonical(document, path);
    expect(document.querySelector('h1')).toHaveTextContent(content.title);
    expect(document.querySelectorAll('main h2')).toHaveLength(
      content.sections.length,
    );
    expect(Boolean(document.querySelector('[data-legal-back]'))).toBe(back);
  },
);

it.each(legalRoutes)(
  'renders minimal legal route $path',
  async ({ component }) => {
    overrides.legal = {
      ...routeFixture.legal,
      effectiveDate: '',
      sections: [],
    };
    const document = await renderDocument(component);
    expectPage(document);
    expectMetadata(
      document,
      `Fixture legal document | ${site.logoText}`,
      'Fixture legal description',
    );
    expect(document.querySelector('.legal-date')).toBeNull();
    expect(document.querySelectorAll('main h2')).toHaveLength(0);
  },
);

it.each([false, true])(
  'renders homepage with offers withheld: %s',
  async (hideOffers) => {
    overrides.hideOffers = hideOffers;
    const document = await renderDocument(Homepage, {
      url: 'https://request.test/',
      site: 'https://production.test/',
    });
    expectPage(document);
    expectMetadata(document, `Главная | ${site.logoText}`, site.description);
    expectCanonical(document, '/');
    const sections = [...document.querySelectorAll('main section[id]')].map(
      (section) => section.id,
    );
    expect(sections).toEqual([
      ...(hideOffers ? [] : ['offers']),
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
    expect(
      document.querySelectorAll('[data-reveal-state="pending"]'),
    ).toHaveLength(0);
    expect(document.querySelector('main noscript')).toHaveTextContent(
      'JavaScript',
    );
    expect(document.querySelector('#order-inquiry fieldset')).toBeDisabled();
  },
);

it.each([false, true])(
  'renders 404 with services withheld: %s',
  async (withholdServices) => {
    if (withholdServices) overrides.services = { ...services, items: [] };
    const document = await renderDocument(NotFound, {
      url: 'https://request.test/missing/?tracking=1',
      site: 'https://production.test/',
    });
    expectPage(document);
    expectMetadata(
      document,
      `Страница не найдена | ${site.logoText}`,
      /Запрошенная страница не найдена\.[\s\S]*выберите другой раздел сайта\./,
      true,
    );
    expectCanonical(document, '/missing/');
    expect(document.querySelector('main h1')).toHaveTextContent(
      'Страница не найдена',
    );
    expect(document.querySelector('main a[href="/"]')).toHaveTextContent(
      'На главную',
    );
    const links = [...document.querySelectorAll('.not-found-links a')].map(
      (link) => link.getAttribute('href'),
    );
    expect(links).toEqual([
      ...(withholdServices ? [] : ['/#services']),
      '/projects/',
      '/#contacts',
    ]);
  },
);

function catalogProjects(count = 3): Project[] {
  return Array.from({ length: count }, (_, index) =>
    buildProject({
      id: index + 1,
      title: `Route project ${index + 1}`,
      status: index === 1 ? 'demo' : 'published',
      notice: null,
      content: cloneFixture(routeFixture.publishedBlocks) as ContentBlock[],
    }),
  );
}

const catalogRoutes = [
  { component: ProjectsIndex, path: '/projects/', page: 1 },
  { component: ProjectPage, path: '/projects/page/2/', page: 2 },
];

it.each(catalogRoutes)(
  'renders catalog $path with native page links',
  async ({ component, path, page }) => {
    overrides.projects = catalogProjects();
    const document = await renderDocument(component, {
      url:
        `https://request.test${path}?q=sign&category=sample` +
        `${page === 2 ? '&page=99' : ''}#results`,
      params: page === 2 ? { page: '2' } : {},
      site: 'https://production.test/',
    });
    expectPage(document);
    expectMetadata(
      document,
      `Проекты | ${site.logoText}`,
      'Каталог проектов наружной рекламы и световых конструкций.',
    );
    expectCanonical(document, path);
    // A numbered path wins over a conflicting legacy page query.
    const current = page;
    const cards = [...document.querySelectorAll('[data-project-card]')];
    expect(cards).toHaveLength(3);
    expect(cards.filter((card) => !card.hasAttribute('hidden'))).toHaveLength(
      1,
    );
    expect(
      document.querySelector('[data-project-card]:not([hidden]) h3'),
    ).toHaveTextContent(`Route project ${current}`);
    expect(
      [...document.querySelectorAll('[data-project-link]')].map((link) =>
        link.getAttribute('href'),
      ),
    ).toEqual(['/projects/1/', '/projects/2/', '/projects/3/']);
    expect(
      document.querySelector('[data-catalog-controls]'),
    ).toBeInTheDocument();
    expect(document.querySelector('[data-catalog-count]')).toHaveTextContent(
      '3',
    );
    expect(
      document.querySelector('[data-catalog-pagination] [aria-current="page"]'),
    ).toHaveTextContent(String(current));
    const pagination = document.querySelector('[data-catalog-pagination]')!;
    expect(pagination).not.toHaveAttribute('hidden');
    expect(
      pagination.querySelector('a[aria-label="First page"]'),
    ).toHaveAttribute('href', '/projects/?q=sign&category=sample#results');
    expect(
      pagination.querySelector('a[aria-label="Last page"]'),
    ).toHaveAttribute(
      'href',
      '/projects/page/3/?q=sign&category=sample#results',
    );
    expect(
      pagination.querySelector('a[aria-label="Next page"]'),
    ).toHaveAttribute(
      'href',
      '/projects/page/' + `${current + 1}/?q=sign&category=sample#results`,
    );
  },
);

it.each(catalogRoutes)(
  'keeps empty catalog $path readable',
  async ({ component, path }) => {
    overrides.projects = [];
    const document = await renderDocument(component, {
      url: `https://request.test${path}`,
      params: { page: '2' },
    });
    expectPage(document);
    expect(document.querySelector('[data-project-card]')).toBeNull();
    expect(document.querySelector('.catalog-empty')).toBeInTheDocument();
    expect(document.querySelector('[data-catalog-count]')).toHaveTextContent(
      '0',
    );
    expect(document.querySelector('[data-catalog-pagination]')).toHaveAttribute(
      'hidden',
    );
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  },
);

it.each([
  { query: '0', current: 1 },
  { query: '-1', current: 1 },
  { query: 'invalid', current: 1 },
  { query: '1.5', current: 1 },
  { query: '99', current: 3 },
])(
  'normalizes catalog query page=$query to page $current',
  async ({ query, current }) => {
    overrides.projects = catalogProjects();
    const document = await renderDocument(ProjectsIndex, {
      url: `https://request.test/projects/?page=${query}`,
    });
    expect(
      document.querySelector('[data-project-card]:not([hidden]) h3'),
    ).toHaveTextContent(`Route project ${current}`);
    const edge = current === 1 ? 'Previous page' : 'Next page';
    expect(document.querySelector(`[aria-label="${edge}"]`)).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  },
);

it('renders approved project content and native actions', async () => {
  const project = catalogProjects(1)[0];
  const document = await renderDocument(ProjectDetail, {
    props: { project },
    params: { id: '1' },
    url: 'https://request.test/projects/1/?tracking=1',
    site: 'https://production.test/',
  });
  expectPage(document);
  expectMetadata(
    document,
    `Route project 1 | ${site.logoText}`,
    project.description,
  );
  expectCanonical(document, '/projects/1/');
  expect(document.querySelector('.project-notice')).toBeNull();
  const article = document.querySelector('main article')!;
  expect(
    [...article.querySelectorAll('h1, h2, .content-blocks p')].map((node) =>
      node.textContent?.trim(),
    ),
  ).toEqual([
    'Route project 1',
    'Approved article topic',
    'Approved article copy',
  ]);
  expect(article.querySelector('a[href="/projects/"]')).toBeInTheDocument();
  expect(article.querySelector('a[href="/#contacts"]')).toBeInTheDocument();
});

it.each(['demo', 'empty', 'nested-demo'])(
  'renders project edge case %s with publication metadata',
  async (kind) => {
    const content =
      kind === 'empty'
        ? []
        : (cloneFixture(routeFixture.demoBlocks) as ContentBlock[]);
    const project = buildProject({
      title: 'Edge project',
      status: kind === 'nested-demo' ? 'published' : 'demo',
      notice: null,
      date: undefined,
      content,
    });
    const document = await renderDocument(ProjectDetail, {
      props: { project },
      params: { id: String(project.id) },
      url: `https://request.test/projects/${project.id}/`,
    });
    expectPage(document);
    expectMetadata(
      document,
      `Edge project | ${site.logoText}`,
      project.description,
      true,
    );
    expect(document.querySelector('.project-notice')).toHaveTextContent(
      blockDemoNotice,
    );
    expect(document.querySelector('.project-meta')).toHaveTextContent(
      'Уточняется',
    );
    expect(document.querySelector('main')).not.toHaveTextContent(
      'Withheld draft article copy',
    );
    if (kind === 'empty') {
      expect(document.querySelectorAll('.content-block')).toHaveLength(0);
    } else {
      const notice = document.querySelector('.project-notice')!;
      const blocks = document.querySelector('.content-blocks')!;
      expect(notice.compareDocumentPosition(blocks) & 4).toBe(4);
      expect(blocks).toHaveTextContent('Visible demo article copy');
    }
    expect(
      document.querySelector('main a[href="/projects/"]'),
    ).toBeInTheDocument();
  },
);

const serviceRoutes = [
  { component: Montazh, id: 'montazh' },
  { component: Neon, id: 'neon' },
  { component: Structures, id: 'obyomnye-konstruktsii' },
  { component: Letters, id: 'svetovye-bukvy' },
  { component: Signs, id: 'vyveski' },
];

it('keeps every Astro page in the route coverage inventory', () => {
  const pages = import.meta.glob('../../src/pages/**/*.astro');
  const expected = [
    'index',
    '404',
    'privacy-policy',
    'terms-of-use',
    'projects/index',
    'projects/[id]',
    'projects/page/[page]',
    ...serviceRoutes.map(({ id }) => `services/${id}`),
  ].map((path) => `../../src/pages/${path}.astro`);
  expect(Object.keys(pages).sort()).toEqual(expected.sort());
});

function approvedServices() {
  const content = cloneFixture(services);
  content.demoMode = false;
  content.copyApproved = true;
  for (const service of content.items) {
    service.name = `Route service ${service.id}`;
    service.confirmed = true;
    service.copyApproved = true;
    service.image!.approved = true;
    service.article = {
      title: `Article ${service.id}`,
      description: `Summary ${service.id}`,
      approved: true,
      content: cloneFixture(routeFixture.publishedBlocks) as ContentBlock[],
    };
  }
  return content;
}

it.each(serviceRoutes)(
  'renders approved service route $id',
  async ({ component, id }) => {
    overrides.services = approvedServices();
    const document = await renderDocument(component, {
      url: `https://request.test/services/${id}/?tracking=1`,
      site: 'https://production.test/',
    });
    expectPage(document);
    expectMetadata(
      document,
      `Article ${id} | ${site.logoText}`,
      `Summary ${id}`,
    );
    expectCanonical(document, `/services/${id}/`);
    expect(document.querySelector('main h1')).toHaveTextContent(
      `Route service ${id}`,
    );
    expect(document.querySelector('.service-demo')).toBeNull();
    expect(
      [
        ...document.querySelectorAll(
          'main h1, main h2, main .content-blocks p',
        ),
      ].map((node) => node.textContent?.trim()),
    ).toEqual([
      `Route service ${id}`,
      'Approved article topic',
      'Approved article copy',
    ]);
    expect(
      document.querySelector('.service-actions a[href="/#order-inquiry"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('.service-actions a[href="/#services"]'),
    ).toHaveTextContent('Все услуги');
  },
);

it.each(serviceRoutes)(
  'renders demo service route $id before its copy',
  async ({ component, id }) => {
    overrides.services = approvedServices();
    const service = overrides.services.items.find((item) => item.id === id)!;
    service.article.content = cloneFixture(
      routeFixture.demoBlocks,
    ) as ContentBlock[];
    const document = await renderDocument(component, {
      url: `https://request.test/services/${id}/`,
    });
    expectPage(document);
    expectMetadata(
      document,
      `Article ${id} | ${site.logoText}`,
      `Summary ${id}`,
      true,
    );
    const notice = document.querySelector('.service-demo')!;
    const blocks = document.querySelector('.content-blocks')!;
    expect(notice).toHaveTextContent(overrides.services.demoNotice);
    expect(notice.compareDocumentPosition(blocks) & 4).toBe(4);
    expect(blocks).toHaveTextContent('Visible demo article copy');
    expect(blocks).not.toHaveTextContent('Withheld draft article copy');
  },
);

it.each(serviceRoutes)(
  'keeps empty service route $id usable',
  async ({ component, id }) => {
    overrides.services = approvedServices();
    overrides.services.copyApproved = false;
    const service = overrides.services.items.find((item) => item.id === id)!;
    service.article.content = [];
    const document = await renderDocument(component);
    expectPage(document);
    expectMetadata(
      document,
      `Article ${id} | ${site.logoText}`,
      `Summary ${id}`,
      true,
    );
    expect(document.querySelectorAll('.content-block')).toHaveLength(0);
    expect(
      document.querySelector('.service-actions a[href="/"]'),
    ).toHaveTextContent('На главную');
    expect(
      document.querySelector('.service-actions a[href="/#services"]'),
    ).toBeNull();
    expect(
      document.querySelector('.service-actions a[href="/#order-inquiry"]'),
    ).toBeInTheDocument();
  },
);
