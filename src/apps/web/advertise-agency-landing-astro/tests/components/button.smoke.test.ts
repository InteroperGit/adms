// Astro Container renders server-side, so this test uses Node.
// @vitest-environment node

import {
  experimental_AstroContainer as AstroContainer,
} from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import Button from '../../src/components/ui/Button.astro';

describe('Button smoke test', () => {
  it('renders an anchor when href is provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Button, {
      props: { href: '/contact', 'aria-label': 'Contact' },
      slots: { default: 'Contact' },
    });

    const document = new JSDOM(html).window.document;
    const link = document.querySelector('a');

    expect(link).toHaveAttribute('href', '/contact');
    expect(link).toHaveAttribute('aria-label', 'Contact');
    expect(link).toHaveTextContent('Contact');
  });
});

