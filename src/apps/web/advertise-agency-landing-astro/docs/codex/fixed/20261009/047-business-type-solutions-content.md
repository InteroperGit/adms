# Prepare solutions by business type content

**Status:** Completed

**Priority:** Priority 3

**Created:** 2026-10-09

**Depends on:** Existing services, projects, and inquiry content.

## Goal

Prepare complete customer-facing copy for shops, cafés, salons, and offices.
Use the Russian texts below as the content baseline, ready for reuse with real
customer names and relevant project material.

## Content requirements

- Preserve finished copy rather than substituting writing instructions.
- Do not add visible fake, draft, demo, test, or preliminary-content labels.
- Describe solutions directly, without invented customer endorsements,
  completed installations, revenue increases, prices, or delivery promises.
- Keep customer attribution separate from reusable solution descriptions. Add a
  real customer name only to the matching project attribution.
- Link actual relevant projects when available. Generic solutions do not
  establish completed customer work.
- Use relevant photographs with publication rights. Never present unrelated
  stock or generated media as a customer's project.
- Missing attribution must not block generic solution text.

## Complete section copy

**Heading:** Решения для вашего бизнеса

**Introduction:** Оформление помогает посетителю заметить вход, узнать
название и найти нужное место. Выберите свой тип бизнеса: подскажем, какие
конструкции подходят для фасада, витрин и интерьера.

### Магазины

**Summary:** Вывеска, оформление витрин и указатели для понятного входа в
магазин.

**Customer task:** Покупателю нужно быстро прочитать название, понять, что
продаётся в магазине, и найти вход со стороны улицы или парковки.

**Solution:** Для названия на фасаде подойдут световые буквы или световой
короб. На витрине можно разместить основные категории товаров и режим работы,
сохранив обзор торгового зала. Если вход находится сбоку здания, указатель
поможет обозначить направление. Размер надписей и вариант подсветки выбираем
с учётом расстояния, фона фасада и соседних вывесок.

**Example title:** Вывеска и витрина магазина

**Example text:** Название занимает основное место над входом. На стекле —
короткая информация об ассортименте и графике работы. Указатель со стороны
парковки дополняет оформление, когда дверь не видна с основного подхода. Все
eлементы объединены цветами и шрифтом, чтобы магазин было легко узнать с
разных сторон.

**Inquiry label:** Обсудить оформление магазина

### Кафе и рестораны

**Summary:** Фасадная вывеска, режим работы и интерьерный акцент в стиле
заведения.

**Customer task:** Гостю важно узнать заведение с улицы, найти вход и увидеть
информацию о работе кафе. Внутри оформление должно поддерживать характер
пространства.

**Solution:** Световые буквы подойдут для названия на фасаде, а неоновая
надпись — для акцента в интерьере. Режим работы разместим у двери, где его
удобно прочитать. Если вход расположен во дворе или за углом, добавим
указатель. Цвет и яркость подсветки подбираем с учётом отделки, окружающего
освещения и места установки.

**Example title:** Оформление входа и интерьера кафе

**Example text:** На фасаде — читаемое название с подсветкой, на входной двери
— график работы. Внутри неоновая надпись дополняет оформление стены и видна из
гостевой зоны. Уличная вывеска и интерьерный элемент используют общие цвета,
а информация у входа остаётся короткой и понятной.

**Inquiry label:** Обсудить оформление кафе

### Салоны красоты

**Summary:** Название на фасаде, оформление входа и логотип в зоне встречи
клиентов.

**Customer task:** Клиенту нужно найти салон по адресу и отличить его вход от
соседних помещений. Оформление снаружи и внутри должно выглядеть согласованно.

**Solution:** Для фасада подойдут объёмные буквы с подсветкой или без неё. На
двери можно разместить режим работы и краткий перечень основных услуг. Логотип
в зоне ресепшен продолжит оформление внутри. При выборе материалов учитываем
цвет стен, расстояние до посетителя и освещение, чтобы название оставалось
читаемым.

**Example title:** Оформление салона от фасада до ресепшен

**Example text:** Над входом — название салона, на двери — основные услуги и
часы работы. В зоне ресепшен объёмный логотип повторяет шрифт и цвет фасадной
вывески. Витрина сохраняет свободное пространство: информация не закрывает
весь обзор и не конкурирует с названием.

**Inquiry label:** Обсудить оформление салона

### Офисы

**Summary:** Вывеска у входа, логотип в приёмной и навигация по помещениям.

**Customer task:** Посетителю нужно найти компанию в здании, выбрать нужный
этаж и кабинет, а при входе убедиться, что он пришёл по правильному адресу.

**Solution:** У входа подойдёт вывеска или табличка с названием компании. В
приёмной можно разместить объёмный логотип, а на этажах — указатели и
обозначения кабинетов. Для навигации используем единый шрифт, понятные
названия и контрастный текст. Формат и крепление подбираем с учётом
поверхностей и правил здания.

**Example title:** Оформление офиса и внутренняя навигация

**Example text:** Название компании размещено у входа, логотип — за стойкой
приёмной. Указатели ведут к переговорной и рабочим помещениям, таблички
обозначают кабинеты. Единое оформление связывает элементы между собой, а
короткие надписи помогают посетителю ориентироваться без лишних вопросов.

**Inquiry label:** Обсудить оформление офиса

## Implementation scope

- Add typed content, validation, and a loader using existing conventions.
- Store stable IDs, copy, inquiry labels, and optional project/media metadata.
- Use `/#order-inquiry`; validate unique IDs and internal destinations.
- Keep evidence and photo rights in internal metadata, outside visible copy.
- Document replacement of customer attribution without rewriting generic copy.

## Acceptance

- All four categories have full Russian copy and distinct examples.
- No customer name, completed-work claim, or measured outcome is invented.
- Content renders without optional project material.
- Customer names can be updated independently of reusable copy.
- Hand off final fields and media to Task 048.

## Completion record

Completed 2026-10-09. Added the validated content source at
`data/content/business-solutions.json`, typed content in
`src/types/business-solutions.ts`, the Zod contract in
`src/validation/business-solutions.ts`, and the loader in
`src/content/business-solutions.ts`.

The source contains four reusable Russian business-type solutions with optional
customer attribution and media metadata. Attribution is empty until a real
customer project, evidence source, and publication rights are supplied. Copy
lines are joined by the validation contract while remaining within the
repository's 80-character source-line rule.

Validation requires four unique IDs, fixed inquiry destinations, positive
media dimensions, evidence for named customers, and internal project-link
format. `pnpm check`, `pnpm build`, and
`node scripts/verify-content-invariants.mjs` passed. Build output contains the
existing Task 018 unused-variable hint only.
