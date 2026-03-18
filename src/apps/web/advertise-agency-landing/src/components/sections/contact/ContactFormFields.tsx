// src/components/sections/contact/ContactFormFields.tsx
import { contactContent } from '@/types/sections/contact/contact';
import { ContactFormInput } from './ContactFormInput';
import { ContactFormTextarea } from './ContactFormTextarea';

export type FormState = { name: string; contact: string; message: string };

interface ContactFormFieldsProps {
  form: FormState;
  errors: FormState;
  onChange: (field: keyof FormState, value: string) => void;
  onBlur: (field: keyof FormState) => void;
}

/**
 * @component
 * @description Renders three input fields for contact form: name (text input), contact (text input), and message (textarea). Includes validation state and error messages.
 * @param {ContactFormFieldsProps} props
 * @param {FormState} props.form - Current form state with name, contact, and message values
 * @param {FormState} props.errors - Error messages for each field
 * @param {function} props.onChange - Callback fired with field name and new value when any field changes
 * @param {function} props.onBlur - Callback fired when field loses focus (triggers validation)
 * @returns {JSX.Element} Fragment containing labeled input fields with error messages
 * @example <caption>Contact form fields with validation</caption>
 * <ContactFormFields form={form} errors={errors} onChange={(field, value) => setForm({ ...form, [field]: value })} onBlur={(field) => handleBlur(field)} />
 */
export function ContactFormFields({ form, errors, onChange, onBlur }: ContactFormFieldsProps) {
  const { form: f } = contactContent;

  return (
    <>
      <ContactFormInput
        id="name"
        label={f.name.label}
        placeholder={f.name.placeholder}
        value={form.name}
        error={errors.name}
        onChange={(value) => onChange('name', value)}
        onBlur={() => onBlur('name')}
      />

      <ContactFormInput
        id="contact"
        label={f.contact.label}
        placeholder={f.contact.placeholder}
        value={form.contact}
        error={errors.contact}
        onChange={(value) => onChange('contact', value)}
        onBlur={() => onBlur('contact')}
      />

      <ContactFormTextarea
        id="message"
        label={f.message.label}
        placeholder={f.message.placeholder}
        value={form.message}
        error={errors.message}
        rows={5}
        onChange={(value) => onChange('message', value)}
        onBlur={() => onBlur('message')}
      />
    </>
  );
}
