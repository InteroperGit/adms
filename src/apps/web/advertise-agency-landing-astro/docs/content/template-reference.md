# Справочник шаблонов контента

Документ описывает файлы из `data/templates/manifest.json`. Значения
`TEST_*`, `test@example.com`, `example.test` и `/test-destination` являются
тестовыми и должны быть заменены до публикации. Не копируйте в шаблоны данные
из `data/content/`, имена клиентов, реальные URL или готовые рекламные тексты.

## Общие правила

JSON остаётся обычным JSON: комментарии и служебные поля вроде `_comment`
запрещены. Необязательные поля отмечены в схеме; `null` допустим только там,
где он разрешён схемой. Строки не должны быть пустыми, идентификаторы должны
быть уникальными, а slug используют `kebab-case`.

Пути медиа — root-relative (`/media/file.webp`) или URL `http(s)` без учётных
данных. Внутренние ссылки также root-relative. Даты имеют формат `YYYY-MM-DD`.
Размеры изображений — положительные целые числа в пикселях, focal point —
числа от `0` до `100`.

## Manifest и схема

`manifest.json` содержит версию `1.0.0`, массив `files` и объект `placeholders`
(`text`, `slug`, `media`, `source`). Каждая запись `files` содержит относительные
`path`, `kind` (`json` или `mdx`) и `output`. Все записи из `files` копируются
при инициализации; отдельный список обязательных файлов не нужен.

`schema.json` фиксирует ту же версию, поддерживаемые виды файлов, правило медиа
`root-relative-or-https` и наличие одной проектной и одной сервисной
starter-статьи.

## JSON-файлы

- `site.json` — бренд, контакты, карта, навигация, legal-ссылки, footer и
  заголовки секций. `menu` и `legal` содержат `{label, href}`.
- `introduction.json` — первый экран: `heading`, `summary`, `location`,
  `copyApproved`, `demoMode`, `action` и nullable `photo`. Фото содержит `src`,
  `alt`, размеры, источник, разрешение публикации, approval и два focal point.
- `about.json` — два описания, иконка и массив статистики `{value, label}`.
- `about-carousel.json` — настройки карусели и элементы с уникальным числовым
  `id`, изображением, alt и положительными размерами.
- `business-solutions.json` — ровно четыре решения с уникальными slug,
  описаниями, `example`, CTA, каруселью и attribution.
- `faq.json` — FAQ с approval. Состояния approval: `draft` и `approved`;
  одобренная запись требует `source` и `approvedBy`.
- `icons.json` — строки путей или имён иконок для контактов, меню и соцсетей.
- `offers.json` — слайды с настройками показа, изображением и CTA. `href` и
  `linkLabel` задаются вместе; interval не меньше 5000.
- `order-inquiry.json` — тексты формы, согласие, endpoint отправки, поля и
  feedback. При включённой отправке нужны одобренное согласие и endpoint.
- `ordering-process.json` — ровно пять шагов с уникальными id и непустыми
  списками действий клиента и агентства.
- `pricing.json` — факторы стоимости и примеры. Цена бывает `exact` или
  `range`, валюта только `RUB`, контекст `demo|current|historical`; для
  current/historical обязательна дата `asOf`.
- `production-and-guarantees.json` — операции, материалы, проверки, фото,
  гарантии и обслуживание. Одобренная гарантия не может иметь
  `sourceType: pending`.
- `project-catalog.json` — положительный целочисленный `pageSize`.
- `project-categories.json` — категории с уникальными slug и цветами.
- `projects.json` — каталог проектов с уникальным числовым id, статусом
  `draft|demo|published`, attribution и ссылкой на starter-статью.
- `reviews.json` — отзывы с уникальным id, автором, компанией и avatar.
- `services.json` — каталог услуг с уникальным slug, карточкой, ссылкой и
  статьёй. Runtime-статья содержит metadata и непустой массив блоков.
- `legal/privacy-policy.json` и `legal/terms-of-use.json` — юридические
  документы с датой действия и массивом секций; у terms также есть `list`.

## Starter MDX

`articles/projects/1.mdx` использует frontmatter `projectId` (положительное
целое). `articles/services/starter-service.mdx` использует `title`,
`description` и `approved: false`. Оба файла содержат безопасные тестовые
значения и демонстрируют все зарегистрированные блоки.

Поддерживаются только следующие блоки:

- `ParagraphBlock` — optional `heading`, непустой массив `paragraphs`;
- `OrderedListBlock` и `UnorderedListBlock` — optional `heading` и `items`;
- `TableBlock` — `columns` и строки `rows` одинаковой ширины;
- `ChartBlock` — `chartType` `bar|line|pie`, серии и точки `{label, value}`;
- `ImageBlock` — `src`, `alt`, размеры, caption, kind и focal point;
- `ImageGalleryBlock` — caption и непустой массив изображений;
- `OrderFormBlock` — зарегистрированные `formId`, `context` и category;
- `QuoteBlock` — `text`, optional `author` и `source`;
- `FootnoteBlock` — `text`, optional `reference` и `targetId` существующего
  блока.

Каждый блок может иметь unique kebab-case `id`, статус `draft|demo|published`
и provenance. В provenance обязательны `source`; `approvedBy` и `approvedAt`
задаются парой, дата имеет формат `YYYY-MM-DD`. Импорты, произвольный JSX,
скрипты и незарегистрированные компоненты запрещены.

## Проверка

Выполните `node scripts/test-content-catalog.mjs`,
`node scripts/verify-content-invariants.mjs`, `node_modules/.bin/astro.cmd check`
и `node scripts/check-code-style.mjs`. После генерации проверьте состав файлов,
сохранение чистого JSON, копирование MDX без валидации генератором и отсутствие
изменений в `data/content/`.

## Полное дерево полей с комментариями

Дерево построено по текущим JSON-шаблонам. Для массивов показана структура одного элемента;
обязательность, перечисления и дополнительные ограничения приведены в комментариях и схемах.

### `json/about-carousel.json`

- `options` — object — Настройки поведения компонента.
  - `enabled` — boolean — Включает компонент или элемент.
  - `autoplay` — boolean — Автоматическая смена слайдов.
  - `intervalMs` — number — Интервал автопрокрутки в миллисекундах.
  - `manualNavigation` — boolean — Разрешает ручную навигацию.
  - `arrows` — boolean — Показывает стрелки.
  - `circles` — boolean — Показывает индикаторы.
  - `descriptions` — boolean — Показывает описания слайдов.
  - `buttons` — boolean — Показывает CTA-кнопки.
  - `animation` — boolean — Включает анимацию.
  - `layout` — string — Вариант раскладки. Допустимые значения: `full` или `panel`.
  - `imageFit` — string — Способ вписывания изображения. Допустимые значения: `cover` или `contain`.
  - `aspectRatio` — number — Соотношение сторон.
  - `eagerFirst` — boolean — Загружает первый слайд без задержки.
- `items` — array — Коллекция элементов.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — number — Стабильный уникальный идентификатор.
    - `enabled` — boolean — Включает компонент или элемент.
    - `image` — string — Изображение примера.
    - `imageAlt` — string — Альтернативный текст изображения.
    - `imageWidth` — number — Ширина изображения в пикселях.
    - `imageHeight` — number — Высота изображения в пикселях.

### `json/about.json`

- `description1` — string — Первый абзац описания.
- `description2` — string — Второй абзац описания.
- `stats` — array — Массив показателей компании.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `value` — string — Значение показателя.
    - `label` — string — Подпись поля или ссылки.
- `icon` — string — Иконка или её путь.

### `json/business-solutions.json`

- `heading` — string — Заголовок секции.
- `introduction` — array — Вводный текст секции.
  - `[элемент]` — string — Одно строковое значение массива.
- `items` — array — Коллекция элементов.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `title` — string — Заголовок страницы или записи.
    - `summary` — array — Краткое резюме.
      - `[элемент]` — string — Одно строковое значение массива.
    - `customerTask` — array — Задача клиента.
      - `[элемент]` — string — Одно строковое значение массива.
    - `solution` — array — Описание решения.
      - `[элемент]` — string — Одно строковое значение массива.
    - `example` — object — Пример результата.
      - `title` — string — Заголовок страницы или записи.
      - `text` — array — Текст отзыва или блока.
        - `[элемент]` — string — Одно строковое значение массива.
    - `inquiryLabel` — string — Подпись ссылки на заявку.
    - `inquiryHref` — string — Ссылка на форму заявки.
    - `carousel` — object — Карусель медиа.
      - `itemLabel` — string — Подпись элемента карусели.
      - `mediaSource` — string — Источник медиа.
      - `mediaRights` — string — Права на медиа.
      - `options` — object — Настройки поведения компонента.
        - `enabled` — boolean — Включает компонент или элемент.
        - `autoplay` — boolean — Автоматическая смена слайдов.
        - `intervalMs` — number — Интервал автопрокрутки в миллисекундах.
        - `manualNavigation` — boolean — Разрешает ручную навигацию.
        - `arrows` — boolean — Показывает стрелки.
        - `circles` — boolean — Показывает индикаторы.
        - `descriptions` — boolean — Показывает описания слайдов.
        - `buttons` — boolean — Показывает CTA-кнопки.
        - `animation` — boolean — Включает анимацию.
        - `layout` — string — Вариант раскладки. Допустимые значения: `full` или `panel`.
        - `imageFit` — string — Способ вписывания изображения. Допустимые значения: `cover` или `contain`.
        - `aspectRatio` — number — Соотношение сторон.
        - `eagerFirst` — boolean — Загружает первый слайд без задержки.
      - `items` — array — Коллекция элементов.
        - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
          - `id` — number — Стабильный уникальный идентификатор.
          - `enabled` — boolean — Включает компонент или элемент.
          - `image` — string — Изображение примера.
          - `imageAlt` — string — Альтернативный текст изображения.
          - `imageWidth` — number — Ширина изображения в пикселях.
          - `imageHeight` — number — Высота изображения в пикселях.
          - `description` — string — Описание для страницы, карточки или записи.
          - `presentation` — object — Параметры отображения текста поверх изображения.
            - `fontSizeRem` — number — Размер текста в rem.
            - `textColor` — string — Цвет текста категории.
            - `overlay` — string — Тип затемняющей подложки. Допустимые значения: `dark` или `light`.
            - `horizontal` — string — Горизонтальное выравнивание.
            - `vertical` — string — Вертикальное выравнивание.
            - `focalPoint` — object — Точка фокусировки изображения.
              - `x` — number — Горизонтальная координата от 0 до 100.
              - `y` — number — Вертикальная координата от 0 до 100.
    - `attribution` — object — Тип указания авторства.
      - `customerName` — null — Имя или название клиента.
      - `projectId` — null — Идентификатор проекта.
      - `href` — null — Ссылка или URL назначения.
      - `evidence` — null — Ссылка на подтверждение.
      - `media` — array — Связанные материалы.

### `json/faq.json`

- `demoMode` — boolean — Режим демонстрационных данных.
- `demoNotice` — string — Предупреждение о демонстрационном содержимом.
- `heading` — string — Заголовок секции.
- `inquiryLabel` — string — Подпись ссылки на заявку.
- `inquiryHref` — string — Ссылка на форму заявки.
- `approval` — object — Сведения об одобрении.
  - `state` — string — Состояние проверки. Допустимые значения: `draft` или `approved`.
  - `source` — null — Источник или подтверждение данных.
  - `approvedBy` — null — Кто одобрил содержимое.
- `items` — array — Коллекция элементов.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `question` — string — Вопрос FAQ.
    - `answer` — array — Ответ FAQ.
      - `[элемент]` — string — Одно строковое значение массива.
    - `approval` — object — Сведения об одобрении.
      - `state` — string — Состояние проверки. Допустимые значения: `draft` или `approved`.
      - `source` — null — Источник или подтверждение данных.
      - `approvedBy` — null — Кто одобрил содержимое.

### `json/icons.json`

- `phone` — string — Телефон для связи.
- `email` — string — Email для связи.
- `address` — string — Адрес компании.
- `clock` — string — Иконка или подпись часов работы.
- `arrow` — string — Иконка стрелки.
- `butterfly` — string — Иконка бабочки.
- `sparkles` — string — Иконка искр.
- `mail` — string — Иконка письма.
- `menu` — object — Пункты основной навигации.
  - `open` — string — Иконка открытия меню.
  - `close` — string — Иконка закрытия меню.
- `social` — object — Ссылки на социальные сети.
  - `youtube` — string — Ссылка или иконка YouTube.
  - `telegram` — string — Ссылка или иконка Telegram.
  - `vk` — string — Ссылка или иконка VK.

### `json/introduction.json`

- `heading` — string — Заголовок секции.
- `summary` — string — Краткое резюме.
- `location` — string — Локация компании или проекта.
- `copyApproved` — boolean — Признак редакторского одобрения текста.
- `demoMode` — boolean — Режим демонстрационных данных.
- `action` — object — Основной призыв к действию.
  - `label` — string — Подпись поля или ссылки.
  - `href` — string — Ссылка или URL назначения.
- `photo` — object — Главная фотография или null.
  - `src` — string — Источник изображения или медиа.
  - `alt` — string — Альтернативный текст изображения.
  - `width` — number — Ширина изображения в пикселях.
  - `height` — number — Высота изображения в пикселях.
  - `source` — string — Источник или подтверждение данных.
  - `projectContext` — string — Контекст проекта для изображения.
  - `publicationPermission` — string — Разрешение на публикацию.
  - `approved` — boolean — Признак одобрения.
  - `desktopFocalPoint` — object — Точка фокусировки для desktop.
    - `x` — number — Горизонтальная координата от 0 до 100.
    - `y` — number — Вертикальная координата от 0 до 100.
  - `mobileFocalPoint` — object — Точка фокусировки для mobile.
    - `x` — number — Горизонтальная координата от 0 до 100.
    - `y` — number — Вертикальная координата от 0 до 100.

### `json/legal/privacy-policy.json`

- `title` — string — Заголовок страницы или записи.
- `description` — string — Описание для страницы, карточки или записи.
- `effectiveDate` — string — Дата вступления документа в силу.
- `sections` — array — Разделы документа.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `heading` — string — Заголовок секции.
    - `content` — string — Текст раздела документа.

### `json/legal/terms-of-use.json`

- `title` — string — Заголовок страницы или записи.
- `description` — string — Описание для страницы, карточки или записи.
- `effectiveDate` — string — Дата вступления документа в силу.
- `sections` — array — Разделы документа.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `heading` — string — Заголовок секции.
    - `content` — string — Текст раздела документа.
    - `list` — array — Список положений.
      - `[элемент]` — string — Одно строковое значение массива.

### `json/offers.json`

- `enabled` — boolean — Включает компонент или элемент.
- `autoplay` — boolean — Автоматическая смена слайдов.
- `intervalMs` — number — Интервал автопрокрутки в миллисекундах.
- `items` — array — Коллекция элементов.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — number — Стабильный уникальный идентификатор.
    - `enabled` — boolean — Включает компонент или элемент.
    - `description` — string — Описание для страницы, карточки или записи.
    - `presentation` — object — Параметры отображения текста поверх изображения.
      - `fontSizeRem` — number — Размер текста в rem.
      - `textColor` — string — Цвет текста категории.
      - `horizontal` — string — Горизонтальное выравнивание.
      - `vertical` — string — Вертикальное выравнивание.
      - `overlay` — string — Тип затемняющей подложки. Допустимые значения: `dark` или `light`.
      - `focalPoint` — object — Точка фокусировки изображения.
        - `x` — number — Горизонтальная координата от 0 до 100.
        - `y` — number — Вертикальная координата от 0 до 100.
      - `mobileFocalPoint` — object — Точка фокусировки для mobile.
        - `x` — number — Горизонтальная координата от 0 до 100.
        - `y` — number — Вертикальная координата от 0 до 100.
    - `image` — string — Изображение примера.
    - `imageAlt` — string — Альтернативный текст изображения.
    - `imageWidth` — number — Ширина изображения в пикселях.
    - `imageHeight` — number — Высота изображения в пикселях.
    - `linkLabel` — string — Подпись ссылки.
    - `href` — string — Ссылка или URL назначения.

### `json/order-inquiry.json`

- `title` — string — Заголовок страницы или записи.
- `subtitle` — string — Подзаголовок секции.
- `requiredNote` — string — Подсказка об обязательных полях.
- `privacyLabel` — string — Подпись согласия с политикой.
- `submitLabel` — string — Подпись кнопки отправки.
- `consent` — object — Согласие пользователя.
  - `approved` — boolean — Признак одобрения.
  - `label` — string — Подпись поля или ссылки.
- `submission` — object — Настройки отправки формы.
  - `enabled` — boolean — Включает компонент или элемент.
  - `endpoint` — string — Endpoint отправки.
  - `timeoutMs` — number — Таймаут запроса в миллисекундах.
- `fields` — object — Поля формы.
  - `name` — object — Название элемента или поля.
    - `label` — string — Подпись поля или ссылки.
    - `hint` — string — Подсказка поля.
    - `required` — boolean — Обязательность поля.
    - `maxLength` — number — Максимальная длина значения.
  - `email` — object — Email для связи.
    - `label` — string — Подпись поля или ссылки.
    - `hint` — string — Подсказка поля.
    - `required` — boolean — Обязательность поля.
    - `maxLength` — number — Максимальная длина значения.
  - `phone` — object — Телефон для связи.
    - `label` — string — Подпись поля или ссылки.
    - `hint` — string — Подсказка поля.
    - `required` — boolean — Обязательность поля.
    - `maxLength` — number — Максимальная длина значения.
  - `message` — object — Сообщение пользователя или статус.
    - `label` — string — Подпись поля или ссылки.
    - `hint` — string — Подсказка поля.
    - `required` — boolean — Обязательность поля.
    - `maxLength` — number — Максимальная длина значения.
- `feedback` — object — Сообщения состояний формы.
  - `unavailable` — string — Сообщение о недоступности.
  - `noJavaScript` — string — Сообщение при отключённом JavaScript.
  - `invalid` — string — Сообщение о неверных данных.
  - `sending` — string — Сообщение во время отправки.
  - `success` — string — Сообщение об успехе.
  - `failure` — string — Сообщение об ошибке.
  - `required` — string — Обязательность поля.
  - `email` — string — Email для связи.
  - `tooLong` — string — Сообщение о превышении длины.

### `json/ordering-process.json`

- `demoMode` — boolean — Режим демонстрационных данных.
- `demoNotice` — string — Предупреждение о демонстрационном содержимом.
- `heading` — string — Заголовок секции.
- `introduction` — string — Вводный текст секции.
- `copyApproved` — boolean — Признак редакторского одобрения текста.
- `approvalSource` — null — Источник подтверждения одобренного текста.
- `pendingInputs` — array — Ожидаемые входные данные.
  - `[элемент]` — string — Одно строковое значение массива.
- `steps` — array — Шаги процесса.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `icon` — string — Иконка или её путь.
    - `title` — string — Заголовок страницы или записи.
    - `description` — string — Описание для страницы, карточки или записи.
    - `customerProvides` — array — Что предоставляет клиент.
      - `[элемент]` — string — Одно строковое значение массива.
    - `agencyHandles` — array — Что делает агентство.
      - `[элемент]` — string — Одно строковое значение массива.

### `json/pricing.json`

- `demoMode` — boolean — Режим демонстрационных данных.
- `demoNotice` — string — Предупреждение о демонстрационном содержимом.
- `demoPriceLabel` — string — Подпись демонстрационной цены.
- `heading` — string — Заголовок секции.
- `introduction` — string — Вводный текст секции.
- `copyApproved` — boolean — Признак редакторского одобрения текста.
- `approvalSource` — null — Источник подтверждения одобренного текста.
- `costFactors` — object — Факторы стоимости.
  - `heading` — string — Заголовок секции.
  - `items` — array — Коллекция элементов.
    - `[элемент]` — string — Одно строковое значение массива.
- `estimateGuidance` — object — Пояснение к оценке.
  - `heading` — string — Заголовок секции.
  - `text` — string — Текст отзыва или блока.
- `inquiryLabel` — string — Подпись ссылки на заявку.
- `items` — array — Коллекция элементов.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `title` — string — Заголовок страницы или записи.
    - `description` — string — Описание для страницы, карточки или записи.
    - `dimensions` — string — Размеры изделия.
    - `materials` — array — Материалы.
      - `[элемент]` — string — Одно строковое значение массива.
    - `includedWork` — array — Включённые работы.
      - `[элемент]` — string — Одно строковое значение массива.
    - `exclusions` — array — Исключения из состава работ.
      - `[элемент]` — string — Одно строковое значение массива.
    - `source` — string — Источник или подтверждение данных.
    - `price` — object — Цена или диапазон цены.
      - `type` — string — Дискриминатор типа данных или блока.
      - `min` — number — Минимальное значение.
      - `max` — number — Максимальное значение.
      - `currency` — string — Валюта.
      - `context` — string — Контекст использования. Зависит от схемы: `project`/`service` или ценовой контекст.
      - `asOf` — null — Дата актуальности.
      - `conditions` — string — Условия применения.
    - `approval` — object — Сведения об одобрении.
      - `specifications` — boolean — Одобрение технических характеристик.
      - `copy` — boolean — Одобрение текста.
      - `price` — boolean — Цена или диапазон цены.
      - `reference` — null — Ссылка на подтверждение.
      - `verifiedAt` — null — Дата проверки.
    - `image` — object — Изображение примера.
      - `src` — string — Источник изображения или медиа.
      - `alt` — string — Альтернативный текст изображения.
      - `width` — number — Ширина изображения в пикселях.
      - `height` — number — Высота изображения в пикселях.
      - `source` — string — Источник или подтверждение данных.
      - `projectContext` — string — Контекст проекта для изображения.
      - `publicationPermission` — string — Разрешение на публикацию.
      - `approved` — boolean — Признак одобрения.
      - `desktopFocalPoint` — object — Точка фокусировки для desktop.
        - `x` — number — Горизонтальная координата от 0 до 100.
        - `y` — number — Вертикальная координата от 0 до 100.
      - `mobileFocalPoint` — object — Точка фокусировки для mobile.
        - `x` — number — Горизонтальная координата от 0 до 100.
        - `y` — number — Вертикальная координата от 0 до 100.

### `json/production-and-guarantees.json`

- `demoMode` — boolean — Режим демонстрационных данных.
- `demoNotice` — string — Предупреждение о демонстрационном содержимом.
- `heading` — string — Заголовок секции.
- `introduction` — string — Вводный текст секции.
- `guidance` — array — Подсказки по процессу.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `title` — string — Заголовок страницы или записи.
    - `description` — string — Описание для страницы, карточки или записи.
    - `icon` — string — Иконка или её путь.
- `copyApproved` — boolean — Признак редакторского одобрения текста.
- `approvalSource` — null — Источник подтверждения одобренного текста.
- `pendingInputs` — array — Ожидаемые входные данные.
  - `[элемент]` — string — Одно строковое значение массива.
- `productionOperations` — array — Операции производства.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `title` — string — Заголовок страницы или записи.
    - `description` — string — Описание для страницы, карточки или записи.
    - `evidence` — string — Ссылка на подтверждение.
    - `approval` — string — Сведения об одобрении.
- `materials` — array — Материалы.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `title` — string — Заголовок страницы или записи.
    - `description` — string — Описание для страницы, карточки или записи.
    - `evidence` — string — Ссылка на подтверждение.
    - `approval` — string — Сведения об одобрении.
- `qualityChecks` — array — Проверки качества.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `title` — string — Заголовок страницы или записи.
    - `description` — string — Описание для страницы, карточки или записи.
    - `evidence` — string — Ссылка на подтверждение.
    - `approval` — string — Сведения об одобрении.
- `photos` — array — Фотографии производства.
- `warrantyTerms` — array — Условия гарантии.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `title` — string — Заголовок страницы или записи.
    - `coverage` — string — Что покрывает гарантия.
    - `duration` — string — Срок гарантии.
    - `starts` — string — Момент начала гарантии.
    - `conditions` — array — Условия применения.
      - `[элемент]` — string — Одно строковое значение массива.
    - `exclusions` — array — Исключения из состава работ.
      - `[элемент]` — string — Одно строковое значение массива.
    - `claimRoute` — string — Путь подачи претензии.
    - `sourceType` — string — Тип источника гарантии. Допустимые значения задаёт схема гарантии.
    - `source` — string — Источник или подтверждение данных.
    - `approval` — string — Сведения об одобрении.
- `maintenance` — object — Условия обслуживания.
  - `scope` — array — Объём обслуживания.
    - `[элемент]` — string — Одно строковое значение массива.
  - `customerResponsibilities` — array — Обязанности клиента.
    - `[элемент]` — string — Одно строковое значение массива.
  - `pricing` — string — Условия оплаты.
  - `requestRoute` — string — Путь запроса обслуживания.
  - `approval` — string — Сведения об одобрении.
- `inquiryHref` — string — Ссылка на форму заявки.

### `json/project-catalog.json`

- `pageSize` — number — Количество элементов на странице.

### `json/project-categories.json`

- `[корень]` — array — Корневой массив записей.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `slug` — string — Уникальный URL-идентификатор.
    - `label` — string — Подпись поля или ссылки.
    - `color` — string — Цвет категории.
    - `textColor` — string — Цвет текста категории.

### `json/projects.json`

- `[корень]` — array — Корневой массив записей.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — number — Стабильный уникальный идентификатор.
    - `category` — string — Категория проекта или услуги.
    - `status` — string — Статус публикации. Допустимые значения: `draft`, `demo`, `published`.
    - `notice` — string — Уведомление для демонстрационного материала.
    - `title` — string — Заголовок страницы или записи.
    - `client` — string — Клиент проекта.
    - `attribution` — string — Тип указания авторства.
    - `description` — string — Описание для страницы, карточки или записи.
    - `evidence` — object — Ссылка на подтверждение.
      - `copy` — null — Одобрение текста.
      - `specifications` — null — Одобрение технических характеристик.
      - `timing` — null — Подтверждение сроков проекта.
      - `outcome` — null — Подтверждение результата проекта.
      - `attribution` — null — Тип указания авторства.
    - `article` — object — Связанная статья.
      - `format` — string — Формат статьи или источника. Допустимые значения: `mdx` или `json`.
      - `entry` — string — Идентификатор записи статьи.

### `json/reviews.json`

- `[корень]` — array — Корневой массив записей.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — number — Стабильный уникальный идентификатор.
    - `name` — string — Название элемента или поля.
    - `position` — string — Должность автора отзыва.
    - `company` — string — Компания автора отзыва.
    - `text` — string — Текст отзыва или блока.
    - `avatar` — string — Аватар автора.
    - `avatarAlt` — string — Альтернативный текст аватара.
    - `avatarWidth` — number — Ширина аватара.
    - `avatarHeight` — number — Высота аватара.

### `json/services.json`

- `heading` — string — Заголовок секции.
- `introduction` — string — Вводный текст секции.
- `copyApproved` — boolean — Признак редакторского одобрения текста.
- `items` — array — Коллекция элементов.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `id` — string — Стабильный уникальный идентификатор.
    - `name` — string — Название элемента или поля.
    - `description` — string — Описание для страницы, карточки или записи.
    - `claimSource` — string — Источник рекламного утверждения.
    - `confirmed` — boolean — Подтверждение услуги.
    - `copyApproved` — boolean — Признак редакторского одобрения текста.
    - `image` — object — Изображение примера.
      - `src` — string — Источник изображения или медиа.
      - `alt` — string — Альтернативный текст изображения.
      - `width` — number — Ширина изображения в пикселях.
      - `height` — number — Высота изображения в пикселях.
      - `source` — string — Источник или подтверждение данных.
      - `projectContext` — string — Контекст проекта для изображения.
      - `publicationPermission` — string — Разрешение на публикацию.
      - `approved` — boolean — Признак одобрения.
      - `desktopFocalPoint` — object — Точка фокусировки для desktop.
        - `x` — number — Горизонтальная координата от 0 до 100.
        - `y` — number — Вертикальная координата от 0 до 100.
      - `mobileFocalPoint` — object — Точка фокусировки для mobile.
        - `x` — number — Горизонтальная координата от 0 до 100.
        - `y` — number — Вертикальная координата от 0 до 100.
    - `href` — string — Ссылка или URL назначения.
    - `article` — object — Связанная статья.
      - `format` — string — Формат статьи или источника. Допустимые значения: `mdx` или `json`.
      - `entry` — string — Идентификатор записи статьи.
- `demoMode` — boolean — Режим демонстрационных данных.
- `demoNotice` — string — Предупреждение о демонстрационном содержимом.

### `json/site.json`

- `title` — string — Заголовок страницы или записи.
- `description` — string — Описание для страницы, карточки или записи.
- `logoText` — string — Текст логотипа.
- `phone` — string — Телефон для связи.
- `email` — string — Email для связи.
- `address` — string — Адрес компании.
- `workHours` — string — Часы работы в будни.
- `workHoursWeekend` — string — Часы работы в выходные.
- `mapEnabled` — boolean — Включает карту.
- `mapFallback` — object — Резервная карта.
  - `src` — string — Источник изображения или медиа.
  - `alt` — string — Альтернативный текст изображения.
  - `width` — number — Ширина изображения в пикселях.
  - `height` — number — Высота изображения в пикселях.
- `mapSrc` — string — Источник карты.
- `menu` — array — Пункты основной навигации.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `label` — string — Подпись поля или ссылки.
    - `href` — string — Ссылка или URL назначения.
- `legal` — array — Ссылки на юридические документы.
  - `[элемент]` — object — Один элемент массива; дочерние поля описаны ниже.
    - `label` — string — Подпись поля или ссылки.
    - `href` — string — Ссылка или URL назначения.
- `footer` — object — Содержимое подвала.
  - `description` — string — Описание для страницы, карточки или записи.
  - `copyright` — string — Текст копирайта.
- `sections` — object — Разделы документа.
  - `about` — object — Заголовки и настройки секции о компании.
    - `title` — string — Заголовок страницы или записи.
  - `projects` — object — Заголовки каталога проектов.
    - `title` — string — Заголовок страницы или записи.
    - `subtitle` — string — Подзаголовок секции.
  - `reviews` — object — Заголовки секции отзывов.
    - `title` — string — Заголовок страницы или записи.
    - `subtitle` — string — Подзаголовок секции.
  - `contacts` — object — Заголовки секции контактов.
    - `panelTitle` — string — Заголовок панели.
    - `title` — string — Заголовок страницы или записи.
    - `subtitle` — string — Подзаголовок секции.

### MDX frontmatter и блоки с комментариями

- `articles/projects/1.mdx`
  - `projectId` — number — положительный идентификатор проекта.
- `articles/services/starter-service.mdx`
  - `title` — string — заголовок услуги.
  - `description` — string — описание услуги.
  - `approved` — boolean — разрешение публикации; в starter-файле `false`.
- Общие поля каждого блока
  - `type` — string — имя зарегистрированного типа блока.
  - `id` — string, optional — уникальный kebab-case идентификатор для ссылок.
  - `status` — enum, optional — `draft`, `demo` или `published`.
  - `provenance` — object, optional — источник и подтверждение.
    - `source` — string — источник содержимого.
    - `rights` — string|null, optional — сведения о правах.
    - `approvedBy` — string|null, optional — проверивший редактор.
    - `approvedAt` — string|null, optional — дата проверки `YYYY-MM-DD`.
- `ParagraphBlock`
  - `heading` — string, optional — заголовок абзаца.
  - `paragraphs` — array[string] — один или несколько абзацев.
- `OrderedListBlock` / `UnorderedListBlock`
  - `heading` — string, optional — заголовок списка.
  - `items` — array[string] — элементы списка в заданном порядке.
- `TableBlock`
  - `title` — string, optional — заголовок таблицы.
  - `caption` — string, optional — пояснение таблицы.
  - `columns` — array[object] — колонки; каждая имеет `key` и `label`.
  - `rows` — array[object] — строки; каждая имеет `cells`, по одной ячейке на колонку.
- `ChartBlock`
  - `title`, `caption`, `unit` — string, optional — подписи графика.
  - `chartType` — enum — `bar`, `line` или `pie`.
  - `series` — array[object] — серии с `name` и массивом точек `{label, value}`.
- `ImageBlock`
  - `src` — string — root-relative или HTTP(S) источник изображения.
  - `alt` — string — альтернативный текст.
  - `width`, `height` — number — положительные размеры в пикселях.
  - `caption` — string, optional — подпись изображения.
  - `kind` — enum, optional — `demo` или `installation`.
  - `cropGuidance` — string, optional — рекомендация кадрирования.
  - `focalPoint`, `mobileFocalPoint` — object, optional — `{x, y}` от 0 до 100.
- `ImageGalleryBlock`
  - `caption` — string, optional — подпись галереи.
  - `images` — array[object] — изображения с полями `src`, `alt`, `width`, `height` и медиа-метаданными.
- `OrderFormBlock`
  - `formId` — string — идентификатор зарегистрированной формы.
  - `context` — enum — `project` или `service`.
  - `category` — string, optional — категория, согласованная с контекстом.
- `QuoteBlock`
  - `text` — string — текст цитаты.
  - `author`, `source` — string, optional — автор и источник цитаты.
- `FootnoteBlock`
  - `text` — string — текст примечания.
  - `reference` — string, optional — подпись источника.
  - `targetId` — string — id блока, к которому относится примечание.
