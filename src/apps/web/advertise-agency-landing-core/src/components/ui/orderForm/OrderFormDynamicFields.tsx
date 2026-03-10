import { OrderFormField } from './OrderFormField';
import type { FormFieldDefinition } from '@/types/config/orderForms';

interface OrderFormDynamicFieldsProps {
  fields: FormFieldDefinition[];
  values: Record<string, string | boolean>;
  onChange: (key: string, value: string | boolean) => void;
}

export function OrderFormDynamicFields({ fields, values, onChange }: OrderFormDynamicFieldsProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <OrderFormField
          key={field.key}
          field={field}
          value={values[field.key] ?? (field.type === 'checkbox' ? false : '')}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
