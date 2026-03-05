// src/components/sections/footer/FooterBottom.tsx
import { Link } from 'react-router-dom';
import { content } from '@/types/content';
import { siteData } from '@/types/siteData';

export function FooterBottom() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/35 sm:flex-row">
      <p>
        {content.footer.copyright.replace('{year}', String(year)).replace('{name}', siteData.name)}
      </p>

      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
        {content.footer.legalLinks.map((link, i) => (
          <span key={link.href}>
            {i > 0 && <span className="hidden text-white/15 sm:inline">|</span>}
            <Link
              to={link.href}
              className="whitespace-nowrap transition-colors hover:text-white/70"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </nav>

      <p>{content.footer.tagline}</p>
    </div>
  );
}
