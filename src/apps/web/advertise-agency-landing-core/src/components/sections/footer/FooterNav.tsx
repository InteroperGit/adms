// src/components/sections/footer/FooterNav.tsx
import { content } from '@/lib/content';

export function FooterNav() {
  return (
    <div>
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/40">
        {content.footer.navTitle}
      </p>
      <ul className="space-y-3">
        {content.nav.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
