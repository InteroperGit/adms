// Check footer links and copy against the controlled site fixture.
// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { site } from '@/content/site';
import { render } from '../../tests/helpers/render';
import Component from './Footer.astro';

it('renders the configured footer content', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2042-06-15T12:00:00Z'));
  const body = await render(Component);
  vi.useRealTimers();

  const footer = body.querySelector('footer');
  const links = [...footer!.querySelectorAll<HTMLAnchorElement>('a')];

  expect(footer).not.toBeNull();
  expect(footer?.querySelector('.footer-brand')?.getAttribute('href')).toBe(
    '/',
  );
  expect(footer?.querySelector('.footer-brand')?.textContent).toContain(
    site.logoText,
  );
  expect(
    links.map((link) => [link.textContent?.trim(), link.getAttribute('href')]),
  ).toContainEqual([site.legal[0]?.label, site.legal[0]?.href]);
  expect(
    links.map((link) => [link.textContent?.trim(), link.getAttribute('href')]),
  ).toContainEqual([site.legal[1]?.label, site.legal[1]?.href]);
  expect(links.map((link) => link.getAttribute('href'))).toContain(
    `tel:${site.phone.replace(/\s/g, '')}`,
  );
  expect(links.map((link) => link.getAttribute('href'))).toContain(
    `mailto:${site.email}`,
  );
  expect(footer?.textContent).toContain(site.address);
  expect(footer?.textContent).toContain(site.workHours);
  expect(footer?.textContent).toContain(site.workHoursWeekend);
  expect(footer?.textContent).toContain(
    `© 2042 ${site.logoText}. ${site.footer.copyright}.`,
  );
});
