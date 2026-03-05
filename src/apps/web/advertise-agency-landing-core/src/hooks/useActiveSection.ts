import { useEffect, useState } from 'react';
import { content } from '@/lib/content';

const SECTION_IDS = content.nav.map((l) => l.href.slice(1));

export function useActiveSection(): string {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      // Trigger when a section crosses into the top half of the viewport,
      // accounting for the 80px sticky header.
      { rootMargin: '-80px 0px -50% 0px', threshold: 0 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}
