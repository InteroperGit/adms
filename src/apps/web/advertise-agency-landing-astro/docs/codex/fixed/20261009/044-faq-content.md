# Prepare FAQ content

**Status:** Implementation completed; agency publication approval pending

**Priority:** Priority 2

**Created:** 2026-10-09

**Depends on:**
Approved pricing factors, production and installation terms, design-file
requirements, repair and maintenance scope, and the existing inquiry form.

## Goal

Prepare a reusable, customer-facing FAQ for the homepage. It should answer
common objections before a visitor sends an inquiry. The copy is written for
people, not for a Google FAQ rich-result assumption.

## Reusable draft copy

**Task note:** Write and preserve complete, reusable customer-facing text,
not placeholders or instructions to the reader. The nine answers below are
the proposed future copy. Confirm agency responsibilities before publication;
do not invent prices, deadlines, accepted formats, or warranty periods.

### Сколько стоит вывеска или другая конструкция?

Стоимость зависит от размера, конструкции, материалов, подсветки, сложности
макета, способа монтажа и условий на объекте. Пришлите адрес, примерные
размеры и фото места установки. Мы уточним состав работ и подготовим расчёт.
Точную сумму называем после проверки исходных данных.

### Сколько времени занимает изготовление и монтаж?

Срок зависит от выбранного решения, материалов, согласования макета и
готовности объекта. После уточнения задачи мы сообщим плановые сроки
производства и монтажа. Если конструкция нужна к определённой дате, укажите
её в заявке: возможность выполнения заказа к этому сроку проверим отдельно.

### Какие файлы нужны для расчёта и макета?

Для первого расчёта достаточно описания задачи, примерных размеров, адреса и
фотографий места. Если у вас есть логотип или готовые материалы, приложите их
в исходном качестве. Если исходников нет, пришлите то, что есть: мы уточним,
какие материалы можно использовать и что потребуется подготовить заново.
Состав и стоимость подготовки макета согласуются отдельно.

### Кто делает замеры и проверяет место установки?

До запуска в производство нужно подтвердить размеры, основание, точки
крепления, доступ и другие ограничения объекта. Кто выполняет замеры и нужен
ли выезд, согласуем после знакомства с задачей. В заявке укажите адрес и
контакт ответственного за доступ, чтобы можно было определить следующий шаг.

### Кто согласовывает дизайн и сколько правок входит в работу?

Мы готовим макет по согласованному заданию, а заказчик проверяет тексты,
логотип, размеры, цвета и размещение. В производство передаём только
подтверждённый вариант. Количество включённых правок и стоимость подготовки
макета согласуем до начала работы. Изменения после утверждения могут повлиять
на стоимость и срок заказа; их нужно согласовать до продолжения работ.

### Нужно ли мне самостоятельно оформлять разрешения на установку?

Порядок согласования зависит от адреса, типа конструкции и правил объекта.
При обсуждении заказа отдельно определим, какие согласования нужно уточнить
и кто отвечает за их получение. Состав этих работ и ответственность сторон
фиксируются до запуска заказа. Установка планируется с учётом необходимых
согласований и доступа к объекту.

### Вы выполняете монтаж и что должен подготовить заказчик?

Состав монтажа согласовывается до выезда. Заказчику обычно нужно обеспечить
доступ к объекту, контакт ответственного лица и соблюдение правил площадки.
Требования к электропитанию, подъезду, высоте и времени работ зависят от
объекта; их нужно подтвердить до даты монтажа.

### Что делать, если конструкция повредилась или перестала работать?

Напишите нам и приложите фото, адрес объекта, описание проблемы и дату
установки. Мы определим, относится ли случай к гарантийному обращению, и
обсудим дальнейшие действия. Гарантийные условия конкретного заказа указаны
в его документах. До проверки причины неисправности нельзя определить,
входит ли устранение проблемы в гарантию или оплачивается отдельно.

### Есть ли обслуживание и можно ли заказать ремонт отдельно?

Возможность обслуживания зависит от конструкции и причины неисправности.
Пришлите фото, описание проблемы и сведения о конструкции, даже если её
изготовила другая компания. Мы уточним возможность выполнения работ и
необходимость осмотра. Состав обслуживания, стоимость выезда и ремонта
согласуются отдельно; они не включены в первоначальный заказ автоматически.

## Agency approval checklist

- Confirm quotation, design preparation, revision handling, measurements,
  installation, permissions, warranty handling, and repair availability.
- Confirm whether third-party constructions can be assessed and repaired.
- Add exact formats, lead times, or warranty terms only when verified and
  useful; the draft deliberately contains no invented numerical promises.
- Confirm which answers apply to each service; remove answers that do not.
- Confirm the inquiry route and whether attachments can be received safely.
- Approve the final Russian wording, punctuation, and terminology.
- Record the approver and source in the content contract before publication.

## Handoff

Prepare `data/content/faq.json` with a typed model, strict Zod validation, and
a parsed loader following existing `src/types`, `src/validation`, and
`src/content` patterns. Include stable unique IDs, question/answer text,
section heading, inquiry link, and explicit approval state and source. Keep
draft copy separate from publication eligibility. Record the final contract
paths for Task 045. Run relevant content/schema checks when implementing it.

Store the approved answers in the typed content contract consumed by Task 045.
Keep this task as the reusable copy note for future service pages and sales
materials. Service-specific FAQ variants may reuse the questions, but their
answers must be checked against the relevant service terms.

## Implementation and verification

Completed 2026-10-09. All nine draft questions and complete answers are in
`data/content/faq.json`. Answer source lines are joined into a single string
by `src/validation/faq.ts`; `src/types/faq.ts` defines the parsed contract.
`src/content/faq.ts` exposes the validated draft for reuse.

Task 045 must call `getPublishedFaqItems` from
`src/content/faq-publication.ts` and omit the section for an empty result.
Section copy and each answer have independent approval records. Approved
records require a nonblank source and named approver; all supplied records
remain drafts with no claimed approval. The helper currently returns no
publishable answers. The inquiry link is fixed to `/#order-inquiry`.

Strict validation rejects unknown fields, invalid/duplicate stable IDs,
blank copy, empty answers, invalid inquiry destinations, and approval
without evidence. `node scripts/verify-faq.mjs` checks these boundaries,
the parsed loader, selective publication, and exact draft-copy preservation.
`pnpm check`, `pnpm build`, and `pnpm verify:content` pass; check reports one
existing unused-variable hint in an ignored browser helper. Homepage UI and
browser verification remain Tasks 045 and 046. Agency terms, final wording,
and attachment/inquiry delivery confirmation remain pending.
