import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BreadCrumbs } from '@/components/ui/BreadCrumbs';
import { OrderForm } from '@/components/ui/orderForm';
import { orderFormsData } from '@/types/config/orderForms';
import { resolveIcon } from '@/types/shared/iconMap';
import { cn } from '@/lib/utils';

const formEntries = Object.entries(orderFormsData.forms);

export function OrderPage() {
  const p = orderFormsData.page;
  const [searchParams, setSearchParams] = useSearchParams();
  const formId = searchParams.get('form') ?? p.defaultFormId;
  const definition = orderFormsData.forms[formId] ?? Object.values(orderFormsData.forms)[0];

  useEffect(() => {
    document.title = `${p.title} — РА «Рекламастер»`;
  }, [p.title]);

  return (
    <>
      <BreadCrumbs items={[{ label: 'Главная', href: '/' }, { label: p.title }]} />
      <section className="bg-white py-24 md:py-32">
        <Container>
          <SectionHeader
            label={p.label}
            title={p.title}
            description={p.description}
            className="mb-12"
          />

          {formEntries.length > 1 && (
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {formEntries.map(([id, form]) => {
                const Icon = resolveIcon(form.icon);
                const isActive = id === formId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSearchParams({ form: id })}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-muted text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    )}
                  >
                    {Icon && <Icon size={18} />}
                    {form.title}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mx-auto max-w-2xl">
            <OrderForm definition={definition} />
          </div>
        </Container>
      </section>
    </>
  );
}
