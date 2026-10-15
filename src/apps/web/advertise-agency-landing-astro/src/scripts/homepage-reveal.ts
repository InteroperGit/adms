// Reveal homepage sections as they approach the viewport without hiding the
// initial, focused or directly addressed content from keyboard users.

const sectionSelector = ':scope > section';

/**
 * Progressively reveals direct homepage sections when browser APIs permit it.
 * The server-rendered page remains fully readable when JavaScript,
 * IntersectionObserver or reduced-motion support is unavailable.
 */
export function initializeHomepageReveal(): void {
  const container = document.querySelector('.homepage-sections');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!container || !('IntersectionObserver' in window) || motion.matches) {
    return;
  }

  const sections = [...container.querySelectorAll<HTMLElement>(
    sectionSelector,
  )];
  const pending = new Set<HTMLElement>();
  let observer: IntersectionObserver;

  // Decode IDs rather than treating arbitrary fragments as CSS selectors.
  const hashTarget = (hash: string): HTMLElement | null => {
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return null;
    }
  };

  // Checking edges instead of a visible fraction also supports tall bands.
  const inViewport = (section: HTMLElement): boolean => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= window.innerHeight && bounds.bottom >= 0;
  };

  // Release observers and navigation hooks once every section is visible.
  const cleanup = (): void => {
    observer.disconnect();
    document.removeEventListener('focusin', onFocus, true);
    document.removeEventListener('click', onClick, true);
    window.removeEventListener('hashchange', onHash);
    window.removeEventListener('pageshow', onPageShow);
    motion.removeEventListener('change', onMotion);
  };

  // Navigation and focus bypass the fade so targets are immediately usable.
  const reveal = (section: HTMLElement, immediate = false): void => {
    if (immediate) section.removeAttribute('data-reveal-state');
    if (!pending.delete(section)) return;
    if (!immediate) section.dataset.revealState = 'revealed';
    observer.unobserve(section);
    if (!pending.size) cleanup();
  };

  // Find the owning top-level section without modifying nested sections.
  const revealTarget = (target: EventTarget | null): void => {
    if (!(target instanceof Node)) return;
    const section = sections.find(item => item.contains(target));
    if (section) reveal(section, true);
  };

  const onHash = (): void => revealTarget(hashTarget(window.location.hash));
  const onFocus = (event: FocusEvent): void => revealTarget(event.target);
  const onClick = (event: MouseEvent): void => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      revealTarget(hashTarget(url.hash));
    }
  };

  const onPageShow = (): void => {
    for (const section of pending) {
      if (inViewport(section)) reveal(section, true);
    }
  };

  const onMotion = (): void => {
    if (!motion.matches) return;
    for (const section of pending) reveal(section, true);
  };

  // Reveal just before entry, then stop watching each section.
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target as HTMLElement);
    }
  }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });

  // Direct hash/focus targets never acquire a hidden state or flash.
  const initialTarget = hashTarget(window.location.hash);
  for (const section of sections) {
    if (
      inViewport(section) ||
      (initialTarget && section.contains(initialTarget)) ||
      section.contains(document.activeElement)
    ) continue;
    pending.add(section);
    section.dataset.revealState = 'pending';
    observer.observe(section);
  }

  if (!pending.size) {
    cleanup();
    return;
  }

  document.addEventListener('focusin', onFocus, true);
  document.addEventListener('click', onClick, true);
  window.addEventListener('hashchange', onHash);
  window.addEventListener('pageshow', onPageShow);
  motion.addEventListener('change', onMotion);
}
