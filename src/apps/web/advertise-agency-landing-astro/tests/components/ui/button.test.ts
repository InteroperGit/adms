// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Button from '../../../src/components/ui/Button.astro';
import { render } from '../../helpers/render';

it('defaults to a native primary medium button with slot content', async () => {
  const body = await render(Button, {}, { default: '<strong>Send</strong>' });
  const button = getByRole(body, 'button', { name: 'Send' });
  expect(button).toHaveAttribute('type', 'button');
  expect(button).toHaveClass('btn-primary', 'btn-md', 'site-button');
  expect(button.querySelector('strong')).toHaveTextContent('Send');
  expect(body.querySelector('a')).toBeNull();
});

it.each(['primary', 'secondary', 'outline', 'ghost', 'link'])(
  'supports the %s variant and link attributes', async (variant) => {
    const body = await render(Button, {
      href: '/contact/', variant, class: 'custom',
      'aria-label': 'Contact us', 'data-action': 'contact',
      target: '_blank', rel: 'noopener',
    }, { default: 'Contact' });
    const link = getByRole(body, 'link', { name: 'Contact us' });
    expect(link).toHaveAttribute('href', '/contact/');
    expect(link).toHaveAttribute('data-action', 'contact');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
    expect(link).toHaveClass(`btn-${variant}`, 'custom');
    expect(link).not.toHaveAttribute('type');
    expect(body.querySelector('button')).toBeNull();
  },
);

it.each(['sm', 'md', 'lg'])('supports size %s', async (size) => {
  const body = await render(Button, { size, type: 'submit', disabled: true });
  const button = body.querySelector('button');
  expect(button).toHaveClass(`btn-${size}`);
  expect(button).toHaveAttribute('type', 'submit');
  expect(button).toBeDisabled();
});

it('passes hidden, aria, data and reset attributes through', async () => {
  const body = await render(Button, {
    type: 'reset', hidden: true, 'aria-expanded': 'false',
    'aria-controls': 'panel', 'data-toggle': 'panel',
  });
  const button = body.querySelector('button');
  expect(button).toHaveAttribute('hidden');
  expect(button).toHaveAttribute('type', 'reset');
  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(button).toHaveAttribute('aria-controls', 'panel');
  expect(button).toHaveAttribute('data-toggle', 'panel');
});
