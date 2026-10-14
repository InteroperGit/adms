# VCB-11 — VideoBlock renderer and fallback

Date: 2026-10-15. Status: fixed. Completed: 2026-10-15.

Added VideoBlock.astro and wired it into the JSON and MDX block mappings.
The renderer emits native video controls with preload metadata, poster, MIME
type, intrinsic aspect ratio, accessible label, caption, transcript
disclosure, and a native unsupported-source link. A small error listener adds
a readable failed-source status while preserving the reserved frame. The
markup remains a single article-flow media group and works without JavaScript.

Verification: the changed Astro component passes type diagnostics; the style
checker passes after the 80-column audit.
