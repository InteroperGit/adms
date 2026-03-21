import type { ReactNode } from 'react';

interface FooterSectionProps {
  title: string;
  children: ReactNode;
  spacing?: string;
}

/** Shared link styles for all footer columns. */
export const footerLinkCls =
  'text-sm underline text-white/60 underline-offset-4 decoration-white/60 transition-colors hover:text-primary hover:decoration-primary focus-ring';

/**
 * @component
 * @description Reusable footer column section with title and list items. Provides consistent styling across all footer sections.
 * @param {FooterSectionProps} props
 * @param {string} props.title - Section title
 * @param {ReactNode} props.children - List items to render
 * @param {string} [props.spacing='space-y-3'] - Tailwind spacing class between items
 * @returns {JSX.Element} Column with title and list items
 * @example <caption>Footer section with items</caption>
 * <FooterSection title="Services">
 *   <li><a href="#services">Service 1</a></li>
 * </FooterSection>
 */
export function FooterSection({ title, children, spacing = 'space-y-3' }: FooterSectionProps) {
  return (
    <div>
      <p className="mb-6 text-sm font-bold uppercase tracking-wider text-accent/90">{title}</p>
      <ul className={spacing}>{children}</ul>
    </div>
  );
}
