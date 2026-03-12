/**
 * Validate all data files against their Zod schemas.
 * Run via: pnpm validate
 *
 * Uses vite-node so Vite aliases (@/, @data/) work correctly.
 * Any schema.parse() failure throws a ZodError with a clear field-level message.
 */

import { readdirSync, readFileSync } from 'fs';
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

// ── Portfolio schemas ──────────────────────────────────────────────────────────
import {
  PortfolioCaseSchema,
  PortfolioSectionContentSchema,
} from '../src/types/portfolio';
import { PortfolioCaseContentSchema } from '../src/types/portfolio/portfolioCaseContent';
import { ImageGalleryContentSchema } from '../src/types/portfolio/imageGallery';

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

check('header.json', () => HeaderContentSchema.parse(readJson(sec('header.json'))));
check('hero.json', () => HeroContentSchema.parse(readJson(sec('hero.json'))));
check('carousel.json', () => CarouselSlidesSchema.parse(readJson(sec('carousel.json'))));
check('carouselContent.json', () =>
  CarouselSectionContentSchema.parse(readJson(sec('carouselContent.json')))
);
check('aboutContent.json', () =>
  AboutSectionContentSchema.parse(readJson(sec('aboutContent.json')))
);
check('aboutValues.json', () => AboutValuesSchema.parse(readJson(sec('aboutValues.json'))));
check('servicesContent.json', () =>
  ServicesSectionContentSchema.parse(readJson(sec('servicesContent.json')))
);
check('services.json', () => ServicesSchema.parse(readJson(sec('services.json'))));
check('advantagesContent.json', () =>
  AdvantagesSectionContentSchema.parse(readJson(sec('advantagesContent.json')))
);
check('advantages.json', () => AdvantagesSchema.parse(readJson(sec('advantages.json'))));
check('callToAction.json', () =>
  CallToActionContentSchema.parse(readJson(sec('callToAction.json')))
);
check('testimonialsContent.json', () =>
  TestimonialsSectionContentSchema.parse(readJson(sec('testimonialsContent.json')))
);
check('testimonials.json', () => TestimonialsSchema.parse(readJson(sec('testimonials.json'))));
check('contact.json', () => ContactContentSchema.parse(readJson(sec('contact.json'))));
check('footer.json', () => FooterContentSchema.parse(readJson(sec('footer.json'))));
check('portfolioPage.json', () =>
  PortfolioPageContentSchema.parse(readJson(sec('portfolioPage.json')))
);
check('portfolioSection.json', () =>
  PortfolioSectionContentSchema.parse(readJson(sec('portfolioSection.json')))
);
check('portfolioCase.json', () =>
  PortfolioCaseContentSchema.parse(readJson(sec('portfolioCase.json')))
);
check('imageGallery.json', () =>
  ImageGalleryContentSchema.parse(readJson(sec('imageGallery.json')))
);

// ── Portfolio cases ────────────────────────────────────────────────────────────

const portfolioDir = path.join(root, 'data/content/portfolio');

console.log('\nPortfolio cases:');

try {
  const files = readdirSync(portfolioDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('  (no portfolio cases found)');
  } else {
    for (const file of files) {
      check(file, () => PortfolioCaseSchema.parse(readJson(path.join(portfolioDir, file))));
    }
  }
} catch {
  console.log('  (no portfolio cases found)');
}

// ── Result ─────────────────────────────────────────────────────────────────────

console.log('');
if (errors > 0) {
  console.error(`❌  ${errors} validation error(s) found.`);
  process.exit(1);
} else {
  console.log('✅  All data files are valid.');
}
