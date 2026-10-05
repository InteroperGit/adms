# Application structure

[Documentation index](../../README.md)

```text
.
|-- data/content/             # JSON content and settings; legal/ holds legal documents
|-- public/                   # Files copied directly to the build, including favicons
|-- src/
|   |-- components/           # Header, footer, cookie banner
|   |   |-- cards/            # Project and review cards
|   |   |-- sections/         # Homepage sections
|   |   `-- ui/               # Shared controls, navigation, mobile dialog
|   |-- content/              # Validated JSON exports and settings
|   |-- layouts/              # Shared page and legal document layouts
|   |-- pages/                # Homepage, projects/[id].astro, legal pages
|   |-- validation/           # Modular executable schemas, shared helpers and source-aware parser
|   |-- styles/               # Tailwind/DaisyUI configuration and scrollbar styles
|   `-- types/                # Plain shared domain contracts
|-- docs/codex/               # Plans, pending tasks, and completed tasks
|-- astro.config.mjs          # Static output and Tailwind Vite plugin
|-- package.json
`-- pnpm-lock.yaml
```

Use `data/content/site.json` for the displayed agency name (`logoText`), site title and description, contact information, navigation, section headings, and footer description/copyright. The header, footer, and page metadata share that configuration. The footer year is generated at build time; rebuild when it needs to change. Keep approved legal copy in its legal JSON documents rather than substituting brand names programmatically.

Domain contracts in `src/types/` remain independent of runtime validation. Validators in `src/validation/` import contracts only as types and check item/aggregate output compatibility. Content wrappers import JSON and validators; components consume wrappers and `@/types`. See [content ownership and field changes](../site/content.md#changing-a-domain-field). Validation belongs to server/build imports, never client scripts.
