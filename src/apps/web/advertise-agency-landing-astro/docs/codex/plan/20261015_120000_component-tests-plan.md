# РџР»Р°РЅ СЂР°Р·СЂР°Р±РѕС‚РєРё unit-С‚РµСЃС‚РѕРІ РєРѕРјРїРѕРЅРµРЅС‚РѕРІ

Р”Р°С‚Р°: 2026-10-15. РЎС‚Р°С‚СѓСЃ: in progress; 088 and 089 completed.

РСЃС‚РѕС‡РЅРёРє РєРѕРЅС‚СЂР°РєС‚РѕРІ: `docs/development/components.md`.

## Р¦РµР»СЊ

Р”РѕР±Р°РІРёС‚СЊ РІРѕСЃРїСЂРѕРёР·РІРѕРґРёРјС‹Р№ СЃР»РѕР№ unit-, component- Рё integration-С‚РµСЃС‚РѕРІ РґР»СЏ
Astro-РєРѕРјРїРѕРЅРµРЅС‚РѕРІ, РєР»РёРµРЅС‚СЃРєРёС… РјРѕРґСѓР»РµР№ Рё РІР°Р»РёРґР°С‚РѕСЂРѕРІ. РўРµСЃС‚С‹ РґРѕР»Р¶РЅС‹ РїСЂРѕРІРµСЂСЏС‚СЊ
РЅР°Р±Р»СЋРґР°РµРјС‹Рµ РєРѕРЅС‚СЂР°РєС‚С‹ РєРѕРјРїРѕРЅРµРЅС‚РѕРІ: СЃРµРјР°РЅС‚РёС‡РµСЃРєСѓСЋ СЂР°Р·РјРµС‚РєСѓ, accessibility,
props, fallback-СЃРѕСЃС‚РѕСЏРЅРёСЏ, РїСѓСЃС‚С‹Рµ РєРѕР»Р»РµРєС†РёРё, publication policy Рё РїРµСЂРµС…РѕРґС‹
РєР»РёРµРЅС‚СЃРєРѕРіРѕ СЃРѕСЃС‚РѕСЏРЅРёСЏ.

E2E-РїСЂРѕРІРµСЂРєРё РѕСЃС‚Р°СЋС‚СЃСЏ РѕС‚РґРµР»СЊРЅС‹Рј СЃР»РѕРµРј Рё РїРѕРєСЂС‹РІР°СЋС‚ СЂРµР°Р»СЊРЅС‹Рµ Р±СЂР°СѓР·РµСЂРЅС‹Рµ
СЃС†РµРЅР°СЂРёРё, РєРѕС‚РѕСЂС‹Рµ РЅРµ РґРѕР»Р¶РЅС‹ РґСѓР±Р»РёСЂРѕРІР°С‚СЊСЃСЏ РІ unit-С‚РµСЃС‚Р°С….

## Р’С‹Р±РѕСЂ С‚РµСЃС‚РѕРІРѕРіРѕ РґРІРёР¶РєР°

### РћСЃРЅРѕРІРЅРѕР№ runner: Vitest

РСЃРїРѕР»СЊР·РѕРІР°С‚СЊ Vitest РєР°Рє РѕСЃРЅРѕРІРЅРѕР№ runner, РїРѕС‚РѕРјСѓ С‡С‚Рѕ РѕРЅ СЂР°Р±РѕС‚Р°РµС‚ РїРѕРІРµСЂС… Vite,
РїРѕРґРґРµСЂР¶РёРІР°РµС‚ ESM Рё TypeScript Рё РјРѕР¶РµС‚ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ РєРѕРЅС„РёРіСѓСЂР°С†РёСЋ Astro С‡РµСЂРµР·
`getViteConfig()`.

Р”Р»СЏ РёР·РѕР»РёСЂРѕРІР°РЅРЅРѕРіРѕ СЂРµРЅРґРµСЂР° `.astro` РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ Astro Container API:

```ts
import {
  experimental_AstroContainer as AstroContainer,
} from 'astro/container';

const container = await AstroContainer.create();
const html = await container.renderToString(Component, {
  props,
  slots,
});
```

Container API РїРѕРјРµС‡РµРЅ Astro РєР°Рє experimental. РќСѓР¶РЅРѕ Р·Р°С„РёРєСЃРёСЂРѕРІР°С‚СЊ РІРµСЂСЃРёРё РІ
lockfile Рё РїСЂРѕРІРµСЂСЏС‚СЊ РѕР±РЅРѕРІР»РµРЅРёРµ Astro РѕС‚РґРµР»СЊРЅС‹Рј РёР·РјРµРЅРµРЅРёРµРј. Р’ С‚РµСЃС‚Р°С… СЃР»РµРґСѓРµС‚
РїСЂРµРґРїРѕС‡РёС‚Р°С‚СЊ DOM-Р·Р°РїСЂРѕСЃС‹ Рё РїСЂРѕРІРµСЂРєСѓ observable attributes Р±РѕР»СЊС€РёРј snapshots.

### DOM-СЃСЂРµРґР°

Р”Р»СЏ С‡РёСЃС‚С‹С… С„СѓРЅРєС†РёР№ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ РѕРєСЂСѓР¶РµРЅРёРµ `node`. Р”Р»СЏ РєР»РёРµРЅС‚СЃРєРёС… РјРѕРґСѓР»РµР№ Рё
СЃРѕР±С‹С‚РёР№ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ `jsdom` Рё Testing Library DOM queries. Р”РѕР±Р°РІРёС‚СЊ:

- `vitest`;
- `jsdom`;
- `@testing-library/dom`;
- `@testing-library/jest-dom`;
- `@vitest/coverage-v8`.

### E2E runner: Playwright

Playwright РѕСЃС‚Р°РІРёС‚СЊ РґР»СЏ E2E Рё РїСЂРѕРІРµСЂРѕРє РІ СЂРµР°Р»СЊРЅРѕРј Chromium, Firefox Рё WebKit.
РЎСѓС‰РµСЃС‚РІСѓСЋС‰РёР№ smoke-flow РёР· `docs/development/browser-coverage.md` СЂР°СЃС€РёСЂРёС‚СЊ,
РЅРµ СЃРѕР·РґР°РІР°СЏ РІС‚РѕСЂРѕР№ СЃР°РјРѕСЃС‚РѕСЏС‚РµР»СЊРЅС‹Р№ browser runtime РґР»СЏ unit-С‚РµСЃС‚РѕРІ.

Vitest Browser Mode РјРѕР¶РЅРѕ РїСЂРёРјРµРЅСЏС‚СЊ С‚РѕС‡РµС‡РЅРѕ, РЅРѕ РѕРЅ РЅРµ Р·Р°РјРµРЅСЏРµС‚ Playwright РґР»СЏ
РїСЂРѕРІРµСЂРєРё РјР°СЂС€СЂСѓС‚РѕРІ, reload, focus trap, browser history Рё no-JS РїРѕРІРµРґРµРЅРёСЏ.

## РЎС‚СЂСѓРєС‚СѓСЂР° С‚РµСЃС‚РѕРІ

РЎРѕР·РґР°С‚СЊ:

```text
vitest.config.ts
tests/
  setup.ts
  fixtures/
    content/
  helpers/
  unit/
  components/
  integration/
```

Р’РµСЂСЃРёРѕРЅРёСЂСѓРµРјС‹Рµ С‚РµСЃС‚РѕРІС‹Рµ JSON Рё MDX fixtures С…СЂР°РЅРёС‚СЊ РїРѕРґ
`tests/fixtures/content/`. Runtime-РєРѕРЅС‚РµРЅС‚ РїРѕРґ `data/content/` РЅРµ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ
РґР»СЏ С‚РµСЃС‚РѕРІ, РїРѕС‚РѕРјСѓ С‡С‚Рѕ РєР°С‚Р°Р»РѕРі РёРіРЅРѕСЂРёСЂСѓРµС‚СЃСЏ Рё РїРѕСЃС‚Р°РІР»СЏРµС‚СЃСЏ РѕС‚РґРµР»СЊРЅРѕ.
TypeScript builders, DOM helpers Рё mock factories С…СЂР°РЅРёС‚СЊ РІ `tests/fixtures`
Рё `tests/helpers`.

Р РµРєРѕРјРµРЅРґСѓРµРјС‹Рµ scripts РІ `package.json`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:unit": "vitest run tests/unit",
  "test:components": "vitest run tests/components",
  "test:integration": "vitest run tests/integration",
  "test:coverage": "vitest run --coverage"
}
```

## Р­С‚Р°Рї 1. Р§РёСЃС‚Р°СЏ Р»РѕРіРёРєР° Рё РІР°Р»РёРґР°С‚РѕСЂС‹

РџРѕРєСЂС‹С‚СЊ РІ РїРµСЂРІСѓСЋ РѕС‡РµСЂРµРґСЊ:

- `src/validation/*`;
- `src/components/content/resolve-image.ts`;
- `src/scripts/project-catalog.ts`;
- `src/server/inquiry-payload.ts`;
- `src/content/block-publication.ts`;
- С„РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ С†РµРЅС‹, РєР°С‚РµРіРѕСЂРёР№ Рё pagination;
- СЃРµСЂРёР°Р»РёР·Р°С†РёСЋ С„РёР»СЊС‚СЂРѕРІ РІ URL;
- `initializeInquiry`.

Р”Р»СЏ РєР°Р¶РґРѕР№ С„СѓРЅРєС†РёРё РїСЂРѕРІРµСЂРёС‚СЊ РІР°Р»РёРґРЅС‹Рµ РґР°РЅРЅС‹Рµ, РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ, РіСЂР°РЅРёС‡РЅС‹Рµ
Р·РЅР°С‡РµРЅРёСЏ, РїСѓСЃС‚С‹Рµ РєРѕР»Р»РµРєС†РёРё, draft/demo/unpublished-СЃРѕСЃС‚РѕСЏРЅРёСЏ Рё РѕС€РёР±РєРё С‚РёРїРѕРІ.

Р”Р»СЏ `initializeInquiry` РѕС‚РґРµР»СЊРЅРѕ РїСЂРѕРІРµСЂРёС‚СЊ required/type/length errors,
СѓСЃР»РѕРІРЅСѓСЋ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕСЃС‚СЊ email, `aria-invalid`, inline errors, `aria-busy`,
success, network error, unavailable endpoint Рё РѕС‡РёСЃС‚РєСѓ РѕС€РёР±РєРё РїСЂРё РёР·РјРµРЅРµРЅРёРё
СЃРѕРѕС‚РІРµС‚СЃС‚РІСѓСЋС‰РµРіРѕ РїРѕР»СЏ.

## Р­С‚Р°Рї 2. UI-РєРѕРјРїРѕРЅРµРЅС‚С‹ Рё РєР°СЂС‚РѕС‡РєРё

РЎРѕР·РґР°С‚СЊ С‚РµСЃС‚С‹ РІ `tests/components/ui/` Рё `tests/components/cards/`.

РџСЂРёРѕСЂРёС‚РµС‚ P0:

- `Button`;
- `Section`;
- `Breadcrumbs`;
- `ContactInfo`;
- `ServiceCard`;
- `ProjectCard`;
- `ReviewCard`;
- `PricingExample`.

Р”Р»СЏ РєР°Р¶РґРѕРіРѕ РєРѕРјРїРѕРЅРµРЅС‚Р° РїСЂРѕРІРµСЂСЏС‚СЊ props, defaults, semantic HTML, СЃСЃС‹Р»РєРё,
СЃР»РѕС‚С‹, `aria-*`, `data-*`, `hidden`, `open`, `alt` Рё РѕС‚СЃСѓС‚СЃС‚РІРёРµ РїСѓСЃС‚С‹С…
СЌР»РµРјРµРЅС‚РѕРІ.

РћР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ СЃС†РµРЅР°СЂРёРё РёР· РєРѕРЅС‚СЂР°РєС‚Р°:

- `Button` СЂРµРЅРґРµСЂРёС‚ link РїСЂРё `href` Рё button Р±РµР· РЅРµРіРѕ;
- `ContactInfo` РЅРµ РІС‹РІРѕРґРёС‚ РїСѓСЃС‚С‹Рµ РїРѕР»СЏ Рё РёСЃРїРѕР»СЊР·СѓРµС‚ `tel:`/`mailto:`;
- `Breadcrumbs` РїРѕРјРµС‡Р°РµС‚ С‚РµРєСѓС‰РёР№ РїСѓРЅРєС‚ `aria-current="page"`;
- `ProjectCard` РІС‹Р±РёСЂР°РµС‚ РїРµСЂРІРѕРµ РІРёРґРёРјРѕРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ;
- `PricingExample` С„РѕСЂРјР°С‚РёСЂСѓРµС‚ С†РµРЅСѓ СЃ historical/as-of РєРѕРЅС‚РµРєСЃС‚РѕРј;
- РѕС‚СЃСѓС‚СЃС‚РІРёРµ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РЅРµ СЃРѕР·РґР°С‘С‚ РїСѓСЃС‚СѓСЋ РєРѕР»РѕРЅРєСѓ РєР°СЂС‚РѕС‡РєРё.

## Р­С‚Р°Рї 3. Content blocks Рё fallback

РџРѕРєСЂС‹С‚СЊ РІ `tests/components/content/`:

- `ContentBlocks`;
- `HeadingBlock`;
- `ParagraphBlock`;
- `ListBlock`;
- `TableBlock`;
- `ChartBlock`;
- `ContentImage`;
- `ImageBlock`;
- `ImageGalleryBlock`;
- `ImageGallery`;
- `VideoBlock`;
- `QuoteBlock`;
- `FootnoteBlock`;
- `OrderFormContainer`;
- `OrderFormBlock`.

РџСЂРѕРІРµСЂРёС‚СЊ СѓСЂРѕРІРЅРё Р·Р°РіРѕР»РѕРІРєРѕРІ, СЂР°Р·СЂРµС€С‘РЅРЅС‹Рµ paragraph links, native `ol`/`ul`,
caption/label С‚Р°Р±Р»РёС†, fragment links, intrinsic ratio, focal points,
responsive sources, media errors, transcript/caption Рё no-JS fallback.

Р”Р»СЏ `ContentBlocks` РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ РјР°С‚СЂРёС†Сѓ `input block -> component -> output`.
РћС‚РґРµР»СЊРЅРѕ РїСЂРѕРІРµСЂРёС‚СЊ С„РёР»СЊС‚СЂР°С†РёСЋ unpublished/demo Р±Р»РѕРєРѕРІ, priority РїРµСЂРІРѕРіРѕ
РІРёРґРёРјРѕРіРѕ image/gallery Рё Р±РµР·РѕРїР°СЃРЅС‹Р№ general inquiry fallback.

## Р­С‚Р°Рї 4. РљР»РёРµРЅС‚СЃРєРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ

Р’ `jsdom` РїСЂРѕРІРµСЂРёС‚СЊ:

- `ui/image-carousel.ts`;
- `scripts/project-catalog.ts`;
- `forms/order-inquiry.ts`;
- theme initialization;
- mobile menu;
- cookie storage.

Р”Р»СЏ carousel РїСЂРѕРІРµСЂРёС‚СЊ `aria-hidden`, `aria-current`, `data-ready`, autoplay,
pause/resume РїСЂРё hover, focus Рё `visibilitychange`, reduced motion Рё cleanup
РЅР° `pagehide`.

Р”Р»СЏ catalog РїСЂРѕРІРµСЂРёС‚СЊ РїРѕРёСЃРє, category, count, empty state, query string Рё
РІРѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ СЃРѕСЃС‚РѕСЏРЅРёСЏ С‡РµСЂРµР· back/forward.

Р”Р»СЏ storage-РїРѕРІРµРґРµРЅРёСЏ РїСЂРѕРІРµСЂРёС‚СЊ РЅРµРґРѕСЃС‚СѓРїРЅС‹Р№ `localStorage` Рё РѕС‚СЃСѓС‚СЃС‚РІРёРµ
РґСѓР±Р»РёСЂРѕРІР°РЅРёСЏ listeners РїСЂРё РїРѕРІС‚РѕСЂРЅРѕР№ РёРЅРёС†РёР°Р»РёР·Р°С†РёРё.

## Р­С‚Р°Рї 5. Integration-С‚РµСЃС‚С‹ СЃРµРєС†РёР№

РЎРѕР·РґР°С‚СЊ integration-С‚РµСЃС‚С‹ РґР»СЏ РєРѕРјРїРѕР·РёС†РёР№ СЃ РјРёРЅРёРјР°Р»СЊРЅС‹РјРё РІР°Р»РёРґРЅС‹РјРё fixtures:

- РіР»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° СЃ РїСѓСЃС‚С‹РјРё Рё РЅРµРїСѓСЃС‚С‹РјРё РєРѕР»Р»РµРєС†РёСЏРјРё;
- service article СЃ MDX Рё JSON blocks;
- project article;
- header + `MobileMenuDialog` + `Settings` + `ThemeInit`;
- catalog controls + grid + count + empty + pagination;
- `CookieBanner`;
- map/video/image fallbacks;
- published/demo order forms СЃ `projectId` Рё `serviceId`.

Integration-С‚РµСЃС‚С‹ РїСЂРѕРІРµСЂСЏСЋС‚ РїРµСЂРµРґР°С‡Сѓ props Рё РІР·Р°РёРјРѕРґРµР№СЃС‚РІРёРµ РєРѕРјРїРѕРЅРµРЅС‚РѕРІ, РЅРѕ РЅРµ
РґСѓР±Р»РёСЂСѓСЋС‚ РїРѕР»РЅС‹Р№ РЅР°Р±РѕСЂ unit-РїСЂРѕРІРµСЂРѕРє РґРѕС‡РµСЂРЅРёС… РєРѕРјРїРѕРЅРµРЅС‚РѕРІ.

## Р­С‚Р°Рї 6. Playwright smoke Рё E2E

РџРѕСЃР»Рµ `pnpm build` РїСЂРѕРІРµСЂСЏС‚СЊ РЅР° СЃС‚Р°С‚РёС‡РµСЃРєРёС… РјР°СЂС€СЂСѓС‚Р°С…:

- keyboard-only desktop/mobile navigation;
- dialog focus trap, Escape Рё РІРѕР·РІСЂР°С‚ focus;
- light/dark/system theme РїРѕСЃР»Рµ reload;
- blocked `localStorage`;
- carousel arrows/dots/autoplay/reduced motion;
- gallery lightbox;
- inquiry success/error/unavailable;
- search/filter/pagination Рё browser back/forward;
- responsive routes;
- image/video failure fallback;
- no-JS reading order Рё generated HTML quality.

Р”Р»СЏ inquiry РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ intercepted endpoint fixture. РџСЂРѕРІРµСЂРёС‚СЊ validation,
timeout, rejection, duplicate request IDs, confirmed receipt Рё reset С‚РѕР»СЊРєРѕ
РїРѕСЃР»Рµ СѓСЃРїРµС€РЅРѕРіРѕ РѕС‚РІРµС‚Р°.

## Р­С‚Р°Рї 7. Coverage, CI Рё РїРѕСЂСЏРґРѕРє РІРЅРµРґСЂРµРЅРёСЏ

РќР°С‡Р°Р»СЊРЅС‹Р№ РїРѕСЂСЏРґРѕРє:

1. Vitest config, setup Рё smoke-С‚РµСЃС‚ РѕРґРЅРѕРіРѕ РїСЂРѕСЃС‚РѕРіРѕ РєРѕРјРїРѕРЅРµРЅС‚Р°.
2. Unit-С‚РµСЃС‚С‹ validation Рё utility-РјРѕРґСѓР»РµР№.
3. UI, cards Рё content blocks.
4. `initializeInquiry`, carousel Рё catalog state.
5. Integration-С‚РµСЃС‚С‹ sections.
6. Р Р°СЃС€РёСЂРµРЅРёРµ Playwright smoke-flow.
7. Coverage thresholds Рё CI.

РџРѕСЃР»Рµ РїРµСЂРІРѕРіРѕ baseline СѓСЃС‚Р°РЅРѕРІРёС‚СЊ РѕСЂРёРµРЅС‚РёСЂС‹:

- С‡РёСЃС‚Р°СЏ Р»РѕРіРёРєР°: 90%+;
- РєР»РёРµРЅС‚СЃРєРёРµ state-РјРѕРґСѓР»Рё: 85%+;
- РєРѕРјРїРѕРЅРµРЅС‚С‹: 80%+;
- РѕР±С‰РёР№ coverage: 80%.

РџСЂРѕРІРµСЂРєРё РїРµСЂРµРґ Р·Р°РІРµСЂС€РµРЅРёРµРј:

```powershell
pnpm verify:boundaries
pnpm verify:content
pnpm check
pnpm test
pnpm test:coverage
pnpm build
pnpm verify:quality
```

Р’ CI Р·Р°РїСѓСЃРєР°С‚СЊ Р±С‹СЃС‚СЂС‹Рµ unit/component-С‚РµСЃС‚С‹ РЅР° pull request. РџРѕР»РЅС‹Р№
Playwright-РЅР°Р±РѕСЂ Р·Р°РїСѓСЃРєР°С‚СЊ РїРѕСЃР»Рµ build РЅР° pull request Рё push РІ РѕСЃРЅРѕРІРЅСѓСЋ
РІРµС‚РєСѓ.

## РљСЂРёС‚РµСЂРёРё РіРѕС‚РѕРІРЅРѕСЃС‚Рё

- РљР°Р¶РґС‹Р№ РЅР°Р±Р»СЋРґР°РµРјС‹Р№ РєРѕРЅС‚СЂР°РєС‚ РёР· `components.md` РёРјРµРµС‚ С‚РµСЃС‚.
- РџСЂРѕРІРµСЂРµРЅС‹ semantic HTML Рё accessibility attributes.
- Р•СЃС‚СЊ С‚РµСЃС‚С‹ РґР»СЏ empty, disabled, demo, unpublished Рё fallback-СЃРѕСЃС‚РѕСЏРЅРёР№.
- Client state РїСЂРѕРІРµСЂРµРЅ СЃРѕР±С‹С‚РёСЏРјРё, РїРµСЂРµС…РѕРґР°РјРё Рё cleanup.
- E2E РїРѕРґС‚РІРµСЂР¶РґР°РµС‚ СЂРµР°Р»СЊРЅС‹Рµ browser, reload, history Рё no-JS СЃС†РµРЅР°СЂРёРё.
- Р’СЃРµ РїСЂРѕРµРєС‚РЅС‹Рµ quality-РєРѕРјР°РЅРґС‹ РїСЂРѕС…РѕРґСЏС‚ Р±РµР· РѕС€РёР±РѕРє.

## РЎСЃС‹Р»РєРё

- [РљРѕРЅС‚СЂР°РєС‚С‹ РєРѕРјРїРѕРЅРµРЅС‚РѕРІ](../../development/components.md)
- [Browser coverage](../../development/browser-coverage.md)
- [Astro Testing](https://docs.astro.build/en/guides/testing/)
- [Astro Container API](https://docs.astro.build/en/reference/container-reference/)
- [Vitest Browser Mode](https://vitest.dev/guide/browser/)

## Р—Р°РґР°С‡Рё

РџР»Р°РЅ СЂР°Р·Р±РёС‚ РЅР° СЃР»РµРґСѓСЋС‰РёРµ Р·Р°РґР°С‡Рё РІ РїРѕСЂСЏРґРєРµ РІС‹РїРѕР»РЅРµРЅРёСЏ:

- [088](../fixed/20261015/088-test-infrastructure.md) вЂ” Vitest, jsdom, fixtures Рё scripts.
- [089](../fixed/20261015/089-unit-validation-and-utilities.md) — completed:
  validation, utilities, inquiry and catalog tests; 115 total tests pass.
- [090](../todo/090-ui-and-card-components.md) вЂ” UI-РєРѕРјРїРѕРЅРµРЅС‚С‹ Рё РєР°СЂС‚РѕС‡РєРё.
- [091](../todo/091-content-block-components.md) вЂ” content blocks Рё fallback.
- [092](../todo/092-client-state-modules.md) вЂ” РєР»РёРµРЅС‚СЃРєРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ Рё cleanup.
- [093](../todo/093-section-integration-tests.md) вЂ” integration-С‚РµСЃС‚С‹ СЃРµРєС†РёР№.
- [094](../todo/094-playwright-smoke-and-e2e.md) вЂ” Playwright smoke/E2E.
- [095](../todo/095-coverage-ci-and-quality-gates.md) вЂ” coverage, CI Рё quality gates.

