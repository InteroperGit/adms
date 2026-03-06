import { BackButton } from '@/components/ui/BackButton.tsx';

interface LegalPageLayoutProps {
  title: string;
  version: string;
  effectiveDate: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, version, effectiveDate, children }: LegalPageLayoutProps) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <BackButton />

      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-gray-500 mb-10">Дата вступления в силу: {effectiveDate}</p>

      {children}

      <p className="text-sm text-gray-500 mt-10 pt-6 border-t border-gray-200">
        Версия {version} · Дата последнего обновления: {effectiveDate}
      </p>
    </main>
  );
}
