// src/components/sections/contact/ContactSuccess.tsx
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactContent } from '@/types/sections/contact/contact';

interface ContactSuccessProps {
  onReset: () => void;
}

/**
 * @component
 * @description Displays a success message after form submission with a send icon, title, description, and reset button to submit another message.
 * @param {ContactSuccessProps} props
 * @param {function} props.onReset - Callback to reset form and return to input state
 * @returns {JSX.Element} Centered success message with animated icon and reset button
 * @example <caption>Form submission success</caption>
 * <ContactSuccess onReset={() => setSubmitted(false)} />
 */
export function ContactSuccess({ onReset }: ContactSuccessProps) {
  const { success } = contactContent.form;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
      {/* Icon container with particle burst animation */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Animated particles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-primary/60"
              style={
                {
                  animation: `particle-burst 0.8s ease-out 0.2s forwards`,
                  '--particle-x': `${Math.cos((i / 4) * Math.PI * 2) * 40}px`,
                  '--particle-y': `${Math.sin((i / 4) * Math.PI * 2) * 40}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Main icon background */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Send size={28} className="animate-[scale_0.4s_ease-out] text-primary" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground">{success.title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground">{success.text}</p>
      <Button
        variant="outline"
        className="mt-2 cursor-pointer rounded-full hover:bg-primary hover:text-primary-foreground"
        onClick={onReset}
      >
        {success.reset}
      </Button>
    </div>
  );
}
