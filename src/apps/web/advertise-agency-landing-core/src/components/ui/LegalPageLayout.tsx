interface LegalPageLayoutProps {
  title: string;
  version: string;
  effectiveDate: string;
  children: React.ReactNode;
}

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
