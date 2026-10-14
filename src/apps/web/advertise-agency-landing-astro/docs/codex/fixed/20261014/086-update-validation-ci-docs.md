# 086 — Проверки, CI и документация

## Цель

Закрепить запрет на хранение runtime-контента и описать безопасный процесс
локальной разработки, CI и релизной поставки.

## Задачи

- Добавить `.gitignore` для runtime exports, secrets и generated build folders;
  оставить `data/templates/` отслеживаемым.
- Добавить pre-commit/CI scan, который блокирует `data/content/` и значения из
  denylist.
- Обновить README, `docs/site/content.md`, setup, deployment и quality gates.
- Добавить проверки `git ls-files`, шаблонов, generator manifest и clean clone.
- Зафиксировать порядок публикации внешнего контента и rollback.

## Приёмка

CI блокирует возврат удалённых путей и секретов; документация позволяет собрать
проект новому разработчику без доступа к Git-истории контента.
