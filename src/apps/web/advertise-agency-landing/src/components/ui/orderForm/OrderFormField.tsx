import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/libs/utils';
import type { FormFieldDefinition } from '@/types/config/orderForms';

interface OrderFormFieldProps {
  field: FormFieldDefinition;
  value: string | boolean;
  onChange: (key: string, value: string | boolean) => void;
}

/**
 * @component
 * @description Renders a single form field based on type (text, number, select, radio, checkbox, textarea)
 * @param {OrderFormFieldProps} props
 * @param {FormFieldDefinition} props.field - Field definition with type, label, validation rules, etc.
 * @param {string | boolean} props.value - Current field value
 * @param {(key: string, value: string | boolean) => void} props.onChange - Change handler
 * @returns {JSX.Element} Appropriate input component or null for unknown types
 * @example
 * <OrderFormField field={emailField} value="test@example.com" onChange={handleChange} />
 */
export function OrderFormField({ field, value, onChange }: OrderFormFieldProps) {
  const id = `field-${field.key}`;

  switch (field.type) {
    case 'text':
    case 'number':
      return (
        <div className="space-y-1.5">
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
          <Input
            id={id}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            value={value as string}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1.5">
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
          <select
            id={id}
            required={field.required}
            value={value as string}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
          >
            <option value="">{field.placeholder ?? '— Выберите —'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'radio':
      return (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="ml-0.5 text-destructive">*</span>}
          </legend>
          <div className="flex flex-wrap gap-4">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={field.key}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(field.key, opt.value)}
                  required={field.required}
                  className="accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      );

    case 'checkbox':
      return (
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(field.key, e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          {field.label}
        </label>
      );

    case 'textarea':
      return (
        <div className="space-y-1.5">
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
          <Textarea
            id={id}
            placeholder={field.placeholder}
            required={field.required}
            value={value as string}
            onChange={(e) => onChange(field.key, e.target.value)}
            rows={3}
          />
        </div>
      );
  }
}
