// src/components/sections/contact/ContactConsent.tsx
import { Link } from 'react-router-dom';
import { content } from '@/types/content';

interface ContactConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ContactConsent({ checked, onChange }: ContactConsentProps) {
  const { form: f } = content.contact;

  return (
    <div className="flex items-start gap-3">
      <input
        id="consent"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
        required
      />
      <label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">
        {f.consent}{' '}
        {f.consentLinks.map((link, i) => (
          <span key={link.href}>
            {i > 0 && ` ${f.consentJoiner} `}
            <Link
              to={link.href}
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </label>
    </div>
  );
}
