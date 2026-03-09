// src/components/sections/contact/ContactItem.tsx
import type { IconComponent } from '@/types/shared/iconMap';

interface ContactItemProps {
  icon: IconComponent;
  label: string;
  value: string;
  href?: string;
}

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
