# 007 — OrderFormBlock (configurable order forms)

## Status: ✅ done

## Context

Add a 15th block type `order-form` to the portfolio block system. Renders JSON-configurable product order forms (light letters, street signs, lightboxes). Also available as a standalone `/order` page. No backend — submission shows success state only.

## Data Layer

- `data/config/orderForms.json` — form definitions: product types with dynamic fields, customer fields, consent, success messages
- `data/_schema/orderForms.example.json` — git-tracked schema example
- `src/types/config/orderForms.ts` — TypeScript interfaces + `orderFormsData` const

### JSON structure

```jsonc
{
  "forms": {
    "<formId>": {
      "title": "string",
      "description?": "string",
      "icon?": "ICON_MAP key",
      "productTypes": [{
        "key": "string", "label": "string", "icon?": "string",
        "fields": [{ "key", "type": "text|number|select|checkbox|textarea|radio", "label", "placeholder?", "required?", "options?", "min?", "max?" }]
      }],
      "customerFields": [/* same FormFieldDefinition shape */],
      "consent": { "text", "links": [{ "label", "href" }], "joiner" },
      "submit": "string",
      "disclaimer?": "string",
      "success": { "title", "text", "reset" }
    }
  },
  "page": { "label", "title", "description", "defaultFormId" }
}
```

## Block Type

- Add `OrderFormBlock` interface (`__component: 'order-form'`, `formId`, `title?`, `color?`) to `src/types/portfolio/blocks.ts`
- Add `'order-form'` case to `BlockRenderer.tsx`

## Components — `src/components/ui/orderForm/`

| File | Role |
|------|------|
| `OrderFormField.tsx` | Single field: switch on type → Input/Textarea/select/checkbox/radio |
| `OrderFormDynamicFields.tsx` | Maps fields[] → OrderFormField |
| `OrderFormCustomerFields.tsx` | Separator + customer fields |
| `OrderFormConsent.tsx` | Consent checkbox + legal links |
| `OrderFormSuccess.tsx` | Success panel (icon + title + reset) |
| `OrderFormProductTabs.tsx` | Product type tab selector |
| `index.tsx` | Orchestrator: state, tab switch, submit, renders sub-components |

## Block wrapper

- `src/components/portfolio/blocks/OrderFormBlock.tsx` — looks up form by `formId`, renders `<OrderForm>`

## Standalone page

- `src/pages/OrderPage.tsx` — reads `?form=` param, SectionHeader + OrderForm
- `src/router.tsx` — add `/order` route

## Implementation order

1. Schema example → 2. Data JSON (3 products) → 3. Type module → 4. Icon map updates → 5–11. UI components → 12–14. Block integration → 15–16. Page + route → 17. Checks → 18. Docs
