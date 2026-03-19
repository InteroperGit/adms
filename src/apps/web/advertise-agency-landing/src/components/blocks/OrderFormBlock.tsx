import type { OrderFormBlock as OrderFormBlockData } from '@/types/blocks';
import { orderFormsData } from '@/types/config/orderForms';
import { OrderForm } from '@/components/ui/orderForm';
import { resolveIcon } from '@/types/shared/iconMap';

interface OrderFormBlockProps {
  block: OrderFormBlockData;
}

/**
 * @component
 * @description Renders order form by reference to form ID configuration with optional title
 * @param {OrderFormBlockProps} props
 * @param {OrderFormBlockData} props.block - Form block with formId and optional title
 * @returns {JSX.Element|null} OrderForm component or null if form not found
 * @example
 * <OrderFormBlock block={{ formId: "consultation", title: "Get Started" }} />
 */
export function OrderFormBlock({ block }: OrderFormBlockProps) {
  const definition = orderFormsData.forms[block.formId];

  if (!definition) {
    if (import.meta.env.DEV) {
      console.warn(`[OrderFormBlock] Unknown formId: "${block.formId}"`);
    }
    return null;
  }

  const trustBadges = definition.trustBadges;

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 px-8 py-10">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl dark:bg-primary/30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl dark:bg-accent/35"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {trustBadges && trustBadges.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-4">
            {trustBadges.map(({ icon, label }) => {
              const Icon = resolveIcon(icon);
              return (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  {Icon && <Icon size={13} className="shrink-0 text-primary/60" />}
                  {label}
                </div>
              );
            })}
          </div>
        )}

        {block.title && (
          <h2 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-center font-heading text-2xl font-bold text-transparent md:text-3xl">
            {block.title}
          </h2>
        )}

        <OrderForm definition={definition} />
      </div>
    </div>
  );
}
