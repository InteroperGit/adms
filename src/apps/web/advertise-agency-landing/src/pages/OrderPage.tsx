import { useSearchParams } from 'react-router';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { OrderForm } from '@/components/ui/orderForm';
import { orderFormsData } from '@/types/config/orderForms';
import { siteData } from '@/types/config/siteData';
import { resolveIcon } from '@/types/shared/iconMap';
import { cn } from '@/libs/utils';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const formEntries = Object.entries(orderFormsData.forms);
const firstForm = formEntries[0]?.[1];

/**
 * Order form page.
 *
 * Displays a `<SectionHeader>` and an `<OrderForm>` for the selected service
 * type. When more than one form is configured in `orderFormsData`, tab-style
 * buttons are rendered above the form so the user can switch between them.
 *
 * The active form is tracked in the `?form=<id>` URL search param so that
 * deep links work correctly after SSG pre-render and the browser back button
 * returns to the previously selected form.
 *
 * @component
 * @returns {JSX.Element} Breadcrumbs + section with form type selector (if multiple) and `<OrderForm>`.
 * @example
 * <OrderPage />
 */
export function OrderPage() {
  const p = orderFormsData.page;
  const [searchParams, setSearchParams] = useSearchParams();
  const formId = searchParams.get('form') ?? p.defaultFormId;
  const definition = orderFormsData.forms[formId] ?? firstForm;

  useDocumentTitle(`${p.title} — ${siteData.name}`);

  return (
    <>
      <BreadCrumbs items={[{ label: siteData.homeLabel, href: '/' }, { label: p.title }]} />
      <section className="bg-background py-24 md:py-32">
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

export default OrderPage;
