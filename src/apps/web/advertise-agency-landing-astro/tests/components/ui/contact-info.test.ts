// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import ContactInfo from '../../../src/components/ui/ContactInfo.astro';
import { render } from '../../helpers/render';

it.each([{}, {
  phone: '', email: '', address: '', workHours: '', workHoursWeekend: '',
}])('omits absent and empty contact rows: %j', async (props) => {
  const body = await render(ContactInfo, props);
  expect(body.querySelector('.contact-info')?.children).toHaveLength(0);
  expect(body.querySelector('a, i, p')).toBeNull();
});

it('renders native destinations, details and decorative icons', async () => {
  const body = await render(ContactInfo, {
    phone: '+7 900\u00a0123 45 67', email: 'hello@example.test',
    address: 'Sample street', workHours: 'Mon–Fri 9–18',
    workHoursWeekend: 'Weekend closed', class: 'custom',
  });
  expect(getByRole(body, 'link', { name: '+7 900\u00a0123 45 67' }))
    .toHaveAttribute('href', 'tel:+79001234567');
  expect(getByRole(body, 'link', { name: 'hello@example.test' }))
    .toHaveAttribute('href', 'mailto:hello@example.test');
  expect(body).toHaveTextContent('Sample street');
  expect(body).toHaveTextContent('Mon–Fri 9–18');
  expect(body).toHaveTextContent('Weekend closed');
  expect(body.querySelector('.contact-info')).toHaveClass('custom');
  expect(body.querySelectorAll('i[aria-hidden="true"]')).toHaveLength(4);
});

it('omits weekend-only copy and supports hours without weekend', async () => {
  const weekend = await render(ContactInfo, { workHoursWeekend: 'Closed' });
  expect(weekend.querySelector('.contact-info')?.children).toHaveLength(0);
  const hours = await render(ContactInfo, { workHours: 'Open daily' });
  expect(hours.querySelectorAll('p')).toHaveLength(1);
  expect(hours).toHaveTextContent('Open daily');
});
