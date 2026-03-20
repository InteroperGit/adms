import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroCTA } from './HeroCTA';

const defaultCta = [
  { label: 'Заказать рекламу', href: '/#contact' },
  { label: 'Наши работы', href: '/#portfolio' },
];

describe('HeroCTA', () => {
  it('renders primary button with correct label', () => {
    render(<HeroCTA cta={defaultCta} />);
    expect(screen.getByRole('link', { name: /Заказать рекламу/i })).toBeInTheDocument();
  });

  it('renders secondary button with correct label', () => {
    render(<HeroCTA cta={defaultCta} />);
    expect(screen.getByRole('link', { name: 'Наши работы' })).toBeInTheDocument();
  });

  it('primary button has correct href', () => {
    render(<HeroCTA cta={defaultCta} />);
    expect(screen.getByRole('link', { name: /Заказать рекламу/i })).toHaveAttribute(
      'href',
      '/#contact'
    );
  });

  it('secondary button has correct href', () => {
    render(<HeroCTA cta={defaultCta} />);
    expect(screen.getByRole('link', { name: 'Наши работы' })).toHaveAttribute(
      'href',
      '/#portfolio'
    );
  });

  it('renders only primary button when cta has one item', () => {
    render(<HeroCTA cta={[{ label: 'Заказать', href: '/#contact' }]} />);
    expect(screen.getByRole('link', { name: /Заказать/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});
