# 078. Миграция данных проектов на блоки

Status: fixed. Created: 2026-10-12.
Plan: [Универсальные блоки](../../plan/20261012_universal-content-blocks-plan.md).
Dependencies: 075, 075a, 076, 077.

## Работы

- [x] Мигрировать все статьи проектов на MDX-блоки; использовать JSON
  fallback только для записей, которые не проходят MDX-проверку.
- [x] Перенести story/details/process/result/photos в блоки без потери данных.
- [x] Подключить order-form через category и сохранить media provenance.
- [x] Удалить старые поля после полного визуального и контентного сравнения.
- [x] Обновить fixtures, content docs и publication checks.

## Приёмка

- [x] Все проекты собираются и визуально сохраняют порядок разделов.
- [x] Пустые поля, demo, проекты без категории и approved media обработаны.
- [x] Старые поля не используются рендерерами после миграции.

- [x] Convert materials, timing, conditions and results into sequential blocks
  in the common flow; do not move them into a side information panel.
- [x] Project details are read linearly; the legacy specifications panel and
  two-column information rail are absent.

- [x] Replace top-level `evidence` with block provenance during migration.
- [x] Reject removed legacy fields with the strict project Zod schema.

## Follow-up from 075a

- [x] Migrate all project page and card reads from the removed Project fields to
  the ordered `ContentBlock[]` stream.
- [x] Verify that the legacy conversion preserves article text, images, dates,
  descriptions, rights, and approval provenance for every existing project.
- [x] Remove the legacy `ProjectPhoto` and `ProjectProcess` UI components after
  the visual migration is complete.
- [x] Update fixtures and run the full content validation after migration.
