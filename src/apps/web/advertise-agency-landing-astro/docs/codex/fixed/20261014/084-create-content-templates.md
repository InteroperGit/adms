# 084 — Шаблоны и генератор контента

## Цель

Создать отслеживаемые шаблоны в `data/templates/` и детерминированный генератор
обезличенного build-набора.

## Задачи

- Перенести только структуру и плейсхолдеры для JSON и MDX, без реальных копий.
- Добавить `schemaVersion`, manifest и явное сопоставление обязательных файлов.
- Реализовать генератор с атомарным выводом и проверкой отсутствующих файлов.
- Нормализовать root-relative media paths и запретить небезопасные выражения MDX.
- Добавить unit/fixture проверки: полный, неполный и запрещённый набор.

## Приёмка

Повторный запуск даёт идентичный результат; шаблоны проходят схемы; реальные
значения и секреты не попадают в `data/templates/`.

## Completed implementation

Completed 2026-10-14. Added safe placeholder-only templates under
`data/templates/`, including a versioned JSON-only manifest, canonical
required-file mapping, JSON examples, and a schema contract. No authored values from
`data/content/` were copied into the templates.

Added `scripts/generate-content-catalog.mjs`. It generates base JSON data for a
new site, rejects secrets, unsafe URLs, and `data/content` references,
normalizes relative media paths, sorts output, and performs a
temporary-directory swap for deterministic output. Articles are deliberately
outside this generator.

Added `scripts/test-content-catalog.mjs` with complete, incomplete, forbidden,
and repeat-run fixtures. Added `generate:content` and
`test:content-catalog` package scripts.

## Acceptance checklist

- [x] Placeholder JSON templates are versioned and contain no live
      authored copy.
- [x] `schemaVersion`, manifest entries, and required-file mapping exist.
- [x] Generator validates missing input and writes a deterministic catalog.
- [x] Root-relative media paths are normalized.
- [x] Secrets, unsafe URLs, and `data/content` paths are rejected.
- [x] Complete, incomplete, forbidden, and repeat-run fixtures pass.

## Verification

- `node scripts/test-content-catalog.mjs`
- `node scripts/test-content-block-fixtures.mjs`
- `node scripts/test-service-articles.mjs`
- `node scripts/test-project-articles.mjs`
- `node scripts/test-publication-policy.mjs`
- `node scripts/verify-content-invariants.mjs`
- `node_modules/.bin/astro.cmd check`
- `node scripts/check-code-style.mjs`

## Amendment for task 85

The templates were expanded after task 85 was clarified. The JSON directory now
mirrors the complete static file structure of `data/content/` with test-only
values for dynamic fields. The manifest includes one project starter article
and one service starter article. The generator copies those MDX files verbatim
and does not validate article content; JSON remains the only generated and
validated data contract.
