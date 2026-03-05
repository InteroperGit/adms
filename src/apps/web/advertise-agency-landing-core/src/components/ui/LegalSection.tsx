interface LegalSectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="mb-8">
      <h2 className="text-xl font-semibold mb-3 text-gray-900">{title}</h2>
      <div className="space-y-2 text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}
