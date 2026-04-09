/**
 * Generate JSON Schema files from Zod schemas for IDE validation and autocomplete.
 * Output mirrors the examples/ subfolder structure:
 *   data/_schema/schema/config/<name>.schema.json
 *   data/_schema/schema/sections/<name>.schema.json
 *   data/_schema/schema/portfolio/<name>.schema.json
 *   data/_schema/schema/legal/<name>.schema.json
 *
 * Also writes .vscode/settings.json to map data files → schemas for VS Code.
 * Run via: pnpm gen-schemas
 *
 * Requires data/content/ files to be present (same requirement as pnpm validate).
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

// ── Path constants ─────────────────────────────────────────────────────────────

const DATA_CONTENT_DIR = 'data/content';
const CONFIG_DIR = `${DATA_CONTENT_DIR}/config`;
const SECTIONS_DIR = `${DATA_CONTENT_DIR}/sections`;
const LEGAL_DIR = `${DATA_CONTENT_DIR}/legal`;
const ARTICLES_DIR = `${DATA_CONTENT_DIR}/articles`;
const SCHEMA_BASE = './data/_schema/schema';
const EXAMPLES_DIR = 'data/_schema/examples';

// Relative schema paths used in $schema refs and vscode settings
const REL_CONFIG = `../../_schema/schema/config`;
const REL_SECTIONS = `../../_schema/schema/sections`;
const REL_LEGAL = `../../_schema/schema/legal`;

// Section subfolders used for both source data and schema output
const SECTION_SUBFOLDERS = {
  header: 'header',
  hero: 'hero',
  carousel: 'carousel',
  about: 'about',
  services: 'services',
  advantages: 'advantages',
  'call-to-action': 'call-to-action',
  testimonials: 'testimonials',
  contact: 'contact',
  footer: 'footer',
  portfolio: 'portfolio',
} as const;

// Array-root files (no inline $schema — mapped via .vscode/settings.json only)
const ARRAY_ROOT_CONFIG = ['categories'];
const ARRAY_ROOT_SECTIONS = ['carousel', 'testimonials', 'advantages', 'services', 'aboutValues'];

// Schema output subfolder names
const SUBFOLDERS = {
  config: 'config',
  sections: 'sections',
  portfolio: 'portfolio',
  legal: 'legal',
  articles: 'articles',
} as const;

// ── Config schemas ────────────────────────────────────────────────────────────
import { SiteDataSchema } from '../../src/types/config/siteData';
import { ThemeSchema } from '../../src/types/config/theme';
import { CategoriesSchema } from '../../src/types/config/categories';
import { PortfolioConfigSchema } from '../../src/types/config/portfolioConfig';
import { CookiesContentSchema } from '../../src/types/config/cookies';
import { LegalDataSchema } from '../../src/types/config/legalData';
import { SeoConfigSchema } from '../../src/types/config/seo';
import { OrderFormsDataSchema } from '../../src/types/config/orderForms';
import { DefaultArticleCtaSchema } from '../../src/types/config/defaultArticleCta';
import { NotFoundContentSchema } from '../../src/types/config/notFound';
import { NewsConfigSchema } from '../../src/types/config/newsConfig';
import { BlogConfigSchema } from '../../src/types/config/blogConfig';
import { ArticleTypesConfigSchema } from '../../src/types/config/articleTypes';

// ── Section schemas ───────────────────────────────────────────────────────────
import { HeaderContentSchema } from '../../src/types/sections/header/header';
import { HeroContentSchema } from '../../src/types/sections/hero/hero';
import { CarouselSlidesSchema } from '../../src/types/sections/carousel/carousel';
import { CarouselSectionContentSchema } from '../../src/types/sections/carousel/carouselContent';
import { AboutSectionContentSchema } from '../../src/types/sections/about/aboutContent';
import { AboutValuesSchema } from '../../src/types/sections/about/aboutValues';
import { ServicesSectionContentSchema } from '../../src/types/sections/services/servicesContent';
import { ServicesSchema } from '../../src/types/sections/services/services';
import { AdvantagesSectionContentSchema } from '../../src/types/sections/advantages/advantagesContent';
import { AdvantagesSchema } from '../../src/types/sections/advantages/advantages';
import { CallToActionContentSchema } from '../../src/types/sections/call-to-action/callToAction';
import { TestimonialsSectionContentSchema } from '../../src/types/sections/testimonials/testimonialsContent';
import { TestimonialsSchema } from '../../src/types/sections/testimonials/testimonials';
import { ContactContentSchema } from '../../src/types/sections/contact/contact';
import { FooterContentSchema } from '../../src/types/sections/footer/footer';
// ── Portfolio schemas ─────────────────────────────────────────────────────────
import { PortfolioSectionContentSchema } from '../../src/types/sections/portfolio/portfolioContent';
import { ImageGalleryContentSchema } from '../../src/types/shared/imageGallery';

// ── Legal schemas ─────────────────────────────────────────────────────────────
import { LegalContentSchema } from '../../src/types/legal';

// ── Article schemas ────────────────────────────────────────────────────────────
import {
  BaseArticleSchema,
  PortfolioArticleSchema,
  ServiceArticleSchema,
  NewsArticleSchema,
  BlogArticleSchema,
} from '../../src/types/articles';

type Subfolder = (typeof SUBFOLDERS)[keyof typeof SUBFOLDERS];

interface SchemaEntry {
  subfolder: Subfolder;
  section?: string; // nested subfolder for sections (e.g., 'header', 'carousel', 'about')
  schema: z.ZodTypeAny;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const schemaRoot = path.join(root, SCHEMA_BASE);
const contentDir = path.join(root, DATA_CONTENT_DIR);

// Map of output filename → { subfolder, section?, Zod schema }
const schemas: Record<string, SchemaEntry> = {
  // Config
  site: { subfolder: SUBFOLDERS.config, schema: SiteDataSchema },
  theme: { subfolder: SUBFOLDERS.config, schema: ThemeSchema },
  categories: { subfolder: SUBFOLDERS.config, schema: CategoriesSchema },
  portfolioConfig: { subfolder: SUBFOLDERS.config, schema: PortfolioConfigSchema },
  cookies: { subfolder: SUBFOLDERS.config, schema: CookiesContentSchema },
  legal: { subfolder: SUBFOLDERS.config, schema: LegalDataSchema },
  seo: { subfolder: SUBFOLDERS.config, schema: SeoConfigSchema },
  orderForms: { subfolder: SUBFOLDERS.config, schema: OrderFormsDataSchema },
  notFound: { subfolder: SUBFOLDERS.config, schema: NotFoundContentSchema },
  defaultArticleCta: { subfolder: SUBFOLDERS.config, schema: DefaultArticleCtaSchema },
  articleTypes: { subfolder: SUBFOLDERS.config, schema: ArticleTypesConfigSchema },
  news: { subfolder: SUBFOLDERS.config, schema: NewsConfigSchema },
  blog: { subfolder: SUBFOLDERS.config, schema: BlogConfigSchema },
  // Sections — organized by component subfolder
  header: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.header,
    schema: HeaderContentSchema,
  },
  hero: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.hero,
    schema: HeroContentSchema,
  },
  carousel: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.carousel,
    schema: CarouselSlidesSchema,
  },
  carouselContent: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.carousel,
    schema: CarouselSectionContentSchema,
  },
  aboutContent: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.about,
    schema: AboutSectionContentSchema,
  },
  aboutValues: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.about,
    schema: AboutValuesSchema,
  },
  servicesContent: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.services,
    schema: ServicesSectionContentSchema,
  },
  services: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.services,
    schema: ServicesSchema,
  },
  advantagesContent: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.advantages,
    schema: AdvantagesSectionContentSchema,
  },
  advantages: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.advantages,
    schema: AdvantagesSchema,
  },
  callToAction: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS['call-to-action'],
    schema: CallToActionContentSchema,
  },
  testimonialsContent: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.testimonials,
    schema: TestimonialsSectionContentSchema,
  },
  testimonials: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.testimonials,
    schema: TestimonialsSchema,
  },
  contact: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.contact,
    schema: ContactContentSchema,
  },
  footer: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.footer,
    schema: FooterContentSchema,
  },
  portfolioSection: {
    subfolder: SUBFOLDERS.sections,
    section: SECTION_SUBFOLDERS.portfolio,
    schema: PortfolioSectionContentSchema,
  },
  imageGallery: { subfolder: SUBFOLDERS.config, schema: ImageGalleryContentSchema },
  // Legal
  legalContent: { subfolder: SUBFOLDERS.legal, schema: LegalContentSchema },
  // Articles
  article: { subfolder: SUBFOLDERS.articles, schema: BaseArticleSchema },
  portfolio: { subfolder: SUBFOLDERS.articles, schema: PortfolioArticleSchema },
  service: { subfolder: SUBFOLDERS.articles, schema: ServiceArticleSchema },
  newsArticle: { subfolder: SUBFOLDERS.articles, schema: NewsArticleSchema },
  blogArticle: { subfolder: SUBFOLDERS.articles, schema: BlogArticleSchema },
};

let generated = 0;
let errors = 0;

console.log('\nGenerating JSON Schema files...\n');

for (const [name, { subfolder, section, schema }] of Object.entries(schemas)) {
  try {
    const jsonSchema = z.toJSONSchema(schema);
    const outDir = section
      ? path.join(schemaRoot, subfolder, section)
      : path.join(schemaRoot, subfolder);
    mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${name}.schema.json`);
    writeFileSync(outPath, JSON.stringify(jsonSchema, null, 2) + '\n', 'utf-8');
    const logPath = section
      ? `${subfolder}/${section}/${name}.schema.json`
      : `${subfolder}/${name}.schema.json`;
    console.log(`  ✓ ${logPath}`);
    generated++;
  } catch (err) {
    console.error(`  ✗ ${name}: ${(err as Error).message}`);
    errors++;
  }
}

// ── Generate .vscode/settings.json for IDE schema mapping ────────────────────

const vscodeDir = path.join(root, '.vscode');
mkdirSync(vscodeDir, { recursive: true });
const settingsPath = path.join(vscodeDir, 'settings.json');

// Read existing settings to merge, if any
let existing: Record<string, unknown> = {};
if (existsSync(settingsPath)) {
  try {
    existing = JSON.parse(readFileSync(settingsPath, 'utf-8')) as Record<string, unknown>;
  } catch {
    // ignore parse errors — overwrite
  }
}

export function schemaUrl(subfolder: Subfolder, name: string, section?: string): string {
  const base = `${SCHEMA_BASE}/${subfolder}`;
  return section ? `${base}/${section}/${name}.schema.json` : `${base}/${name}.schema.json`;
}

type SectionSubfolder = (typeof SECTION_SUBFOLDERS)[keyof typeof SECTION_SUBFOLDERS];

// Helper to build a single jsonSchemas entry
function schemaEntry(
  filePattern: string | string[],
  subfolder: Subfolder,
  name: string,
  section?: string
) {
  return {
    fileMatch: Array.isArray(filePattern) ? filePattern : [filePattern],
    url: schemaUrl(subfolder, name, section),
  };
}

const configSchema = (name: string) =>
  schemaEntry(`${CONFIG_DIR}/${name}.json`, SUBFOLDERS.config, name);
const sectionSchema = (sub: SectionSubfolder, name: string) =>
  schemaEntry(`${SECTIONS_DIR}/${sub}/${name}.json`, SUBFOLDERS.sections, name, sub);

// Mapping of section subfolder → example file schema name (differs for some)
const EXAMPLE_SCHEMA_NAME: Record<string, string> = {
  carousel: 'carousel',
  about: 'aboutValues',
  services: 'services',
  advantages: 'advantages',
  testimonials: 'testimonials',
};

// Build json.schemas array: map each data file to its schema
const jsonSchemas = [
  // Config files
  configSchema('site'),
  configSchema('theme'),
  configSchema('categories'),
  configSchema('portfolioConfig'),
  configSchema('cookies'),
  configSchema('legal'),
  configSchema('seo'),
  configSchema('orderForms'),
  configSchema('notFound'),
  configSchema('imageGallery'),
  configSchema('defaultArticleCta'),
  configSchema('articleTypes'),
  configSchema('news'),
  configSchema('blog'),

  // Section files — organized by component subfolder
  sectionSchema('header', 'header'),
  sectionSchema('hero', 'hero'),
  sectionSchema('carousel', 'carousel'),
  sectionSchema('carousel', 'carouselContent'),
  sectionSchema('about', 'aboutContent'),
  sectionSchema('about', 'aboutValues'),
  sectionSchema('services', 'servicesContent'),
  sectionSchema('services', 'services'),
  sectionSchema('advantages', 'advantagesContent'),
  sectionSchema('advantages', 'advantages'),
  sectionSchema('call-to-action', 'callToAction'),
  sectionSchema('testimonials', 'testimonialsContent'),
  sectionSchema('testimonials', 'testimonials'),
  sectionSchema('contact', 'contact'),
  sectionSchema('footer', 'footer'),
  sectionSchema('portfolio', 'portfolioSection'),

  // Legal files (all three share the same schema)
  {
    fileMatch: [
      `${LEGAL_DIR}/privacyPolicy.json`,
      `${LEGAL_DIR}/userAgreement.json`,
      `${LEGAL_DIR}/consent.json`,
    ],
    url: schemaUrl(SUBFOLDERS.legal, 'legalContent'),
  },

  // Portfolio case files
  {
    fileMatch: ['data/content/articles/portfolio/**/*.json'],
    url: schemaUrl(SUBFOLDERS.articles, 'portfolio'),
  },

  // Array-root example files — can't carry inline $schema, mapped here instead
  {
    fileMatch: [`${EXAMPLES_DIR}/config/categories.example.json`],
    url: schemaUrl(SUBFOLDERS.config, 'categories'),
  },
  ...Object.entries(SECTION_SUBFOLDERS)
    .filter(([sub]) => EXAMPLE_SCHEMA_NAME[sub])
    .map(([sub, section]) => ({
      fileMatch: [`${EXAMPLES_DIR}/sections/${sub}/${EXAMPLE_SCHEMA_NAME[sub]}.example.json`],
      url: schemaUrl(SUBFOLDERS.sections, EXAMPLE_SCHEMA_NAME[sub], section),
    })),

  // Article example files
  {
    fileMatch: [`${EXAMPLES_DIR}/articles/portfolio/portfolio.example.json`],
    url: schemaUrl(SUBFOLDERS.articles, 'article'),
  },
  {
    fileMatch: [`${EXAMPLES_DIR}/articles/services/service.example.json`],
    url: schemaUrl(SUBFOLDERS.articles, 'service'),
  },
  {
    fileMatch: [`${EXAMPLES_DIR}/articles/news/news.example.json`],
    url: schemaUrl(SUBFOLDERS.articles, 'news'),
  },
  {
    fileMatch: [`${EXAMPLES_DIR}/articles/blog/blog.example.json`],
    url: schemaUrl(SUBFOLDERS.articles, 'blog'),
  },

  // Article content file globs
  {
    fileMatch: ['data/content/articles/services/**/*.json'],
    url: schemaUrl(SUBFOLDERS.articles, 'service'),
  },
  {
    fileMatch: ['data/content/articles/news/**/*.json'],
    url: schemaUrl(SUBFOLDERS.articles, 'news'),
  },
  {
    fileMatch: ['data/content/articles/blog/**/*.json'],
    url: schemaUrl(SUBFOLDERS.articles, 'blog'),
  },
  {
    fileMatch: ['data/content/articles/portfolio/**/*.json'],
    url: schemaUrl(SUBFOLDERS.articles, 'portfolio'),
  },
];

const settings = {
  ...existing,
  'json.schemas': jsonSchemas,
};

writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
console.log('\n  ✓ .vscode/settings.json (json.schemas mappings)');

// ── Inject $schema into data/content JSON files ────────────────────────────────

console.log('\nInjecting $schema references into data/content/ JSON files...\n');

function walkDir(dir: string): string[] {
  const files: string[] = [];
  try {
    const items = readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...walkDir(fullPath));
      } else if (item.isFile() && item.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  } catch {
    // ignore errors walking dirs
  }
  return files;
}

export function getSchemaPathForFile(filePath: string): string | null {
  const relativePath = path.relative(root, filePath).replace(/\\/g, '/');
  const configPrefix = `${CONFIG_DIR}/`;
  const legalPrefix = `${LEGAL_DIR}/`;
  const sectionsPrefix = `${SECTIONS_DIR}/`;

  // Config files
  if (relativePath.startsWith(configPrefix)) {
    const filename = path.basename(filePath, '.json');
    if (ARRAY_ROOT_CONFIG.includes(filename)) {
      return null;
    }
    return `${REL_CONFIG}/${filename}.schema.json`;
  }

  // Legal files — all share one schema
  if (relativePath.startsWith(legalPrefix)) {
    return `${REL_LEGAL}/legalContent.schema.json`;
  }

  // Section files
  if (relativePath.startsWith(sectionsPrefix)) {
    const filename = path.basename(filePath, '.json');
    if (ARRAY_ROOT_SECTIONS.includes(filename)) {
      return null;
    }
    const parts = relativePath.split('/');
    const section = parts[3];
    return `${REL_SECTIONS}/${section}/${filename}.schema.json`;
  }

  // Article files — blog, news, services, portfolio
  const articlesPrefix = `${ARTICLES_DIR}/`;
  if (relativePath.startsWith(articlesPrefix)) {
    const parts = relativePath.split('/');
    const articleType = parts[3]; // data/content/articles/blog -> blog, data/content/articles/portfolio -> portfolio
    const ups = '../'.repeat(parts.length - 3);
    return `${ups}_schema/schema/articles/${articleType}.schema.json`;
  }

  return null;
}

export function isObjectRoot(content: unknown): boolean {
  return typeof content === 'object' && content !== null && !Array.isArray(content);
}

export function injectSchema(
  obj: Record<string, unknown>,
  schemaPath: string
): Record<string, unknown> {
  // Create new object with $schema as first field
  const result: Record<string, unknown> = {
    $schema: schemaPath,
  };

  // Copy all other fields
  for (const [key, value] of Object.entries(obj)) {
    if (key !== '$schema') {
      result[key] = value;
    }
  }

  return result;
}

const jsonFiles = walkDir(contentDir);
let injected = 0;
let skipped = 0;

for (const filePath of jsonFiles) {
  try {
    const content = JSON.parse(readFileSync(filePath, 'utf-8'));

    // Skip if not object-root
    if (!isObjectRoot(content)) {
      skipped++;
      continue;
    }

    const schemaPath = getSchemaPathForFile(filePath);
    if (!schemaPath) {
      skipped++;
      continue;
    }

    const updated = injectSchema(content as Record<string, unknown>, schemaPath);
    writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n', 'utf-8');

    const relPath = path.relative(root, filePath).replace(/\\/g, '/');
    console.log(`  ✓ ${relPath}`);
    injected++;
  } catch (err) {
    const relPath = path.relative(root, filePath).replace(/\\/g, '/');
    console.error(`  ✗ ${relPath}: ${(err as Error).message}`);
  }
}

console.log(`✅  $schema injected into ${injected} file(s), ${skipped} skipped (array-root)\n`);

if (errors > 0) {
  console.error(`❌  ${errors} error(s) — ${generated} schema(s) generated.`);
  process.exit(1);
} else {
  console.log(`✅  ${generated} JSON Schema files written to data/_schema/schema/`);
  console.log(`✅  .vscode/settings.json updated with schema mappings`);
  console.log(`✅  All object-root data files updated with inline $schema references\n`);
}
