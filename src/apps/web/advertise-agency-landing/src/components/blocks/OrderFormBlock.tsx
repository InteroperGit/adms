import { cn } from '@/libs/utils';
import type { OrderFormBlock as OrderFormBlockData } from '@/types/blocks';
import { orderFormsData } from '@/types/config/orderForms';
import { OrderForm } from '@/components/ui/orderForm';
import { resolveIcon } from '@/types/shared/iconMap';
import type { OrderFormDefinition } from '@/types/config/orderForms';

interface ViewProps {
  block: OrderFormBlockData;
  definition: OrderFormDefinition;
}

function OrderFormBlockMobile({ block, definition }: ViewProps) {
  return (
    <div className="mx-auto max-w-2xl md:hidden">
      {block.title && (
        <h2 className="mb-6 text-center font-heading text-2xl font-bold">
          {block.title}
        </h2>
      )}
      <OrderForm definition={definition} />
    </div>
  );
}

function OrderFormBlockDesktop({ block, definition }: ViewProps) {
  const trustBadges = definition.trustBadges;

  return (
    <div
      className={cn(
        'relative mx-auto hidden max-w-2xl overflow-hidden rounded-3xl px-8 py-10 md:block',
        'border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5'
      )}
    >
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
          <h2
            className={cn(
              'mb-6 text-center font-heading text-3xl font-bold',
              'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
            )}
          >
            {block.title}
          </h2>
        )}

        <OrderForm definition={definition} />
      </div>
    </div>
  );
}

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

  return (
    <>
      <OrderFormBlockMobile block={block} definition={definition} />
      <OrderFormBlockDesktop block={block} definition={definition} />
    </>
  );
}
