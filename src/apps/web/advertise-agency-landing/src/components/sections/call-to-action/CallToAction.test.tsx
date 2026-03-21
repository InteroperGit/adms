import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/call-to-action/callToAction', () => ({
  callToActionContent: {
    title: 'Готовы к сотрудничеству?',
    subtitle: 'Свяжитесь с нами и получите бесплатную консультацию',
    cta: [
      { label: 'Оставить заявку', href: '/#contact' },
      { label: 'Наши работы', href: '/#portfolio' },
    ],
  },
}));

vi.mock('./CtaButtons', () => ({
  CtaButtons: ({ cta }: { cta: { label: string }[] }) => (
    <div data-testid="cta-buttons">{cta.map((c) => c.label).join(', ')}</div>
  ),
}));

import { CallToAction } from './index';

describe('CallToAction', () => {
  it('renders section title', () => {
    render(<CallToAction />);
    expect(screen.getByText('Готовы к сотрудничеству?')).toBeInTheDocument();
  });

  it('renders section subtitle', () => {
    render(<CallToAction />);
    expect(
      screen.getByText('Свяжитесь с нами и получите бесплатную консультацию')
    ).toBeInTheDocument();
  });

  it('renders CTA buttons component', () => {
    render(<CallToAction />);
    expect(screen.getByTestId('cta-buttons')).toBeInTheDocument();
  });

  it('passes cta data to CtaButtons', () => {
    render(<CallToAction />);
    expect(screen.getByText('Оставить заявку, Наши работы')).toBeInTheDocument();
  });

  it('renders a section element', () => {
    const { container } = render(<CallToAction />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
