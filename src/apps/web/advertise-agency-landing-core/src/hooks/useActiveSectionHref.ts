import { useLocation } from 'react-router-dom';
import { headerContent } from '@/types/sections/header';
import { useActiveSection } from './useActiveSection';

// '#portfolio' → { prefix: '/portfolio/', href: '#portfolio' }
// Nav entries without a matching route simply never satisfy startsWith — no harm done.
const ROUTE_MAP = headerContent.nav.map((link) => ({
  prefix: `/${link.href.slice(1)}/`,
  href: link.href,
}));

/**
 * Returns the href of the currently active nav link (e.g. '#portfolio').
 *
 * Combines two strategies:
 *  1. Scroll-based: IntersectionObserver on home-page sections (via useActiveSection)
 *  2. Route-based: on sub-pages where home sections are absent from the DOM,
 *     the matching nav link is inferred from the current pathname via ROUTE_MAP.
 */
export function useActiveSectionHref(): string {
  const sectionId = useActiveSection();
  const { pathname } = useLocation();

  const routeMatch = ROUTE_MAP.find(({ prefix }) => pathname.startsWith(prefix));
  if (routeMatch) {
    return routeMatch.href;
  }

  return sectionId ? `#${sectionId}` : '';
}
