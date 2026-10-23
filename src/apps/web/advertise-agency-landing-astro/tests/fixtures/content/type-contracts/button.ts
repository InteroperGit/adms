import type { ButtonProps } from "@/components/ui/button-props";

export const linkProps = {
  href: "/contact",
  class: "contract-link",
  target: "_blank",
  rel: "noopener",
  tabindex: 0,
  "aria-label": "Contact",
  "data-action": "contact",
} satisfies ButtonProps;

export const nativeButtonProps = {
  type: "submit",
  disabled: true,
  form: "inquiry-form",
  name: "intent",
  value: "send",
  tabindex: 0,
  "aria-pressed": "false",
} satisfies ButtonProps;

export const invalidButtonType = {
  // @ts-expect-error Button type accepts only native button values.
  type: "primary",
} satisfies ButtonProps;

export const invalidLinkType = {
  href: "/contact",
  // @ts-expect-error Links do not accept button type values.
  type: "submit",
} satisfies ButtonProps;

export const invalidLinkAttribute = {
  href: "/contact",
  // @ts-expect-error Anchors do not accept button-only attributes.
  disabled: true,
} satisfies ButtonProps;

export const misspelledAttribute = {
  // @ts-expect-error Native attributes reject misspelled names.
  lable: "Contact",
} satisfies ButtonProps;
