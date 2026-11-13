# 087 — Удаление контента и переписывание Git-истории

## Цель

Удалить `data/content/` из текущего дерева и всех доступных Git refs после
подтверждения, что приложение больше от него не зависит.

## Предусловия

- Задачи 083–086 приняты.
- Создан резервный mirror и зафиксированы хэши refs.
- Владелец репозитория согласовал force-push, затронутые ветки и теги.
- Определено окно миграции и инструкция для разработчиков повторно клонировать
  репозиторий.

## Задачи

- Удалить `data/content/` из рабочей ветки и добавить запреты в `.gitignore`.
- Переписать историю всех согласованных refs специализированным инструментом,
  исключив путь и проверив результат в новом clone.
- Пропустить `git fsck`, поиск по refs и секретный сканер до публикации refs.
- Опубликовать rewritten refs и сообщить команде порядок reclone/reset.
- Сохранить audit report с исходными и итоговыми хэшами.

## Приёмка

Ни один согласованный ref не содержит `data/content/`; clean clone собирается с
внешним контентом; резервный mirror позволяет восстановить исходную историю.

## Local data preservation constraint

The existing `data/content/` directory is a ready data reserve. Task 087 must
remove it from the Git index and rewritten refs only. It must not delete,
rewrite, regenerate, or replace the physical files in the working directory.
Before any index or history operation, record a byte-level manifest; after the
operation, verify all 60 files and their hashes are unchanged. Add the local
path to `.gitignore` only after the preservation check.
