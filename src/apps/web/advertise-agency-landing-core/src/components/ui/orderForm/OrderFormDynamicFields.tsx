import { OrderFormField } from './OrderFormField';
import type { FormFieldDefinition } from '@/types/config/orderForms';

interface OrderFormDynamicFieldsProps {
  fields: FormFieldDefinition[];
  values: Record<string, string | boolean>;
  onChange: (key: string, value: string | boolean) => void;
}

/**
 * @component
 * @description Renders field definitions as appropriate input types (text, number, select, radio, checkbox, textarea)
 * @param {OrderFormDynamicFieldsProps} props
 * @param {FormFieldDefinition[]} props.fields - Field definitions to render
 * @param {Record<string, string | boolean>} props.values - Current field values
 * @param {(key: string, value: string | boolean) => void} props.onChange - Value change handler
 * @returns {JSX.Element} Grid of OrderFormField components
 * @example
 * <OrderFormDynamicFields fields={productFields} values={values} onChange={handleChange} />
 */
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
