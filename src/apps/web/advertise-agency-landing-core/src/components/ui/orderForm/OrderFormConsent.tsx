import { Link } from 'react-router-dom';
import type { OrderFormConsent as ConsentData } from '@/types/config/orderForms';

interface OrderFormConsentProps {
  consent: ConsentData;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function OrderFormConsent({ consent, checked, onChange }: OrderFormConsentProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        id="order-consent"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
        required
      />
      <label htmlFor="order-consent" className="text-xs leading-relaxed text-muted-foreground">
        {consent.text}{' '}
        {consent.links.map((link, i) => (
          <span key={link.href}>
            {i > 0 && ` ${consent.joiner} `}
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
