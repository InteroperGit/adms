import { Input } from '@/components/ui/input';
import { cn } from '@/libs/utils';
import { FormField } from './FormField';

interface ContactFormInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function ContactFormInput({
  id,
  label,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
}: ContactFormInputProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <Input
        id={id}
        placeholder={placeholder}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          'focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-foreground/20',
          error && 'border-destructive focus-visible:ring-destructive focus-visible:ring-3'
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </FormField>
  );
}
