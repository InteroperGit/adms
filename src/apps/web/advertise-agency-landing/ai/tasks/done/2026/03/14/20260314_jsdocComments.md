✅ COMPLETED — Batch 5 (sections/ components)

Added detailed JSDoc comments to 27 React components in sections/ folders.

## Batch 5 Components Documented

- **sections/contact/** (9): ContactConsent, ContactForm, ContactFormFields, ContactHours, ContactInfo, ContactItem, ContactMap, ContactSuccess, index
- **sections/footer/** (6): FooterBottom, FooterBrand, FooterContact, FooterNav, FooterServices, index
- **sections/services/** (2): ServiceCard, index
- **sections/testimonials/** (3): TestimonialsEmpty, YandexReviews, index
- **sections/portfolio/** (2): PortfolioFilter, index
- **sections/call-to-action/** (2): CtaButtons, index

All changes formatted, typecheck passed, lint passed.

---

## Original Task Instructions

Your task is to add detailed JSDoc comments to all *.ts and *.tsx files
inside the ./src directory.

## Comment Requirements

### React Components (*.tsx)
- @component — required for every component
- @description — detailed explanation: what the component does, when and why to use it
- @param {ComponentProps} props — document the props object as a whole
- Each prop via @param {type} props.name — description
- @returns {JSX.Element} — describe what the component renders
- @example — at least 1–2 real usage examples with JSX markup,
  each with a <caption> tag for context

Example for a component:
/**
* A button with multiple style variants and a loading state.
* Used across all forms and interactive sections of the application.
*
* @component
* @param {ButtonProps} props
* @param {string} props.label - Button text
* @param {'primary' | 'secondary' | 'danger'} [props.variant='primary'] - Visual style
* @param {boolean} [props.isLoading=false] - Shows a spinner and disables click
* @param {() => void} props.onClick - Click handler
* @returns {JSX.Element}
*
* @example <caption>Basic usage</caption>
* <Button label="Save" onClick={handleSave} />
*
* @example <caption>Button in loading state</caption>
* <Button label="Submitting..." variant="primary" isLoading={true} onClick={() => {}} />
  */

### Hooks (use*.ts / use*.tsx)
- @description — detailed explanation of the hook's behavior and use case
- @param — all hook parameters with types
- @returns — full description of the returned value or object,
  including nested fields
- @example — a working usage example inside a component

### Utilities and Helper Functions (*.ts)
- @description — what the function does, the algorithm used,
  and any side effects
- @param {type} name — each argument with type and description
- @returns {type} — the type and meaning of the return value
- @throws — if the function can throw, describe when and what
- @example — 1–2 call examples with concrete input and output values

### Types and Interfaces (*.ts)
- A block comment above each interface / type declaration with @description
- Each field annotated with an inline /** description */ comment

### Classes (*.ts)
- Block comment above the class: @description, @example
- Block comment above each public method: @param, @returns, @example
- Block comment above constructor: @param for each argument

## General Rules

1. Write all descriptions and examples in **English**
2. Do not duplicate what the type already expresses — avoid writing
   "accepts a string" when the type is already string
3. Do not modify any logic or code — only add JSDoc blocks
4. If a comment already exists — extend it to the full format,
   do not remove existing content
5. For generics, use @template T with a description of the parameter's purpose
6. Prioritize exported entities — document them first

## Execution Order

1. Recursively traverse all files in ./src matching the glob: **/*.{ts,tsx}
2. For each file, identify the type of entity it contains
   (component, hook, utility, type, class)
3. Add JSDoc comments according to the rules above
4. Verify that each file remains syntactically valid — do not break compilation
5. Skip *.test.ts, *.spec.ts, and *.stories.tsx files — they are out of scope

Before making any changes, scan the ./src directory and output
the full list of files you are going to process.
