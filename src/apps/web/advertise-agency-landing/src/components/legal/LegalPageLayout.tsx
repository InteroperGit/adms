interface LegalPageLayoutProps {
  title: string;
  version: string;
  effectiveDate: string;
  children: React.ReactNode;
}

/**
 * @component
 * @description Wrapper layout for legal pages (privacy policy, user agreement, consent) with header and footer metadata
 * @param {LegalPageLayoutProps} props
 * @param {string} props.title - Document title
 * @param {string} props.version - Version number
 * @param {string} props.effectiveDate - Effective date in human-readable format
 * @param {React.ReactNode} props.children - Page content
 * @returns {JSX.Element} Main element with title, version metadata and content
 * @example
 * <LegalPageLayout title="Privacy Policy" version="1.0" effectiveDate="2024-01-01">
 *   <LegalBlockRenderer content={content} company={company} />
 * </LegalPageLayout>
 */
export function LegalPageLayout({ title, version, effectiveDate, children }: LegalPageLayoutProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-foreground">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="mb-10 text-sm text-muted-foreground">Дата вступления в силу: {effectiveDate}</p>

      {children}

      <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
        Версия {version} · Дата последнего обновления: {effectiveDate}
      </p>
    </main>
  );
}
