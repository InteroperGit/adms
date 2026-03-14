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

// ── Config schemas ────────────────────────────────────────────────────────────
import { SiteDataSchema } from '../src/types/config/siteData';
import { ThemeSchema } from '../src/types/config/theme';
import { CategoriesSchema } from '../src/types/config/categories';
import { PortfolioConfigSchema } from '../src/types/config/portfolioConfig';
import { CookiesContentSchema } from '../src/types/config/cookies';
import { LegalDataSchema } from '../src/types/config/legalData';
import { SeoConfigSchema } from '../src/types/config/seo';
import { OrderFormsDataSchema } from '../src/types/config/orderForms';

// ── Section schemas ───────────────────────────────────────────────────────────
import { HeaderContentSchema } from '../src/types/sections/header/header';
import { HeroContentSchema } from '../src/types/sections/hero/hero';
import { CarouselSlidesSchema } from '../src/types/sections/carousel/carousel';
import { CarouselSectionContentSchema } from '../src/types/sections/carousel/carouselContent';
import { AboutSectionContentSchema } from '../src/types/sections/about/aboutContent';
import { AboutValuesSchema } from '../src/types/sections/about/aboutValues';
import { ServicesSectionContentSchema } from '../src/types/sections/services/servicesContent';
import { ServicesSchema } from '../src/types/sections/services/services';
import { AdvantagesSectionContentSchema } from '../src/types/sections/advantages/advantagesContent';
import { AdvantagesSchema } from '../src/types/sections/advantages/advantages';
import { CallToActionContentSchema } from '../src/types/sections/call-to-action/callToAction';
import { TestimonialsSectionContentSchema } from '../src/types/sections/testimonials/testimonialsContent';
import { TestimonialsSchema } from '../src/types/sections/testimonials/testimonials';
import { ContactContentSchema } from '../src/types/sections/contact/contact';
import { FooterContentSchema } from '../src/types/sections/footer/footer';
import { PortfolioPageContentSchema } from '../src/types/sections/portfolio/portfolioPage';

// ── Portfolio schemas ─────────────────────────────────────────────────────────
import { PortfolioCaseSchema, PortfolioSectionContentSchema } from '../src/types/portfolio';
import { PortfolioCaseContentSchema } from '../src/types/portfolio/portfolioCaseContent';
import { ImageGalleryContentSchema } from '../src/types/shared/imageGallery';

// ── Legal schemas ─────────────────────────────────────────────────────────────
import { LegalContentSchema } from '../src/types/legal';

type Subfolder = 'config' | 'sections' | 'portfolio' | 'legal';

interface SchemaEntry {
  subfolder: Subfolder;
  section?: string; // nested subfolder for sections (e.g., 'header', 'carousel', 'about')
  schema: z.ZodTypeAny;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const schemaRoot = path.join(root, 'data/_schema/schema');

// Map of output filename → { subfolder, section?, Zod schema }
const schemas: Record<string, SchemaEntry> = {
  // Config
  site: { subfolder: 'config', schema: SiteDataSchema },
  theme: { subfolder: 'config', schema: ThemeSchema },
  categories: { subfolder: 'config', schema: CategoriesSchema },
  portfolioConfig: { subfolder: 'config', schema: PortfolioConfigSchema },
  cookies: { subfolder: 'config', schema: CookiesContentSchema },
  legal: { subfolder: 'config', schema: LegalDataSchema },
  seo: { subfolder: 'config', schema: SeoConfigSchema },
  orderForms: { subfolder: 'config', schema: OrderFormsDataSchema },
  // Sections — organized by component subfolder
  header: { subfolder: 'sections', section: 'header', schema: HeaderContentSchema },
  hero: { subfolder: 'sections', section: 'hero', schema: HeroContentSchema },
  carousel: { subfolder: 'sections', section: 'carousel', schema: CarouselSlidesSchema },
  carouselContent: {
    subfolder: 'sections',
    section: 'carousel',
    schema: CarouselSectionContentSchema,
  },
  aboutContent: { subfolder: 'sections', section: 'about', schema: AboutSectionContentSchema },
  aboutValues: { subfolder: 'sections', section: 'about', schema: AboutValuesSchema },
  servicesContent: {
    subfolder: 'sections',
    section: 'services',
    schema: ServicesSectionContentSchema,
  },
  services: { subfolder: 'sections', section: 'services', schema: ServicesSchema },
  advantagesContent: {
    subfolder: 'sections',
    section: 'advantages',
    schema: AdvantagesSectionContentSchema,
  },
  advantages: { subfolder: 'sections', section: 'advantages', schema: AdvantagesSchema },
  callToAction: {
    subfolder: 'sections',
    section: 'call-to-action',
    schema: CallToActionContentSchema,
  },
  testimonialsContent: {
    subfolder: 'sections',
    section: 'testimonials',
    schema: TestimonialsSectionContentSchema,
  },
  testimonials: { subfolder: 'sections', section: 'testimonials', schema: TestimonialsSchema },
  contact: { subfolder: 'sections', section: 'contact', schema: ContactContentSchema },
  footer: { subfolder: 'sections', section: 'footer', schema: FooterContentSchema },
  portfolioPage: {
    subfolder: 'sections',
    section: 'portfolio',
    schema: PortfolioPageContentSchema,
  },
  portfolioSection: {
    subfolder: 'sections',
    section: 'portfolio',
    schema: PortfolioSectionContentSchema,
  },
  portfolioCase: {
    subfolder: 'sections',
    section: 'portfolio',
    schema: PortfolioCaseContentSchema,
  },
  imageGallery: { subfolder: 'sections', section: 'portfolio', schema: ImageGalleryContentSchema },
  // Portfolio
  portfolio: { subfolder: 'portfolio', schema: PortfolioCaseSchema },
  // Legal
  legalContent: { subfolder: 'legal', schema: LegalContentSchema },
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

function schemaUrl(subfolder: Subfolder, name: string, section?: string): string {
  if (section) {
    return `./data/_schema/schema/${subfolder}/${section}/${name}.schema.json`;
  }
  return `./data/_schema/schema/${subfolder}/${name}.schema.json`;
}

// Build json.schemas array: map each data file to its schema
const jsonSchemas = [
  // Config files
  { fileMatch: ['data/content/config/site.json'], url: schemaUrl('config', 'site') },
  { fileMatch: ['data/content/config/theme.json'], url: schemaUrl('config', 'theme') },
  { fileMatch: ['data/content/config/categories.json'], url: schemaUrl('config', 'categories') },
  {
    fileMatch: ['data/content/config/portfolio.json'],
    url: schemaUrl('config', 'portfolioConfig'),
  },
  { fileMatch: ['data/content/config/cookies.json'], url: schemaUrl('config', 'cookies') },
  { fileMatch: ['data/content/config/legal.json'], url: schemaUrl('config', 'legal') },
  { fileMatch: ['data/content/config/seo.json'], url: schemaUrl('config', 'seo') },
  { fileMatch: ['data/content/config/orderForms.json'], url: schemaUrl('config', 'orderForms') },
  // Section files — organized by component subfolder
  {
    fileMatch: ['data/content/sections/header/header.json'],
    url: schemaUrl('sections', 'header', 'header'),
  },
  {
    fileMatch: ['data/content/sections/hero/hero.json'],
    url: schemaUrl('sections', 'hero', 'hero'),
  },
  {
    fileMatch: ['data/content/sections/carousel/carousel.json'],
    url: schemaUrl('sections', 'carousel', 'carousel'),
  },
  {
    fileMatch: ['data/content/sections/carousel/carouselContent.json'],
    url: schemaUrl('sections', 'carouselContent', 'carousel'),
  },
  {
    fileMatch: ['data/content/sections/about/aboutContent.json'],
    url: schemaUrl('sections', 'aboutContent', 'about'),
  },
  {
    fileMatch: ['data/content/sections/about/aboutValues.json'],
    url: schemaUrl('sections', 'aboutValues', 'about'),
  },
  {
    fileMatch: ['data/content/sections/services/servicesContent.json'],
    url: schemaUrl('sections', 'servicesContent', 'services'),
  },
  {
    fileMatch: ['data/content/sections/services/services.json'],
    url: schemaUrl('sections', 'services', 'services'),
  },
  {
    fileMatch: ['data/content/sections/advantages/advantagesContent.json'],
    url: schemaUrl('sections', 'advantagesContent', 'advantages'),
  },
  {
    fileMatch: ['data/content/sections/advantages/advantages.json'],
    url: schemaUrl('sections', 'advantages', 'advantages'),
  },
  {
    fileMatch: ['data/content/sections/call-to-action/callToAction.json'],
    url: schemaUrl('sections', 'callToAction', 'call-to-action'),
  },
  {
    fileMatch: ['data/content/sections/testimonials/testimonialsContent.json'],
    url: schemaUrl('sections', 'testimonialsContent', 'testimonials'),
  },
  {
    fileMatch: ['data/content/sections/testimonials/testimonials.json'],
    url: schemaUrl('sections', 'testimonials', 'testimonials'),
  },
  {
    fileMatch: ['data/content/sections/contact/contact.json'],
    url: schemaUrl('sections', 'contact', 'contact'),
  },
  {
    fileMatch: ['data/content/sections/footer/footer.json'],
    url: schemaUrl('sections', 'footer', 'footer'),
  },
  {
    fileMatch: ['data/content/sections/portfolio/portfolioPage.json'],
    url: schemaUrl('sections', 'portfolioPage', 'portfolio'),
  },
  {
    fileMatch: ['data/content/sections/portfolio/portfolioSection.json'],
    url: schemaUrl('sections', 'portfolioSection', 'portfolio'),
  },
  {
    fileMatch: ['data/content/sections/portfolio/portfolioCase.json'],
    url: schemaUrl('sections', 'portfolioCase', 'portfolio'),
  },
  {
    fileMatch: ['data/content/sections/portfolio/imageGallery.json'],
    url: schemaUrl('sections', 'imageGallery', 'portfolio'),
  },
  // Legal files (all three share the same schema)
  {
    fileMatch: [
      'data/content/legal/privacyPolicy.json',
      'data/content/legal/userAgreement.json',
      'data/content/legal/consent.json',
    ],
    url: schemaUrl('legal', 'legalContent'),
  },
  // Portfolio case files
  {
    fileMatch: ['data/content/portfolio/**/*.json'],
    url: schemaUrl('portfolio', 'portfolio'),
  },
  // Array-root example files — can't carry inline $schema, mapped here instead
  {
    fileMatch: ['data/_schema/examples/config/categories.example.json'],
    url: schemaUrl('config', 'categories'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/carousel/carousel.example.json'],
    url: schemaUrl('sections', 'carousel', 'carousel'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/about/aboutValues.example.json'],
    url: schemaUrl('sections', 'aboutValues', 'about'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/services/services.example.json'],
    url: schemaUrl('sections', 'services', 'services'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/advantages/advantages.example.json'],
    url: schemaUrl('sections', 'advantages', 'advantages'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/testimonials/testimonials.example.json'],
    url: schemaUrl('sections', 'testimonials', 'testimonials'),
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

function getSchemaPathForFile(filePath: string): string | null {
  const relativePath = path.relative(root, filePath).replace(/\\/g, '/');

  // Config files
  if (relativePath.startsWith('data/content/config/')) {
    const filename = path.basename(filePath, '.json');
    // categories.json is array-root, skip
    if (filename === 'categories') {
      return null;
    }
    return `../../_schema/schema/config/${filename}.schema.json`;
  }

  // Legal files - all share one schema
  if (relativePath.startsWith('data/content/legal/')) {
    return '../../_schema/schema/legal/legalContent.schema.json';
  }

  // Section files
  if (relativePath.startsWith('data/content/sections/')) {
    const filename = path.basename(filePath, '.json');
    // Array-root files - skip
    const arrayRootFiles = ['carousel', 'testimonials', 'advantages', 'services', 'aboutValues'];
    if (arrayRootFiles.includes(filename)) {
      return null;
    }
    // Extract section subfolder: data/content/sections/{section}/{filename}.json
    const parts = relativePath.split('/');
    const section = parts[3];
    return `../../_schema/schema/sections/${section}/${filename}.schema.json`;
  }

  // Portfolio case files - nested: portfolio/{category}/{year}/{month}/{filename}.json
  if (relativePath.startsWith('data/content/portfolio/')) {
    return '../../../../../_schema/schema/portfolio/portfolio.schema.json';
  }

  return null;
}

function isObjectRoot(content: unknown): boolean {
  return typeof content === 'object' && content !== null && !Array.isArray(content);
}

function injectSchema(obj: Record<string, unknown>, schemaPath: string): Record<string, unknown> {
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

const contentDir = path.join(root, 'data/content');
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
