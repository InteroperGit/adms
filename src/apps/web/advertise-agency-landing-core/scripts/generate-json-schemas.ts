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

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
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
import { HeaderContentSchema } from '../src/types/sections/header';
import { HeroContentSchema } from '../src/types/sections/hero';
import { CarouselSlidesSchema } from '../src/types/sections/carousel';
import { CarouselSectionContentSchema } from '../src/types/sections/carouselContent';
import { AboutSectionContentSchema } from '../src/types/sections/aboutContent';
import { AboutValuesSchema } from '../src/types/sections/aboutValues';
import { ServicesSectionContentSchema } from '../src/types/sections/servicesContent';
import { ServicesSchema } from '../src/types/sections/services';
import { AdvantagesSectionContentSchema } from '../src/types/sections/advantagesContent';
import { AdvantagesSchema } from '../src/types/sections/advantages';
import { CallToActionContentSchema } from '../src/types/sections/callToAction';
import { TestimonialsSectionContentSchema } from '../src/types/sections/testimonialsContent';
import { TestimonialsSchema } from '../src/types/sections/testimonials';
import { ContactContentSchema } from '../src/types/sections/contact';
import { FooterContentSchema } from '../src/types/sections/footer';
import { PortfolioPageContentSchema } from '../src/types/sections/portfolioPage';

// ── Portfolio schemas ─────────────────────────────────────────────────────────
import { PortfolioCaseSchema, PortfolioSectionContentSchema } from '../src/types/portfolio';
import { PortfolioCaseContentSchema } from '../src/types/portfolio/portfolioCaseContent';
import { ImageGalleryContentSchema } from '../src/types/portfolio/imageGallery';

// ── Legal schemas ─────────────────────────────────────────────────────────────
import { LegalContentSchema } from '../src/types/legal';

type Subfolder = 'config' | 'sections' | 'portfolio' | 'legal';

interface SchemaEntry {
  subfolder: Subfolder;
  schema: z.ZodTypeAny;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const schemaRoot = path.join(root, 'data/_schema/schema');

// Map of output filename → { subfolder, Zod schema }
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
  // Sections
  header: { subfolder: 'sections', schema: HeaderContentSchema },
  hero: { subfolder: 'sections', schema: HeroContentSchema },
  carousel: { subfolder: 'sections', schema: CarouselSlidesSchema },
  carouselContent: { subfolder: 'sections', schema: CarouselSectionContentSchema },
  aboutContent: { subfolder: 'sections', schema: AboutSectionContentSchema },
  aboutValues: { subfolder: 'sections', schema: AboutValuesSchema },
  servicesContent: { subfolder: 'sections', schema: ServicesSectionContentSchema },
  services: { subfolder: 'sections', schema: ServicesSchema },
  advantagesContent: { subfolder: 'sections', schema: AdvantagesSectionContentSchema },
  advantages: { subfolder: 'sections', schema: AdvantagesSchema },
  callToAction: { subfolder: 'sections', schema: CallToActionContentSchema },
  testimonialsContent: { subfolder: 'sections', schema: TestimonialsSectionContentSchema },
  testimonials: { subfolder: 'sections', schema: TestimonialsSchema },
  contact: { subfolder: 'sections', schema: ContactContentSchema },
  footer: { subfolder: 'sections', schema: FooterContentSchema },
  portfolioPage: { subfolder: 'sections', schema: PortfolioPageContentSchema },
  portfolioSection: { subfolder: 'sections', schema: PortfolioSectionContentSchema },
  portfolioCase: { subfolder: 'sections', schema: PortfolioCaseContentSchema },
  imageGallery: { subfolder: 'sections', schema: ImageGalleryContentSchema },
  // Portfolio
  portfolio: { subfolder: 'portfolio', schema: PortfolioCaseSchema },
  // Legal
  legalContent: { subfolder: 'legal', schema: LegalContentSchema },
};

let generated = 0;
let errors = 0;

console.log('\nGenerating JSON Schema files...\n');

for (const [name, { subfolder, schema }] of Object.entries(schemas)) {
  try {
    const jsonSchema = z.toJSONSchema(schema);
    const outDir = path.join(schemaRoot, subfolder);
    mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${name}.schema.json`);
    writeFileSync(outPath, JSON.stringify(jsonSchema, null, 2) + '\n', 'utf-8');
    console.log(`  ✓ ${subfolder}/${name}.schema.json`);
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

function schemaUrl(subfolder: Subfolder, name: string): string {
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
  // Section files
  { fileMatch: ['data/content/sections/header.json'], url: schemaUrl('sections', 'header') },
  { fileMatch: ['data/content/sections/hero.json'], url: schemaUrl('sections', 'hero') },
  { fileMatch: ['data/content/sections/carousel.json'], url: schemaUrl('sections', 'carousel') },
  {
    fileMatch: ['data/content/sections/carouselContent.json'],
    url: schemaUrl('sections', 'carouselContent'),
  },
  {
    fileMatch: ['data/content/sections/aboutContent.json'],
    url: schemaUrl('sections', 'aboutContent'),
  },
  {
    fileMatch: ['data/content/sections/aboutValues.json'],
    url: schemaUrl('sections', 'aboutValues'),
  },
  {
    fileMatch: ['data/content/sections/servicesContent.json'],
    url: schemaUrl('sections', 'servicesContent'),
  },
  { fileMatch: ['data/content/sections/services.json'], url: schemaUrl('sections', 'services') },
  {
    fileMatch: ['data/content/sections/advantagesContent.json'],
    url: schemaUrl('sections', 'advantagesContent'),
  },
  {
    fileMatch: ['data/content/sections/advantages.json'],
    url: schemaUrl('sections', 'advantages'),
  },
  {
    fileMatch: ['data/content/sections/callToAction.json'],
    url: schemaUrl('sections', 'callToAction'),
  },
  {
    fileMatch: ['data/content/sections/testimonialsContent.json'],
    url: schemaUrl('sections', 'testimonialsContent'),
  },
  {
    fileMatch: ['data/content/sections/testimonials.json'],
    url: schemaUrl('sections', 'testimonials'),
  },
  { fileMatch: ['data/content/sections/contact.json'], url: schemaUrl('sections', 'contact') },
  { fileMatch: ['data/content/sections/footer.json'], url: schemaUrl('sections', 'footer') },
  {
    fileMatch: ['data/content/sections/portfolioPage.json'],
    url: schemaUrl('sections', 'portfolioPage'),
  },
  {
    fileMatch: ['data/content/sections/portfolioSection.json'],
    url: schemaUrl('sections', 'portfolioSection'),
  },
  {
    fileMatch: ['data/content/sections/portfolioCase.json'],
    url: schemaUrl('sections', 'portfolioCase'),
  },
  {
    fileMatch: ['data/content/sections/imageGallery.json'],
    url: schemaUrl('sections', 'imageGallery'),
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
    fileMatch: ['data/content/portfolio/*.json'],
    url: schemaUrl('portfolio', 'portfolio'),
  },
  // Array-root example files — can't carry inline $schema, mapped here instead
  {
    fileMatch: ['data/_schema/examples/config/categories.example.json'],
    url: schemaUrl('config', 'categories'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/carousel.example.json'],
    url: schemaUrl('sections', 'carousel'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/aboutValues.example.json'],
    url: schemaUrl('sections', 'aboutValues'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/services.example.json'],
    url: schemaUrl('sections', 'services'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/advantages.example.json'],
    url: schemaUrl('sections', 'advantages'),
  },
  {
    fileMatch: ['data/_schema/examples/sections/testimonials.example.json'],
    url: schemaUrl('sections', 'testimonials'),
  },
];

const settings = {
  ...existing,
  'json.schemas': jsonSchemas,
};

writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
console.log('\n  ✓ .vscode/settings.json (json.schemas mappings)');

console.log('');
if (errors > 0) {
  console.error(`❌  ${errors} error(s) — ${generated} schema(s) generated.`);
  process.exit(1);
} else {
  console.log(`✅  ${generated} JSON Schema files written to data/_schema/schema/`);
}
