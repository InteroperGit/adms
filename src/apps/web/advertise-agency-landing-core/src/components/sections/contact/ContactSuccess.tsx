// src/components/sections/contact/ContactSuccess.tsx
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactContent } from '@/types/sections/contact';

interface ContactSuccessProps {
  onReset: () => void;
}

export function ContactSuccess({ onReset }: ContactSuccessProps) {
  const { success } = contactContent.form;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Send size={28} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{success.title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground">{success.text}</p>
      <Button variant="outline" className="mt-2 rounded-full" onClick={onReset}>
        {success.reset}
      </Button>
    </div>
  );
}
