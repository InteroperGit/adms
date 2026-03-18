import type { ReactNode } from 'react';

interface FooterSectionProps {
  title: string;
  children: ReactNode;
  spacing?: 'space-y-3' | 'space-y-4';
}

/**
 * @component
 * @description Reusable footer column section with title and list items. Provides consistent styling across all footer sections.
 * @param {FooterSectionProps} props
 * @param {string} props.title - Section title
 * @param {ReactNode} props.children - List items to render
 * @param {'space-y-3'|'space-y-4'} [props.spacing='space-y-3'] - Vertical spacing between items
 * @returns {JSX.Element} Column with title and list items
 * @example <caption>Footer section with items</caption>
 * <FooterSection title="Services">
 *   <li><a href="#services">Service 1</a></li>
 * </FooterSection>
 */
export function FooterSection({ title, children, spacing = 'space-y-3' }: FooterSectionProps) {
  return (
    <div>
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent">{title}</p>
      <ul className={spacing}>{children}</ul>
    </div>
  );
}
