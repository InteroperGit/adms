import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/libs/utils';
import { FormField } from './FormField';

interface ContactFormTextareaProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  rows?: number;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function ContactFormTextarea({
  id,
  label,
  placeholder,
  value,
  error,
  rows = 5,
  onChange,
  onBlur,
}: ContactFormTextareaProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <Textarea
        id={id}
        placeholder={placeholder}
        rows={rows}
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
