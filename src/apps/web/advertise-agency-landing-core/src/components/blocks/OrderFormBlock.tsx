import type { OrderFormBlock as OrderFormBlockData } from '@/types/portfolio/blocks';
import { orderFormsData } from '@/types/config/orderForms';
import { OrderForm } from '@/components/ui/orderForm';

interface OrderFormBlockProps {
  block: OrderFormBlockData;
}

export function OrderFormBlock({ block }: OrderFormBlockProps) {
  const definition = orderFormsData.forms[block.formId];

  if (!definition) {
    if (import.meta.env.DEV) {
      console.warn(`[OrderFormBlock] Unknown formId: "${block.formId}"`);
    }
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {block.title && (
        <h2 className="mb-6 text-center font-heading text-2xl font-bold md:text-3xl">
          {block.title}
        </h2>
      )}
      <OrderForm definition={definition} />
    </div>
  );
}
