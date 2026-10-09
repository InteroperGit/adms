# Reveal sections when they enter the viewport

**Status:** Completed

**Completed:** 2026-10-10

**Created:** 2026-10-10

## Goal

Dynamically reveal homepage sections as they enter the viewport, using a
subtle transition while preserving accessible, server-rendered content.

## Scope

- Use a shared IntersectionObserver for top-level homepage sections,
  including Section.astro instances and custom section wrappers.
- Reveal each section once and keep it visible after it leaves the viewport.
- Keep sections already in view visible on initial load; avoid content flash.
- Preserve section dimensions, background bands, anchor navigation and SEO.
- Keep content visible without JavaScript or IntersectionObserver support.
- Respect reduced motion, including preference changes during the session.
- Reveal content immediately when keyboard focus or an anchor targets it.
- Keep browser code minimal and release observers after sections reveal.
- Avoid changing nested sections, legal pages and service/project articles.

## Acceptance

- Scrolling on desktop and mobile reveals every rendered homepage section.
- Tall sections reveal reliably without requiring a large visible fraction.
- Revealed sections remain visible when scrolling back up.
- Initial viewport content and direct hash targets display without delay.
- Keyboard users never focus invisible controls or encounter hidden content.
- No-JavaScript, unsupported-browser and reduced-motion paths remain usable.
- Reveals cause no layout shifts or interference with carousels and forms.
- Both themes and responsive layouts retain their existing appearance.

## Verification

- Run pnpm check and pnpm build, recording any pre-existing failures.
- Use browser checks at desktop and mobile sizes for initial load, scrolling,
  hash navigation, keyboard focus, no JavaScript and reduced motion.
- Record screenshots, browser errors and verification evidence in this task.

## Execution notes

Read project rules and apply the astro-best-practices skill before changes.
Follow the 80-column code limit and document initialization and fallbacks.
Move this task to fixed only after implementation and acceptance checks.

## Implementation and review

- Implemented by implement_067 in src/pages/index.astro only.
- A shared observer targets direct homepage sections and reveals each once.
- Opacity affects children, preserving background bands and section geometry.
- Initial viewport, focus and fragment targets bypass the fade immediately.
- Reduced-motion changes reveal pending content and clean up browser hooks.
- No JavaScript or observer support leaves server-rendered content visible.
- review_067 found a P2 focus/fragment timing issue during active fades.
  The implementation agent fixed it; a second review found no further issues.
- Existing user edits were preserved. No commit or deployment performed.

## Verification evidence

- pnpm check: passed; existing unused-variable hint in task-018/matrix.js.
- pnpm build: passed, 11 pages. Git diff whitespace check passed.
- 27 browser assertions passed at 1440x800 and 375x800: initial viewport,
  offscreen waiting, tall final section, geometry, persistent reveal, direct
  hashes, focus, reduced-motion changes and initial reduced-motion fallback.
- Focus during a revealed state cancels transition; both themes retain full
  visibility. Service pages, no JavaScript and no observer support passed.
- No page JavaScript errors recorded.
- Script: output/playwright/task-067/verify.js.
- Screenshot: output/playwright/task-067/mobile.png.
- Full-load navigation timed out during a verification attempt. Successful
  checks wait for DOM readiness; remote asset loading was outside this task.
- .codex/TASKS.md remains unchanged because its protected reparse point
  prevents sandbox writes, as established during task creation.
