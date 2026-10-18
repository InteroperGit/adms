# 117 вЂ” РџРµСЂРµРЅРµСЃС‚Рё JSON-РєРѕРЅС‚РµРЅС‚ РІ РєР°С‚Р°Р»РѕРі config

Р”Р°С‚Р°: 2026-10-17. РЎС‚Р°С‚СѓСЃ: completed.

## Р—Р°РґР°С‡Р°

РџРµСЂРµРёРјРµРЅРѕРІР°С‚СЊ `data/templates/json/` РІ
`data/templates/config/` Рё РїСЂРёРІРµСЃС‚Рё runtime-РєРѕРЅС‚РµРЅС‚ Рє С‚РѕР№ Р¶Рµ СЃС‚СЂСѓРєС‚СѓСЂРµ:
РїРµСЂРµРЅРµСЃС‚Рё РІСЃРµ JSON-С„Р°Р№Р»С‹ РёР· `data/content/` РІ `data/content/config/`,
СЃРѕС…СЂР°РЅРёРІ РІР»РѕР¶РµРЅРЅС‹Р№ РєР°С‚Р°Р»РѕРі `legal/`.

## РљРѕРЅС‚РµРєСЃС‚

РЎРµР№С‡Р°СЃ С€Р°Р±Р»РѕРЅС‹ JSON Р»РµР¶Р°С‚ РІ `data/templates/json/`, Р° runtime JSON
СЃРјРµС€Р°РЅ СЃ РєР°С‚Р°Р»РѕРіР°РјРё СЃС‚Р°С‚РµР№ Рё legal-РґРѕРєСѓРјРµРЅС‚РѕРІ РІ РєРѕСЂРЅРµ `data/content/`.
РќРѕРІР°СЏ СЃС‚СЂСѓРєС‚СѓСЂР° РґРѕР»Р¶РЅР° СЏРІРЅРѕ РѕС‚РґРµР»СЏС‚СЊ РєРѕРЅС„РёРіСѓСЂР°С†РёРѕРЅРЅС‹Рµ JSON РѕС‚ MDX Рё
РѕСЃС‚Р°Р»СЊРЅРѕРіРѕ runtime-РєРѕРЅС‚РµРЅС‚Р°:

```text
data/templates/config/
data/content/config/
data/content/articles/
data/content/fixtures/        # РІСЂРµРјРµРЅРЅРѕ РґРѕ РІС‹РїРѕР»РЅРµРЅРёСЏ Р·Р°РґР°С‡Рё 116
```

## РћР±СЉС‘Рј

- РџРµСЂРµРёРјРµРЅРѕРІР°С‚СЊ РєР°С‚Р°Р»РѕРі `data/templates/json/` РІ
  `data/templates/config/`, РІРєР»СЋС‡Р°СЏ `config/legal/`.
- РџРµСЂРµРјРµСЃС‚РёС‚СЊ РІСЃРµ JSON-С„Р°Р№Р»С‹ РёР· РєРѕСЂРЅСЏ `data/content/` РІ
  `data/content/config/`; `data/content/legal/*.json` РїРµСЂРµРЅРµСЃС‚Рё РІ
  `data/content/config/legal/`.
- РћР±РЅРѕРІРёС‚СЊ `data/templates/manifest.json`: РїСѓС‚Рё РёСЃС‚РѕС‡РЅРёРєРѕРІ РґРѕР»Р¶РЅС‹ Р±С‹С‚СЊ
  РїРѕРґ `config/`, Р° output-РїСѓС‚Рё РґРѕР»Р¶РЅС‹ СЃРѕР·РґР°РІР°С‚СЊ РЅРѕРІС‹Р№ layout РІ
  `data/content/config/`.
- РћР±РЅРѕРІРёС‚СЊ РіРµРЅРµСЂР°С‚РѕСЂ `scripts/generate-content-catalog.mjs`, CI/E2E
  provisioning Рё РїСЂРѕРІРµСЂРєРё manifest/boundary С‚Р°Рє, С‡С‚РѕР±С‹ СЂРµР·СѓР»СЊС‚Р°С‚
  РіРµРЅРµСЂР°С†РёРё РёРјРµР» РєР°С‚Р°Р»РѕРі `config/`.
- РћР±РЅРѕРІРёС‚СЊ РІСЃРµ runtime-РёРјРїРѕСЂС‚С‹, Vite aliases, source-aware error paths,
  СЃРєСЂРёРїС‚С‹ РїСЂРѕРІРµСЂРѕРє Рё С‚РµСЃС‚РѕРІС‹Рµ РјРѕРєРё СЃ `@/data/content/<name>.json` РЅР°
  `@/data/content/config/<name>.json`.
- РћР±РЅРѕРІРёС‚СЊ РґРѕРєСѓРјРµРЅС‚Р°С†РёСЋ, README, РїСЂРёРјРµСЂС‹ Рё СЃСЃС‹Р»РєРё РЅР° РєРѕРЅРєСЂРµС‚РЅС‹Рµ JSON.
- РЎРѕРіР»Р°СЃРѕРІР°С‚СЊ РїСѓС‚Рё СЃ Р·Р°РґР°С‡РµР№ 116: fixtures РЅРµ РґРѕР»Р¶РЅС‹ РїРѕРїР°СЃС‚СЊ РІ
  `data/content/config/` Рё РЅРµ РґРѕР»Р¶РЅС‹ РѕСЃС‚Р°С‚СЊСЃСЏ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕР№ С‡Р°СЃС‚СЊСЋ
  runtime-РєР°С‚Р°Р»РѕРіР°.
- РќРµ РјРµРЅСЏС‚СЊ СЃС‚СЂСѓРєС‚СѓСЂСѓ `data/content/articles/` Рё РЅРµ РїРµСЂРµРЅРѕСЃРёС‚СЊ С‚СѓРґР° JSON.

## Р“РѕС‚РѕРІРѕ, РєРѕРіРґР°

- `data/templates/json/` РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚, Р° РІСЃРµ РµРіРѕ С€Р°Р±Р»РѕРЅС‹ РЅР°С…РѕРґСЏС‚СЃСЏ РІ
  `data/templates/config/`.
- Р’СЃРµ runtime JSON РЅР°С…РѕРґСЏС‚СЃСЏ РїРѕРґ `data/content/config/`, РІРєР»СЋС‡Р°СЏ
  `config/legal/`; РІ РєРѕСЂРЅРµ `data/content/` JSON РЅРµ РѕСЃС‚Р°Р»РѕСЃСЊ.
- Р“РµРЅРµСЂР°С‚РѕСЂ СЃРѕР·РґР°С‘С‚ РёРґРµРЅС‚РёС‡РЅСѓСЋ СЃС‚СЂСѓРєС‚СѓСЂСѓ РёР· С‡РёСЃС‚РѕРіРѕ template source.
- Production imports, E2E aliases, CI provisioning Рё diagnostics
  РёСЃРїРѕР»СЊР·СѓСЋС‚ РЅРѕРІС‹Рµ РїСѓС‚Рё.
- `data/templates/manifest.json` Рё boundary-РїСЂРѕРІРµСЂРєРё РїСЂРѕРІРµСЂСЏСЋС‚ РЅРѕРІС‹Р№
  layout Рё СЃРѕС…СЂР°РЅСЏСЋС‚ denylist/Р±РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ С€Р°Р±Р»РѕРЅРѕРІ.
- РџСЂРѕС…РѕРґСЏС‚ `pnpm check`, `pnpm build`, `pnpm verify:content`,
  `pnpm verify:boundaries`, content-catalog Рё РІСЃРµ Р·Р°С‚СЂРѕРЅСѓС‚С‹Рµ unit,
  integration Рё E2E РїСЂРѕРІРµСЂРєРё.
- РџРѕРёСЃРє РїРѕ СЂР°Р±РѕС‡РµРјСѓ РєРѕРґСѓ Рё Р°РєС‚СѓР°Р»СЊРЅРѕР№ РґРѕРєСѓРјРµРЅС‚Р°С†РёРё РЅРµ РЅР°С…РѕРґРёС‚ СЃС‚Р°СЂС‹С…
  РїСѓС‚РµР№ `data/templates/json/` Рё `@/data/content/<name>.json`.

## РћРіСЂР°РЅРёС‡РµРЅРёСЏ

РЎРѕРґРµСЂР¶РёРјРѕРµ JSON РЅРµ РёР·РјРµРЅСЏС‚СЊ РІ СЂР°РјРєР°С… СЃС‚СЂСѓРєС‚СѓСЂРЅРѕР№ РјРёРіСЂР°С†РёРё. РќРµ РґРѕР±Р°РІР»СЏС‚СЊ
РЅРѕРІС‹Рµ production-РґР°РЅРЅС‹Рµ Рё РЅРµ РІРѕР·РІСЂР°С‰Р°С‚СЊ runtime-РєРѕРЅС‚РµРЅС‚ РІ Git. РСЃС‚РѕСЂРёС‡РµСЃРєРёРµ
РґРѕРєСѓРјРµРЅС‚С‹ РІ `docs/codex/fixed/` РјРѕР¶РЅРѕ РѕСЃС‚Р°РІРёС‚СЊ РєР°Рє Р°СЂС…РёРІРЅС‹Рµ СЃРІРёРґРµС‚РµР»СЊСЃС‚РІР°,
РµСЃР»Рё РѕРЅРё РЅРµ СѓС‡Р°СЃС‚РІСѓСЋС‚ РІ РїСЂРѕРІРµСЂРєР°С… С‚РµРєСѓС‰РµР№ СЃС‚СЂСѓРєС‚СѓСЂС‹.

## Р—Р°РІРёСЃРёРјРѕСЃС‚Рё

Р—Р°РІРёСЃРёС‚ РѕС‚ Р·Р°РґР°С‡Рё 116 РґР»СЏ РѕРєРѕРЅС‡Р°С‚РµР»СЊРЅРѕРіРѕ СЂР°Р·РґРµР»РµРЅРёСЏ fixtures Рё runtime
content. РЎРІСЏР·Р°РЅРѕ СЃ `data/templates/manifest.json`,
`scripts/generate-content-catalog.mjs`, `scripts/e2e-server.mjs`,
`vitest.config.ts`, `src/content/` Рё РґРѕРєСѓРјРµРЅС‚Р°С†РёРµР№ content boundary.


## Verification

Moved runtime JSON to `data/content/config/` and template JSON to
`data/templates/config/`. Updated imports, aliases, CI/E2E provisioning,
manifest generation, boundary checks, catalog fixtures, and documentation.
Astro check, static build, content invariants, boundary checks, catalog
fixtures, code style, content-block fixtures, publication policy, and
paragraph-link validation passed.
