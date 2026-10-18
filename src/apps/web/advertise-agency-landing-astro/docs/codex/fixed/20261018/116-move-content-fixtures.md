# 116 вЂ” РџРµСЂРµРЅРµСЃС‚Рё content fixtures РёР· runtime-РєР°С‚Р°Р»РѕРіР°

Р”Р°С‚Р°: 2026-10-17. РЎС‚Р°С‚СѓСЃ: completed.

## Р—Р°РґР°С‡Р°

РЈР±СЂР°С‚СЊ Р·Р°РІРёСЃРёРјРѕСЃС‚СЊ С‚РµСЃС‚РѕРІ Рё acceptance-СЃРєСЂРёРїС‚РѕРІ РѕС‚
`data/content/fixtures/`. РџРµСЂРµРЅРµСЃС‚Рё versioned fixtures РІ
`tests/fixtures/content/` Рё РѕСЃС‚Р°РІРёС‚СЊ РІ `data/content/` С‚РѕР»СЊРєРѕ
РїРѕСЃС‚Р°РІР»СЏРµРјС‹Р№ runtime-РєРѕРЅС‚РµРЅС‚.

## РљРѕРЅС‚РµРєСЃС‚

`data/content/` РїРѕР»РЅРѕСЃС‚СЊСЋ РёСЃРєР»СЋС‡С‘РЅ РёР· Git Рё РїРѕСЃС‚Р°РІР»СЏРµС‚СЃСЏ РѕС‚РґРµР»СЊРЅРѕ.
РўРµРєСѓС‰РёР№ РєР°С‚Р°Р»РѕРі `data/content/fixtures/` СЃРѕРґРµСЂР¶РёС‚ regression JSON,
MDX-РїСЂРёРјРµСЂС‹ Рё acceptance-РґР°РЅРЅС‹Рµ, РїРѕСЌС‚РѕРјСѓ СЌС‚Рё С„Р°Р№Р»С‹ РЅРµ СЏРІР»СЏСЋС‚СЃСЏ
production content. РџСЂР°РІРёР»Р° РїСЂРѕРµРєС‚Р° С‚СЂРµР±СѓСЋС‚ С…СЂР°РЅРёС‚СЊ versioned fixtures
РІ `tests/fixtures/content/`.

РЎРµР№С‡Р°СЃ РїСѓС‚Рё Рє СЃС‚Р°СЂРѕРјСѓ РєР°С‚Р°Р»РѕРіСѓ РёСЃРїРѕР»СЊР·СѓСЋС‚СЃСЏ РІ СЃРєСЂРёРїС‚Р°С…, Astro content
config Рё РґРѕРєСѓРјРµРЅС‚Р°С†РёРё. РљСЂРѕРјРµ С‚РѕРіРѕ, СЃРєСЂРёРїС‚С‹ РјРёРіСЂР°С†РёРё Рё regression-РїСЂРѕРІРµСЂРєРё
СЃСЃС‹Р»Р°СЋС‚СЃСЏ РЅР° `projects-before-blocks.json` Рё `services-before-blocks.json`,
РєРѕС‚РѕСЂС‹С… РІ С‚РµРєСѓС‰РµРј СЂР°Р±РѕС‡РµРј РєР°С‚Р°Р»РѕРіРµ РЅРµС‚.

## РћР±СЉС‘Рј

- РћРїСЂРµРґРµР»РёС‚СЊ РїРѕР»РЅС‹Р№ РЅР°Р±РѕСЂ fixtures, РєРѕС‚РѕСЂС‹Р№ РЅСѓР¶РµРЅ unit, integration,
  content-block, publication, article Рё browser-РїСЂРѕРІРµСЂРєР°Рј.
- РџРµСЂРµРЅРµСЃС‚Рё versioned JSON Рё MDX РёР· `data/content/fixtures/` РІ
  `tests/fixtures/content/`, СЃРѕС…СЂР°РЅРёРІ РїРѕРЅСЏС‚РЅРѕРµ СЂР°Р·Р±РёРµРЅРёРµ, РІРєР»СЋС‡Р°СЏ
  `articles/` Рё РёСЃС‚РѕСЂРёС‡РµСЃРєРёРµ migration snapshots.
- РћР±РЅРѕРІРёС‚СЊ РёРјРїРѕСЂС‚С‹ Рё С„Р°Р№Р»РѕРІС‹Рµ РїСѓС‚Рё РІ `scripts/`, `src/content.config.ts`,
  acceptance-РєРѕРЅС„РёРіСѓСЂР°С†РёРё Рё СЃРІСЏР·Р°РЅРЅС‹С… С‚РµСЃС‚РѕРІС‹С… helpers.
- РћСЃС‚Р°РІРёС‚СЊ РІСЂРµРјРµРЅРЅС‹Рµ E2E-РґР°РЅРЅС‹Рµ РІ `output/playwright/content/`; РЅРµ
  СЃРјРµС€РёРІР°С‚СЊ РёС… СЃ versioned fixtures.
- РћР±РЅРѕРІРёС‚СЊ `docs/site/`, README Рё РєРѕРјРјРµРЅС‚Р°СЂРёРё, РєРѕС‚РѕСЂС‹Рµ РѕРїРёСЃС‹РІР°СЋС‚
  `data/content/fixtures/` РєР°Рє РїРѕСЃС‚РѕСЏРЅРЅРѕРµ РјРµСЃС‚Рѕ С…СЂР°РЅРµРЅРёСЏ fixtures.
- РџСЂРѕРІРµСЂРёС‚СЊ, С‡С‚Рѕ production loaders РїРѕ-РїСЂРµР¶РЅРµРјСѓ С‡РёС‚Р°СЋС‚ С‚РѕР»СЊРєРѕ
  `data/content/` runtime-РєРѕРЅС‚РµРЅС‚ Рё РЅРµ РїСѓР±Р»РёРєСѓСЋС‚ С‚РµСЃС‚РѕРІС‹Рµ РєРѕР»Р»РµРєС†РёРё.
- РќРµ РїРµСЂРµРЅРѕСЃРёС‚СЊ production JSON, СЃС‚Р°С‚СЊРё Рё legal-РґРѕРєСѓРјРµРЅС‚С‹ РІ РєР°С‚Р°Р»РѕРі
  С‚РµСЃС‚РѕРІ.

## Р“РѕС‚РѕРІРѕ, РєРѕРіРґР°

- Р’ СЂРµРїРѕР·РёС‚РѕСЂРёРё РЅРµС‚ versioned РёР»Рё РѕР±СЏР·Р°С‚РµР»СЊРЅС‹С… test fixtures РїРѕРґ
  `data/content/fixtures/`.
- Р’СЃРµ С‚РµСЃС‚РѕРІС‹Рµ Рё acceptance-РєРѕРјР°РЅРґС‹ РёСЃРїРѕР»СЊР·СѓСЋС‚
  `tests/fixtures/content/` Р»РёР±Рѕ РІСЂРµРјРµРЅРЅС‹Р№ `output/playwright/content/`.
- `data/content/fixtures/` РЅРµ С‚СЂРµР±СѓРµС‚СЃСЏ РґР»СЏ РѕР±С‹С‡РЅРѕРіРѕ `pnpm check` Рё
  `pnpm build`.
- РџСЂРѕС…РѕРґСЏС‚ `pnpm check`, `pnpm build`, content-block, article,
  publication Рё СЃРѕРѕС‚РІРµС‚СЃС‚РІСѓСЋС‰РёРµ unit/integration РїСЂРѕРІРµСЂРєРё.
- `pnpm verify:boundaries` РїРѕРґС‚РІРµСЂР¶РґР°РµС‚ РіСЂР°РЅРёС†Сѓ runtime-РєРѕРЅС‚РµРЅС‚Р°.
- Р”РѕРєСѓРјРµРЅС‚Р°С†РёСЏ Рё СЃСЃС‹Р»РєРё РЅР° fixtures СЃРѕРѕС‚РІРµС‚СЃС‚РІСѓСЋС‚ С„Р°РєС‚РёС‡РµСЃРєРѕР№ СЃС‚СЂСѓРєС‚СѓСЂРµ.

## РћРіСЂР°РЅРёС‡РµРЅРёСЏ

РќРµ РґРѕР±Р°РІР»СЏС‚СЊ СЂРµР°Р»СЊРЅС‹Рµ РєР»РёРµРЅС‚СЃРєРёРµ РёР»Рё Р°РіРµРЅС‚СЃРєРёРµ РґР°РЅРЅС‹Рµ РІ versioned
fixtures. РСЃС‚РѕСЂРёС‡РµСЃРєРёРµ snapshots РґРѕР»Р¶РЅС‹ Р±С‹С‚СЊ СЏРІРЅРѕ РѕР±РѕР·РЅР°С‡РµРЅС‹ РєР°Рє
СЂРµРіСЂРµСЃСЃРёРѕРЅРЅС‹Рµ Рё РЅРµ РґРѕР»Р¶РЅС‹ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊСЃСЏ РєР°Рє production content.

## Р—Р°РІРёСЃРёРјРѕСЃС‚Рё

РЎРІСЏР·Р°РЅРѕ СЃ РїСЂР°РІРёР»Р°РјРё runtime content boundary РІ `AGENTS.md`,
`docs/site/content.md` Рё `docs/development/verification-and-ci.md`.


## Verification

Moved versioned fixtures to `tests/fixtures/content/`, updated loaders,
scripts, E2E provisioning, and documentation. Content invariants, boundaries,
code style, Astro check, content-block fixtures, and publication policy passed.
