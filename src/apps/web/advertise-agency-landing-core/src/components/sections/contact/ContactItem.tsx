// src/components/sections/contact/ContactItem.tsx
import type { IconComponent } from '@/types/shared/iconMap';

interface ContactItemProps {
  icon: IconComponent;
  label: string;
  value: string;
  href?: string;
}

/**
 * @component
 * @description Renders a single contact item with icon, label, and value. Value is clickable link if href provided, otherwise plain text.
 * @param {ContactItemProps} props
 * @param {IconComponent} props.icon - Lucide icon component to display
 * @param {string} props.label - Uppercase label text (e.g., "PHONE")
 * @param {string} props.value - Contact value (phone number, email, address)
 * @param {string} [props.href] - Optional link URL; if provided, value becomes clickable
 * @returns {JSX.Element} List item with icon box, label, and value
 * @example <caption>Contact phone item</caption>
 * <ContactItem icon={Phone} label="PHONE" value="+1 (555) 123-4567" href="tel:+15551234567" />
 */
export function ContactItem({ icon: Icon, label, value, href }: ContactItemProps) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        {href ? (
          <a href={href} className="mt-0.5 block font-semibold text-foreground hover:text-primary">
            {value}
          </a>
        ) : (
          <p className="mt-0.5 font-semibold text-foreground">{value}</p>
        )}
      </div>
    </li>
  );
}
