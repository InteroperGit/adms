// src/components/sections/contact/ContactFormFields.tsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactContent } from '@/types/sections/contact/contact';

export type FormState = { name: string; contact: string; message: string };

interface ContactFormFieldsProps {
  form: FormState;
  onChange: (field: keyof FormState, value: string) => void;
}

/**
 * @component
 * @description Renders three input fields for contact form: name (text input), contact (text input), and message (textarea). Controlled component pattern.
 * @param {ContactFormFieldsProps} props
 * @param {FormState} props.form - Current form state with name, contact, and message values
 * @param {function} props.onChange - Callback fired with field name and new value when any field changes
 * @returns {JSX.Element} Fragment containing labeled input fields
 * @example <caption>Contact form fields</caption>
 * <ContactFormFields form={form} onChange={(field, value) => setForm({ ...form, [field]: value })} />
 */
export function ContactFormFields({ form, onChange }: ContactFormFieldsProps) {
  const { form: f } = contactContent;

  return (
    <>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
          {f.name.label}
        </label>
        <Input
          id="name"
          placeholder={f.name.placeholder}
          required
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-1.5 block text-sm font-medium text-foreground">
          {f.contact.label}
        </label>
        <Input
          id="contact"
          placeholder={f.contact.placeholder}
          required
          value={form.contact}
          onChange={(e) => onChange('contact', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          {f.message.label}
        </label>
        <Textarea
          id="message"
          placeholder={f.message.placeholder}
          rows={5}
          value={form.message}
          onChange={(e) => onChange('message', e.target.value)}
        />
      </div>
    </>
  );
}
