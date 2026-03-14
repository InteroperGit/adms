import { Separator } from '@/components/ui/separator';
import { OrderFormDynamicFields } from './OrderFormDynamicFields';
import type { FormFieldDefinition } from '@/types/config/orderForms';

interface OrderFormCustomerFieldsProps {
  fields: FormFieldDefinition[];
  values: Record<string, string | boolean>;
  onChange: (key: string, value: string | boolean) => void;
}

/**
 * @component
 * @description Customer information fields section with separator and heading
 * @param {OrderFormCustomerFieldsProps} props
 * @param {FormFieldDefinition[]} props.fields - Contact field definitions
 * @param {Record<string, string | boolean>} props.values - Field values
 * @param {(key: string, value: string | boolean) => void} props.onChange - Value update handler
 * @returns {JSX.Element} Section with heading and dynamic fields
 * @example
 * <OrderFormCustomerFields fields={contactFields} values={formValues} onChange={updateField} />
 */
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
