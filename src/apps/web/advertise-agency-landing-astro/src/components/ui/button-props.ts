import type { HTMLAttributes } from "astro/types";

// Keep shared styling options available on links and buttons.
type StyleProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  class?: string;
};

// Links use anchor attributes and do not accept button type values.
type AnchorProps = Omit<HTMLAttributes<"a">, "class" | "href" | "type"> &
  StyleProps & {
    href: string;
    type?: never;
  };

// Buttons retain native type values and form-related attributes.
type NativeButtonProps = Omit<HTMLAttributes<"button">, "class" | "type"> &
  StyleProps & {
    href?: never;
    type?: HTMLAttributes<"button">["type"];
  };

// The href property selects which native element callers may configure.
export type ButtonProps = AnchorProps | NativeButtonProps;
