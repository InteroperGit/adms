# Перевести статьи услуг на services/[id].astro по примеру projects

**Статус:** Ожидает выполнения

**Создана:** 2026-10-20

## Цель

Генерировать страницы статей услуг через единый
`src/pages/services/[id].astro` по образцу
`src/pages/projects/[id].astro`, используя проверенные данные каталога услуг.
Добавление услуги не должно требовать отдельного файла страницы.

## Исходные файлы

- `src/pages/projects/[id].astro` — образец генерации маршрутов, передачи
  типизированных данных и сборки страницы из компонентов.
- `src/pages/services/*.astro` — пять текущих страниц с фиксированным ID.
- `src/components/sections/ServiceArticle.astro` — текущая сборка статьи.
- `src/content/services.ts`, `src/validation/services.ts` — загрузка данных
  и проверка ссылок через обнаружение отдельных статических страниц.
- `src/content/service-publication.ts`, `src/pages/sitemap.xml.ts` — правила
  публикации и индексирования услуг.
- `data/content/config/services.json`, `data/content/articles/services/` —
  каталог и содержимое статей.

## Объём работы

- Создать `src/pages/services/[id].astro` с `getStaticPaths()`, который
  формирует маршруты из валидированных записей услуг и передаёт данные
  статьи через типизированные props по образцу страницы проекта.
- Перенести сборку страницы в новую архитектуру: layout, метаданные,
  навигация, заголовок, уведомление о демонстрации, `ContentBlocks` и действия.
  Переиспользовать компоненты и выделять части статьи по их ответственности.
  Пересмотреть необходимость прежнего `ServiceArticle.astro` и убрать
  неиспользуемую обёртку, если её роль перейдёт новой странице.
- Заменить пять отдельных страниц единым маршрутом, сохранив существующие
  адреса `/services/<id>/`, ссылки, якоря и содержимое статей.
- Обновить обнаружение и валидацию маршрутов: сейчас loader исключает
  динамические файлы. Проверять соответствие ссылок реальным ID каталога,
  сохраняя обнаружение неизвестных ID, дубликатов и некорректных ссылок.
  Не создавать циклическую зависимость между loader и страницей маршрута.
- Сохранить текущие правила demo/approval, `noindex`, sitemap и доступности
  демонстрационных статей. Передавать корректный контекст услуги в блоки
  контента и формы заказа, включая специализированную форму световых букв.
- Обновить документацию услуг и проверки, зависящие от отдельных файлов
  страниц. Runtime-контент хранить в `data/content/`, fixtures — в
  `tests/fixtures/content/`, загрузчики и типы — в `src/`.

## Критерии готовности

- Все пять существующих URL собираются через `[id].astro`; неизвестный ID
  возвращает 404. Отдельные файлы страниц услуг больше не нужны.
- Новая валидная услуга и её статья получают маршрут при сборке без создания
  нового `.astro` файла; некорректная ссылка или отсутствующая статья
  обнаруживаются проверкой данных.
- Содержимое, метаданные, demo notices, sitemap, навигация, изображения,
  формы и их контекст сохраняют ожидаемое поведение.
- Проверены существующие страницы и сценарии добавления/удаления записи,
  неизвестного ID и несоответствия ссылки ID. Выполнены актуальные проверки
  типов, сборки и затронутые проверки услуг; результаты записаны в задаче.
- Проверено отображение на мобильном и настольном экранах в обеих темах,
  доступность навигации с клавиатуры и сохранность якорей форм.

## Правила выполнения

Прочитать [правила проекта](../../../AGENTS.md) и
[правила разработки](../../development/rules/) перед изменениями.
Применить `astro-best-practices` при работе с Astro.
Справочники: [статьи услуг](../../site/service-articles.md),
[каталог услуг](../../site/services-content.md).

## Implementation — 2026-10-20

- Replaced the five fixed service page files with
  `src/pages/services/[id].astro` and catalog-backed `getStaticPaths()`.
- Kept stable `/services/<id>/` URLs, typed route props, shared article
  rendering, demo/noindex behavior, form context, and sitemap gates.
- Replaced static-file discovery with catalog route validation and rejected
  service links whose slug does not match their owning ID.
- Updated integration and validation coverage and service documentation.

## Verification

- Focused route, article, and validation suites: 61 tests passed.
- Full Vitest suite: 99 files, 748 tests passed.
- `astro check`, code-style, ESLint, type contracts, content boundaries and
  content invariants passed; the existing Zod deprecation hint remains.
- Production build passed with all five generated service routes.
- The legacy `test:service-articles` script could not run because its
  historical `services-before-blocks.json` fixture is absent from the tree.
