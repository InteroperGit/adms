/**
 * Validate all data files against their Zod schemas.
 * Run via: pnpm validate
 *
 * Uses vite-node so Vite aliases (@/, @data/) work correctly.
 * Any schema.parse() failure throws a ZodError with a clear field-level message.
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ── Config schemas ─────────────────────────────────────────────────────────────
import { SiteDataSchema } from '../src/types/config/siteData';
import { ThemeSchema } from '../src/types/config/theme';
import { CategoriesSchema } from '../src/types/config/categories';
import { PortfolioConfigSchema } from '../src/types/config/portfolioConfig';
import { CookiesContentSchema } from '../src/types/config/cookies';
import { LegalDataSchema } from '../src/types/config/legalData';
import { SeoConfigSchema } from '../src/types/config/seo';
import { OrderFormsDataSchema } from '../src/types/config/orderForms';

// ── Section schemas ────────────────────────────────────────────────────────────
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

// ── Portfolio schemas ──────────────────────────────────────────────────────────
import { PortfolioCaseSchema, PortfolioSectionContentSchema } from '../src/types/portfolio';
import { PortfolioCaseContentSchema } from '../src/types/portfolio/portfolioCaseContent';
import { ImageGalleryContentSchema } from '../src/types/shared/imageGallery';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

let errors = 0;

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function check(label: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${label}`);
  } catch (err) {
    console.error(`  ✗ ${label}`);
    console.error((err as Error).message);
    errors++;
  }
}

function fileExists(filePath: string): boolean {
  try {
    readFileSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function walkJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkJsonFiles(full);
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      return [full];
    }
    return [];
  });
}

function cfg(name: string) {
  return path.join(root, 'data/content/config', name);
}

function sec(name: string) {
  return path.join(root, 'data/content/sections', name);
}

// ── Config files ───────────────────────────────────────────────────────────────

console.log('\nConfig:');

check('site.json', () => SiteDataSchema.parse(readJson(cfg('site.json'))));
check('theme.json', () => ThemeSchema.parse(readJson(cfg('theme.json'))));
check('categories.json', () => CategoriesSchema.parse(readJson(cfg('categories.json'))));
check('portfolio.json', () => PortfolioConfigSchema.parse(readJson(cfg('portfolio.json'))));
check('cookies.json', () => CookiesContentSchema.parse(readJson(cfg('cookies.json'))));

if (fileExists(cfg('legal.json'))) {
  check('legal.json', () => LegalDataSchema.parse(readJson(cfg('legal.json'))));
} else {
  console.log('  – legal.json (not found, skipped)');
}

if (fileExists(cfg('seo.json'))) {
  check('seo.json', () => SeoConfigSchema.parse(readJson(cfg('seo.json'))));
} else {
  console.log('  – seo.json (not found, skipped)');
}

if (fileExists(cfg('orderForms.json'))) {
  check('orderForms.json', () => OrderFormsDataSchema.parse(readJson(cfg('orderForms.json'))));
} else {
  console.log('  – orderForms.json (not found, skipped)');
}

// ── Section files ──────────────────────────────────────────────────────────────

console.log('\nSections:');

check('header/header.json', () => HeaderContentSchema.parse(readJson(sec('header/header.json'))));
check('hero/hero.json', () => HeroContentSchema.parse(readJson(sec('hero/hero.json'))));
check('carousel/carousel.json', () =>
  CarouselSlidesSchema.parse(readJson(sec('carousel/carousel.json')))
);
check('carousel/carouselContent.json', () =>
  CarouselSectionContentSchema.parse(readJson(sec('carousel/carouselContent.json')))
);
check('about/aboutContent.json', () =>
  AboutSectionContentSchema.parse(readJson(sec('about/aboutContent.json')))
);
check('about/aboutValues.json', () =>
  AboutValuesSchema.parse(readJson(sec('about/aboutValues.json')))
);
check('services/servicesContent.json', () =>
  ServicesSectionContentSchema.parse(readJson(sec('services/servicesContent.json')))
);
check('services/services.json', () =>
  ServicesSchema.parse(readJson(sec('services/services.json')))
);
check('advantages/advantagesContent.json', () =>
  AdvantagesSectionContentSchema.parse(readJson(sec('advantages/advantagesContent.json')))
);
check('advantages/advantages.json', () =>
  AdvantagesSchema.parse(readJson(sec('advantages/advantages.json')))
);
check('call-to-action/callToAction.json', () =>
  CallToActionContentSchema.parse(readJson(sec('call-to-action/callToAction.json')))
);
check('testimonials/testimonialsContent.json', () =>
  TestimonialsSectionContentSchema.parse(readJson(sec('testimonials/testimonialsContent.json')))
);
check('testimonials/testimonials.json', () =>
  TestimonialsSchema.parse(readJson(sec('testimonials/testimonials.json')))
);
check('contact/contact.json', () =>
  ContactContentSchema.parse(readJson(sec('contact/contact.json')))
);
check('footer/footer.json', () => FooterContentSchema.parse(readJson(sec('footer/footer.json'))));
check('portfolio/portfolioPage.json', () =>
  PortfolioPageContentSchema.parse(readJson(sec('portfolio/portfolioPage.json')))
);
check('portfolio/portfolioSection.json', () =>
  PortfolioSectionContentSchema.parse(readJson(sec('portfolio/portfolioSection.json')))
);
check('portfolio/portfolioCase.json', () =>
  PortfolioCaseContentSchema.parse(readJson(sec('portfolio/portfolioCase.json')))
);
check('portfolio/imageGallery.json', () =>
  ImageGalleryContentSchema.parse(readJson(sec('portfolio/imageGallery.json')))
);

// ── Portfolio cases ────────────────────────────────────────────────────────────

const portfolioDir = path.join(root, 'data/content/portfolio');

console.log('\nPortfolio cases:');

const files = walkJsonFiles(portfolioDir);
if (files.length === 0) {
  console.log('  (no portfolio cases found)');
} else {
  for (const file of files) {
    const label = path.relative(portfolioDir, file);
    check(label, () => PortfolioCaseSchema.parse(readJson(file)));
  }
}

// ── Result ─────────────────────────────────────────────────────────────────────

console.log('');
if (errors > 0) {
  console.error(`❌  ${errors} validation error(s) found.`);
  process.exit(1);
} else {
  console.log('✅  All data files are valid.');
}
