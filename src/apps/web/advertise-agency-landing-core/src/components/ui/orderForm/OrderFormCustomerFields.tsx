import { Separator } from '@/components/ui/separator';
import { OrderFormDynamicFields } from './OrderFormDynamicFields';
import type { FormFieldDefinition } from '@/types/config/orderForms';

interface OrderFormCustomerFieldsProps {
  fields: FormFieldDefinition[];
  values: Record<string, string | boolean>;
  onChange: (key: string, value: string | boolean) => void;
}

export function OrderFormCustomerFields({
  fields,
  values,
  onChange,
}: OrderFormCustomerFieldsProps) {
  return (
    <div className="space-y-4">
      <Separator />
      <h3 className="text-base font-semibold text-foreground">Контактные данные</h3>
      <OrderFormDynamicFields fields={fields} values={values} onChange={onChange} />
    </div>
  );
}
