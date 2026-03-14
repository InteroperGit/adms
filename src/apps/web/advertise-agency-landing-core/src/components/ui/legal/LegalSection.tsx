interface LegalSectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}

/**
 * @component
 * @description Semantic section container for legal document parts with optional anchor id
 * @param {LegalSectionProps} props
 * @param {string} [props.id] - Optional section id for anchor links
 * @param {string} props.title - Section heading
 * @param {React.ReactNode} props.children - Section content
 * @returns {JSX.Element} Section with h2 title and content wrapper
 * @example
 * <LegalSection id="definitions" title="Definitions">
 *   <p>Term definitions here</p>
 * </LegalSection>
 */
export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="mb-8">
      <h2 className="mb-3 text-xl font-semibold text-foreground">{title}</h2>
      <div className="space-y-2 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
