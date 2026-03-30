/**
 * Interactive CLI to bootstrap a new client's data directory.
 * Prompts for agency info, brand colors, and fonts, then generates
 * data/content/ with customized site.json, theme.json, and seo.json
 * plus template copies of all other data files.
 *
 * Run via: pnpm new-client
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const examplesDir = path.join(root, 'data/_schema/examples');
const contentDir = path.join(root, 'data/content');

// ── Readline helpers ──────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function askDefault(question: string, defaultValue: string): Promise<string> {
  const answer = await ask(`${question} [${defaultValue}]: `);
  return answer || defaultValue;
}

async function askHex(question: string, defaultHex: string): Promise<string> {
  for (;;) {
    const answer = await ask(`${question} [${defaultHex}]: `);
    const value = answer || defaultHex;
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      return value;
    }
    console.log('  ⚠  Please enter a valid hex color (e.g. #F65314)');
  }
}

// ── Hex → HSL conversion ──────────────────────────────────────────────────────

function hexToHsl(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// ── File helpers ──────────────────────────────────────────────────────────────

function readExample(subpath: string): unknown {
  return JSON.parse(readFileSync(path.join(examplesDir, subpath), 'utf-8'));
}

function writeData(subpath: string, data: unknown): void {
  const outPath = path.join(contentDir, subpath);
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`  ✓ data/content/${subpath}`);
}

// Prepend $schema to an object. Arrays cannot carry $schema — returned as-is.
function withSchema(data: unknown, subfolder: string, schemaName: string): unknown {
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return {
      $schema: `../../_schema/schema/${subfolder}/${schemaName}.schema.json`,
      ...(data as Record<string, unknown>),
    };
  }
  return data;
}

function copyExample(
  exampleSubpath: string,
  outputSubpath: string,
  subfolder: string,
  schemaName: string,
  isArray = false
): void {
  try {
    const data = readExample(exampleSubpath);
    writeData(outputSubpath, isArray ? data : withSchema(data, subfolder, schemaName));
  } catch (err) {
    console.warn(`  ⚠  Could not copy ${exampleSubpath}: ${(err as Error).message}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('\n┌──────────────────────────────────────────────────────────────────────────┐');
  console.log('│           advertise-agency-landing — New Client Setup                    │');
  console.log('└──────────────────────────────────────────────────────────────────────────┘\n');
  console.log('This wizard generates data/content/ files for a new client.');
  console.log('All generated section files are templates — edit them after generation.\n');

  // ── Preflight ──────────────────────────────────────────────────────────────
  if (existsSync(contentDir)) {
    console.log('⚠  data/content/ already exists.');
    const confirm = await ask('   Overwrite existing files? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('\nAborted. No files were changed.\n');
      return;
    }
    console.log('');
  }

  // ── Agency information ─────────────────────────────────────────────────────
  console.log('── Agency Information ────────────────────────────────────────────────────\n');

  const agencyName = await ask('Agency display name (e.g. РА «Рекламастер»): ');
  const agencyDescription = await askDefault(
    'Tagline / meta description',
    'Рекламное агентство полного цикла'
  );
  const siteUrl = await ask('Website URL (e.g. https://reklamaster.ru): ');
  const phone = await ask('Phone (e.g. +7 (495) 123-45-67): ');
  const email = await ask('Email (e.g. hello@reklamaster.ru): ');
  const address = await ask('Address: ');
  const telegram = await ask('Telegram URL (e.g. https://t.me/agency): ');
  const vk = await ask('VK URL (e.g. https://vk.com/agency): ');

  console.log('');
  console.log('── Working Hours ─────────────────────────────────────────────────────────\n');

  const weekdays = await askDefault('Weekdays hours', '9:00 — 19:00');
  const saturday = await askDefault('Saturday hours', '10:00 — 16:00');
  const sunday = await askDefault('Sunday', 'Выходной');

  // ── Brand colors ───────────────────────────────────────────────────────────
  console.log('');
  console.log('── Brand Colors ──────────────────────────────────────────────────────────\n');
  console.log('Enter hex color codes (e.g. #F65314). Press Enter to keep the default.\n');

  const primaryHex = await askHex('Primary color (buttons, accents, logo)', '#F65314');
  const accentHex = await askHex('Accent color (gradients, highlights)', '#7C3AED');

  const primaryHsl = hexToHsl(primaryHex);
  const accentHsl = hexToHsl(accentHex);

  // Derive secondary tints from primary hue
  const primaryH = primaryHsl.split(' ')[0];
  const secondaryHsl = `${primaryH} 100% 97%`;
  const secondaryFgHsl = `${primaryH} 93% 35%`;

  // ── Typography ─────────────────────────────────────────────────────────────
  console.log('');
  console.log('── Typography ────────────────────────────────────────────────────────────\n');

  const headingFont = await askDefault('Heading font name', 'Plus Jakarta Sans');
  const headingFontUrl = await askDefault(
    'Google Fonts URL for heading font',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap'
  );
  const bodyFont = await askDefault('Body font name', 'Inter');
  const bodyFontUrl = await askDefault(
    'Google Fonts URL for body font',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'
  );

  // ── Generate files ─────────────────────────────────────────────────────────
  console.log('');
  console.log('── Generating files ──────────────────────────────────────────────────────\n');

  // Logo letter: first Cyrillic or Latin uppercase character from agency name
  const logoLetter = (agencyName.match(/[А-ЯA-Z]/i)?.[0] ?? 'A').toUpperCase();

  // site.json
  writeData('config/site.json', {
    $schema: '../../_schema/schema/config/site.schema.json',
    name: agencyName,
    description: agencyDescription,
    contact: {
      phone,
      email,
      address,
      telegram,
      vk,
      workingHours: { weekdays, saturday, sunday },
    },
  });

  // theme.json
  writeData('config/theme.json', {
    $schema: '../../_schema/schema/config/theme.schema.json',
    colors: {
      background: '0 0% 100%',
      foreground: '230 20% 7%',
      card: '0 0% 100%',
      cardForeground: '230 20% 7%',
      popover: '0 0% 100%',
      popoverForeground: '230 20% 7%',
      primary: primaryHsl,
      primaryForeground: '0 0% 100%',
      secondary: secondaryHsl,
      secondaryForeground: secondaryFgHsl,
      muted: '220 20% 97%',
      mutedForeground: '220 9% 46%',
      accent: accentHsl,
      accentForeground: '0 0% 100%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '220 13% 91%',
      input: '220 13% 91%',
      ring: primaryHsl,
    },
    radius: '0.5rem',
    fonts: {
      heading: `'${headingFont}', system-ui, sans-serif`,
      body: `'${bodyFont}', system-ui, sans-serif`,
    },
    fontUrls: [headingFontUrl, bodyFontUrl],
  });

  // seo.json
  writeData('config/seo.json', {
    $schema: '../../_schema/schema/config/seo.schema.json',
    siteUrl: siteUrl || 'https://example.ru',
    siteName: agencyName,
    locale: 'ru_RU',
    twitterCard: 'summary',
    defaultOgImage: '/og-default.jpg',
  });

  // header.json — inject logo letter
  const headerRaw = readExample('sections/header/header.example.json') as Record<string, unknown>;
  const headerLogo = headerRaw['logo'] as Record<string, string> | undefined;
  writeData(
    'sections/header/header.json',
    withSchema(
      { ...headerRaw, logo: { ...(headerLogo ?? {}), letter: logoLetter } },
      'sections',
      'header'
    )
  );

  // Config files — copied from examples
  copyExample('config/cookies.example.json', 'config/cookies.json', 'config', 'cookies');
  copyExample(
    'config/portfolioConfig.example.json',
    'config/portfolio.json',
    'config',
    'portfolioConfig'
  );
  copyExample('config/legal.example.json', 'config/legal.json', 'config', 'legal');
  copyExample('config/orderForms.example.json', 'config/orderForms.json', 'config', 'orderForms');
  copyExample(
    'config/categories.example.json',
    'config/categories.json',
    'config',
    'categories',
    true
  );

  // Section files — copied from examples (organized by component subfolder)
  copyExample('sections/hero/hero.example.json', 'sections/hero/hero.json', 'sections', 'hero');
  copyExample(
    'sections/carousel/carousel.example.json',
    'sections/carousel/carousel.json',
    'sections',
    'carousel',
    true
  );
  copyExample(
    'sections/carousel/carouselContent.example.json',
    'sections/carousel/carouselContent.json',
    'sections',
    'carouselContent'
  );
  copyExample(
    'sections/about/aboutContent.example.json',
    'sections/about/aboutContent.json',
    'sections',
    'aboutContent'
  );
  copyExample(
    'sections/about/aboutValues.example.json',
    'sections/about/aboutValues.json',
    'sections',
    'aboutValues',
    true
  );
  copyExample(
    'sections/services/servicesContent.example.json',
    'sections/services/servicesContent.json',
    'sections',
    'servicesContent'
  );
  copyExample(
    'sections/services/services.example.json',
    'sections/services/services.json',
    'sections',
    'services',
    true
  );
  copyExample(
    'sections/portfolio/portfolioSection.example.json',
    'sections/portfolio/portfolioSection.json',
    'sections',
    'portfolioSection'
  );
  copyExample(
    'sections/portfolio/portfolioPage.example.json',
    'sections/portfolio/portfolioPage.json',
    'sections',
    'portfolioPage'
  );
  copyExample(
    'sections/portfolio/portfolioCase.example.json',
    'sections/portfolio/portfolioCase.json',
    'sections',
    'portfolioCase'
  );
  copyExample(
    'sections/advantages/advantagesContent.example.json',
    'sections/advantages/advantagesContent.json',
    'sections',
    'advantagesContent'
  );
  copyExample(
    'sections/advantages/advantages.example.json',
    'sections/advantages/advantages.json',
    'sections',
    'advantages',
    true
  );
  copyExample(
    'sections/call-to-action/callToAction.example.json',
    'sections/call-to-action/callToAction.json',
    'sections',
    'callToAction'
  );
  copyExample(
    'sections/testimonials/testimonialsContent.example.json',
    'sections/testimonials/testimonialsContent.json',
    'sections',
    'testimonialsContent'
  );
  copyExample(
    'sections/testimonials/testimonials.example.json',
    'sections/testimonials/testimonials.json',
    'sections',
    'testimonials',
    true
  );
  copyExample(
    'sections/portfolio/imageGallery.example.json',
    'sections/portfolio/imageGallery.json',
    'sections',
    'imageGallery'
  );
  copyExample(
    'sections/contact/contact.example.json',
    'sections/contact/contact.json',
    'sections',
    'contact'
  );
  copyExample(
    'sections/footer/footer.example.json',
    'sections/footer/footer.json',
    'sections',
    'footer'
  );

  // Create empty portfolio and legal directories with .gitkeep
  mkdirSync(path.join(contentDir, 'portfolio'), { recursive: true });
  mkdirSync(path.join(contentDir, 'legal'), { recursive: true });
  console.log(
    '  ✓ data/content/portfolio/  (empty — add cases as {category}/{year}/{month}/yyyy_mm_dd_slug.json)'
  );
  console.log('  ✓ data/content/legal/      (empty — add legal page content here)');

  console.log('');
  console.log('✅  All files generated.\n');
  console.log('── Next steps ────────────────────────────────────────────────────────────\n');
  console.log('  1. Edit data/content/config/legal.json        → add legal company details');
  console.log('  2. Edit data/content/sections/**/*.json        → replace placeholder copy');
  console.log(
    '  3. Add data/content/portfolio/{category}/{year}/{month}/yyyy_mm_dd_slug.json → case study files'
  );
  console.log('  4. Add data/content/legal/*.json               → legal page content');
  console.log('  5. pnpm validate                               → verify all files');
  console.log('  6. pnpm gen-schemas                            → update IDE autocomplete');
  console.log('  7. pnpm dev                                    → start dev server');
  console.log('');
}

main()
  .catch((err: unknown) => {
    console.error('\n❌  Error:', (err as Error).message);
    process.exit(1);
  })
  .finally(() => {
    rl.close();
  });
