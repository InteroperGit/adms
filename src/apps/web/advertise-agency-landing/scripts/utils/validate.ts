/**
 * Validate all data files against their Zod schemas.
 * Run via: pnpm validate
 *
 * Uses vite-node so Vite aliases (@/, @data/) work correctly.
 * Any schema.parse() failure throws a ZodError with a clear field-level message.
 */

import { existsSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { readJson, walkJsonFiles } from './buildUtils';

// ── Config schemas ─────────────────────────────────────────────────────────────
import { SiteDataSchema } from '../../src/types/config/siteData';
import { ThemeSchema } from '../../src/types/config/theme';
import { CategoriesSchema } from '../../src/types/config/categories';
import { PortfolioConfigSchema } from '../../src/types/config/portfolioConfig';
import { CookiesContentSchema } from '../../src/types/config/cookies';
import { LegalDataSchema } from '../../src/types/config/legalData';
import { SeoConfigSchema } from '../../src/types/config/seo';
import { OrderFormsDataSchema } from '../../src/types/config/orderForms';
import { NotFoundContentSchema } from '../../src/types/config/notFound';
import { ImageGalleryContentSchema } from '../../src/types/shared/imageGallery';
import { ArticleTypesConfigSchema } from '../../src/types/config/articleTypes';
import { BlogConfigSchema } from '../../src/types/config/blogConfig';
import { NewsConfigSchema } from '../../src/types/config/newsConfig';
import { ErrorFallbackContentSchema } from '../../src/types/config/errorFallback';

// ── Section schemas ────────────────────────────────────────────────────────────
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

// ── Portfolio schemas ──────────────────────────────────────────────────────────
import { PortfolioSectionContentSchema } from '../../src/types/sections/portfolio/portfolioContent';
import { PortfolioArticleSchema } from '../../src/types/articles/portfolioArticle';
import { DefaultArticleCtaSchema } from '../../src/types/config/defaultArticleCta';
import { ServiceArticleSchema } from '../../src/types/articles/serviceArticle';
import { NewsArticleSchema } from '../../src/types/articles/newsArticle';
import { BlogArticleSchema } from '../../src/types/articles/blogArticle';

// ── Constants ──────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const dataDir = path.join(root, 'data/content');
const articlesDir = path.join(dataDir, 'articles');
const portfolioDir = path.join(articlesDir, 'portfolio');

// ── Utilities ──────────────────────────────────────────────────────────────────

/**
 * Resolves a path under `data/content/config/`.
 */
function cfg(name: string): string {
  return path.join(root, 'data/content/config', name);
}

/**
 * Resolves a path under `data/content/sections/`.
 */
function sec(name: string): string {
  return path.join(root, 'data/content/sections', name);
}

/**
 * Resolves a path under `data/content/legal/`.
 */
function legal(name: string): string {
  return path.join(root, 'data/content/legal', name);
}

// ── Validation primitives ──────────────────────────────────────────────────────

type Schema = { parse: (data: unknown) => unknown };

/**
 * Runs `fn()`, logs a ✓/✗ result line, and returns 1 on error or 0 on success.
 */
function check(label: string, fn: () => void): number {
  try {
    fn();
    console.log(`  ✓ ${label}`);
    return 0;
  } catch (err) {
    console.error(`  ✗ ${label}`);
    console.error((err as Error).message);
    return 1;
  }
}

/**
 * Validates an optional file against `schema`.
 * Logs a skip notice when the file is absent.
 * Returns 1 on parse error, 0 on success or skip.
 */
function checkOptional(label: string, filePath: string, schema: Schema): number {
  if (!existsSync(filePath)) {
    console.log(`  – ${label} (not found, skipped)`);
    return 0;
  }
  return check(label, () => schema.parse(readJson(filePath)));
}

// ── Config validation ──────────────────────────────────────────────────────────

function validateConfig(): number {
  let errors = 0;
  errors += check('site.json', () => SiteDataSchema.parse(readJson(cfg('site.json'))));
  errors += check('theme.json', () => ThemeSchema.parse(readJson(cfg('theme.json'))));
  errors += check('categories.json', () =>
    CategoriesSchema.parse(readJson(cfg('categories.json')))
  );
  errors += check('portfolio.json', () =>
    PortfolioConfigSchema.parse(readJson(cfg('portfolio.json')))
  );
  errors += check('cookies.json', () => CookiesContentSchema.parse(readJson(cfg('cookies.json'))));
  errors += checkOptional('legal.json', cfg('legal.json'), LegalDataSchema);
  errors += checkOptional('seo.json', cfg('seo.json'), SeoConfigSchema);
  errors += checkOptional('orderForms.json', cfg('orderForms.json'), OrderFormsDataSchema);
  errors += checkOptional('notFound.json', cfg('notFound.json'), NotFoundContentSchema);
  errors += checkOptional('imageGallery.json', cfg('imageGallery.json'), ImageGalleryContentSchema);
  errors += check('articleTypes.json', () =>
    ArticleTypesConfigSchema.parse(readJson(cfg('articleTypes.json')))
  );
  errors += check('blog.json', () => BlogConfigSchema.parse(readJson(cfg('blog.json'))));
  errors += check('news.json', () => NewsConfigSchema.parse(readJson(cfg('news.json'))));
  errors += check('errorFallback.json', () =>
    ErrorFallbackContentSchema.parse(readJson(cfg('errorFallback.json')))
  );
  errors += check('defaultArticleCta.json', () =>
    DefaultArticleCtaSchema.parse(readJson(cfg('defaultArticleCta.json')))
  );
  return errors;
}

// ── Section validation ─────────────────────────────────────────────────────────

/**
 * All section files paired with their schemas, in display order.
 */
const SECTION_SCHEMAS: [string, Schema][] = [
  ['header/header.json', HeaderContentSchema],
  ['hero/hero.json', HeroContentSchema],
  ['carousel/carousel.json', CarouselSlidesSchema],
  ['carousel/carouselContent.json', CarouselSectionContentSchema],
  ['about/aboutContent.json', AboutSectionContentSchema],
  ['about/aboutValues.json', AboutValuesSchema],
  ['services/servicesContent.json', ServicesSectionContentSchema],
  ['services/services.json', ServicesSchema],
  ['advantages/advantagesContent.json', AdvantagesSectionContentSchema],
  ['advantages/advantages.json', AdvantagesSchema],
  ['call-to-action/callToAction.json', CallToActionContentSchema],
  ['testimonials/testimonialsContent.json', TestimonialsSectionContentSchema],
  ['testimonials/testimonials.json', TestimonialsSchema],
  ['contact/contact.json', ContactContentSchema],
  ['footer/footer.json', FooterContentSchema],
  ['portfolio/portfolioSection.json', PortfolioSectionContentSchema],
];

function validateSections(): number {
  return SECTION_SCHEMAS.reduce(
    (errors, [name, schema]) => errors + check(name, () => schema.parse(readJson(sec(name)))),
    0
  );
}

// ── Legal validation ───────────────────────────────────────────────────────────

import { LegalContentSchema } from '../../src/types/legal/index';

function validateLegal(): number {
  const dir = legal('');
  if (!existsSync(dir)) {
    console.log('  – legal/ directory not found, skipped');
    return 0;
  }
  const files = walkJsonFiles(dir);
  if (files.length === 0) {
    console.log('  – no legal files found, skipped');
    return 0;
  }
  return files.reduce((sum, file) => {
    const label = path.relative(dir, file);
    return sum + check(label, () => LegalContentSchema.parse(readJson(file)));
  }, 0);
}

// ── Article validation ─────────────────────────────────────────────────────────

const ARTICLE_DIRS: [string, Schema][] = [
  ['services', ServiceArticleSchema],
  ['news', NewsArticleSchema],
  ['blog', BlogArticleSchema],
];

function validateArticles(): number {
  let errors = 0;
  for (const [subdir, schema] of ARTICLE_DIRS) {
    const dir = path.join(dataDir, subdir);
    if (!existsSync(dir)) {
      console.log(`  – ${subdir}/ not found, skipped`);
      continue;
    }
    const files = walkJsonFiles(dir);
    if (files.length === 0) {
      continue;
    }
    errors += files.reduce((sum, file) => {
      const label = `${subdir}/${path.relative(dir, file)}`;
      return sum + check(label, () => schema.parse(readJson(file)));
    }, 0);
  }
  return errors;
}

// ── Portfolio case validation ──────────────────────────────────────────────────

function validatePortfolioCases(): { errors: number; files: string[] } {
  const files = walkJsonFiles(portfolioDir);

  if (files.length === 0) {
    console.log('  (no portfolio cases found)');
    return { errors: 0, files: [] };
  }

  const errors = files.reduce((sum, file) => {
    const label = path.relative(portfolioDir, file);
    return sum + check(label, () => PortfolioArticleSchema.parse(readJson(file)));
  }, 0);

  return { errors, files };
}

// ── Hex color advisory check ───────────────────────────────────────────────────

/**
 * Hex colors that map to theme semantic tokens.
 * Used to suggest migrations from hard-coded hex values in list block colors.
 */
const HEX_TO_TOKEN: Record<string, string> = {
  '#f65314': 'primary',
  '#ffffff': 'primary-foreground',
  '#f5f3ff': 'secondary',
  '#e0e7ff': 'muted (light indigo)',
  '#312e81': 'muted-foreground (dark indigo)',
  '#5b21b6': 'accent (dark purple)',
  '#e5e7eb': 'border (light gray)',
  '#1f2937': 'foreground (dark gray)',
};

/**
 * Walks portfolio case files and emits advisory suggestions for hex colors
 * in list blocks that could be replaced with semantic tokens.
 * Non-blocking — advisories do not count toward the validation error total.
 */
function checkHexColorAdvisories(files: string[]): void {
  let advisories = 0;

  for (const file of files) {
    const data = readJson(file) as Record<string, unknown>;
    const content = Array.isArray(data.content) ? data.content : [];

    for (let blockIdx = 0; blockIdx < content.length; blockIdx++) {
      const block = content[blockIdx] as Record<string, unknown>;
      if (block.__component !== 'list') {
        continue;
      }

      const colors = block.colors as Record<string, Record<string, unknown>> | undefined;
      if (!colors) {
        continue;
      }

      for (const position of ['even', 'odd'] as const) {
        const rowColors = colors[position];
        if (!rowColors) {
          continue;
        }

        for (const colorType of ['background', 'text'] as const) {
          const colorValue = rowColors[colorType];
          if (typeof colorValue !== 'string' || !colorValue.startsWith('#')) {
            continue;
          }

          const token = HEX_TO_TOKEN[colorValue.toLowerCase()];
          if (token) {
            const label = path.relative(portfolioDir, file);
            console.log(
              `  💡 ${label} (block ${blockIdx}, ${position} row ${colorType}): ` +
                `"${colorValue}" → consider using "${token}"`
            );
            advisories++;
          }
        }
      }
    }
  }

  if (advisories > 0) {
    console.log(`\n  (${advisories} migration opportunity found – entirely optional)`);
  } else {
    console.log('  (no migrable colors found)');
  }
}

// ── Entry ──────────────────────────────────────────────────────────────────────

function main(): void {
  console.log('\nConfig:');
  const configErrors = validateConfig();

  console.log('\nSections:');
  const sectionErrors = validateSections();

  console.log('\nLegal:');
  const legalErrors = validateLegal();

  console.log('\nArticle files:');
  const articleErrors = validateArticles();

  console.log('\nPortfolio cases:');
  const { errors: caseErrors, files } = validatePortfolioCases();

  console.log('\nChecking for migrable hex colors in list blocks:');
  checkHexColorAdvisories(files);

  const totalErrors = configErrors + sectionErrors + legalErrors + articleErrors + caseErrors;

  console.log('');
  if (totalErrors > 0) {
    console.error(`❌  ${totalErrors} validation error(s) found.`);
    process.exit(1);
  } else {
    console.log('✅  All data files are valid.');
  }
}

main();
