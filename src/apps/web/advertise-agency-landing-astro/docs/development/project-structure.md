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
|   |-- content/              # Typed JSON exports and project/review schemas
|   |-- layouts/              # Shared page and legal document layouts
|   |-- pages/                # Homepage, projects/[id].astro, legal pages
|   |-- styles/               # Tailwind/DaisyUI configuration and scrollbar styles
|   `-- types/                # Shared types and schema-derived content types
|-- docs/codex/               # Plans, pending tasks, and completed tasks
|-- astro.config.mjs          # Static output and Tailwind Vite plugin
|-- package.json
`-- pnpm-lock.yaml
```

Use `data/content/site.json` for the displayed agency name (`logoText`), site title and description, contact information, navigation, section headings, and footer description/copyright. The header, footer, and page metadata share that configuration. The footer year is generated at build time; rebuild when it needs to change. Keep approved legal copy in its legal JSON documents rather than substituting brand names programmatically.
