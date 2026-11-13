# Design and accessibility

Use the established design system and shared primitives before adding new visual
patterns. Keep reusable tokens and foundations in shared styles, and keep
component-specific layout and states scoped. Preserve the existing cascade and
semantic aliases; inspect their source before changing shared values. Avoid
parallel copies of palettes, focus recipes or theme fallbacks. A visual change
to a shared token needs review across its consumers and both themes.

## Responsive and readable interfaces

Let content determine height. Support long and unbroken text, narrow and short
viewports, enlarged text and browser zoom without clipping controls or hiding
information. Use readable measures and consistent spacing; avoid truncation
unless users can reach the full content. Reserve media geometry to limit layout
movement and preserve usable content when images fail.

Use semantic headings, lists, links, buttons, labels and native form controls.
Keep heading hierarchy meaningful and repeated actions distinguishable by their
accessible names. Do not invent ratings, endorsements or visual proof.
Decorative images need empty alt text; informative images need useful
alternatives. Do not encode necessary information only in color, an icon, motion
or an image.

## Interaction and focus

Keep keyboard behavior native where possible. Every interactive element needs a
44px minimum hit target, visible focus and an accessible name. Hover, selected,
disabled and focus states must remain distinguishable; selection must not hide
focus. Do not capture document-wide keys for a local interaction.

Use modal semantics and focus containment only for actual modal interactions.
Provide a keyboard dismissal path and restore focus appropriately. Nonmodal
panels must not trap focus. Hidden or inactive content must leave keyboard order
and the accessibility tree. Outside-pointer dismissal must not cancel the user's
intended action. Fixed overlays must not prevent reaching underlying controls or
the end of the page. Preserve scroll and focus when changing appearance.

## Themes, motion and enhancement

Use semantic theme colors rather than ad hoc overrides. Check text, controls,
selection, focus and hover against their actual rendered backgrounds, including
images and translucent layers. Meet WCAG AA contrast: 4.5:1 for normal text and
3:1 for large text and essential nontext controls. Decorative boundaries are not
a substitute for identifiable controls. External media may not follow themes.

Respect reduced motion and avoid automatic updates that replace focused content.
Automatic changes must not move focus or flood live announcements. Pause moving
content when interaction or visibility makes continued updates inappropriate.
Keep essential content and native navigation usable before enhancement, without
JavaScript and when optional resources fail. Clean up timers, listeners and
observers when components disconnect; reconnect without duplicate handlers.

## Review changes

Check both themes, keyboard navigation, focus order, touch-sized targets, narrow
and short layouts, long content, enlarged text and actual browser zoom. Test
reduced motion, no JavaScript, failed media and blocked external assets when
they affect the change. Text enlargement or device scale does not prove browser
zoom; an accessibility-tree check does not prove screen-reader speech. Report
only the coverage actually performed. See [verification](verification.md) for
checks and [content](content.md) for publication and media requirements.
