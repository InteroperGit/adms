import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CtaButtons } from './CtaButtons';

const cta = [
  { label: 'Оставить заявку', href: '/#contact' },
  { label: 'Наши работы', href: '/#portfolio' },
];

describe('CtaButtons', () => {
  it('renders primary button', () => {
    render(<CtaButtons cta={cta} />);
    expect(screen.getByRole('link', { name: /Оставить заявку/ })).toBeInTheDocument();
  });

  it('primary button has correct href', () => {
    render(<CtaButtons cta={cta} />);
    expect(screen.getByRole('link', { name: /Оставить заявку/ })).toHaveAttribute(
      'href',
      '/#contact'
    );
  });

  it('renders secondary button', () => {
    render(<CtaButtons cta={cta} />);
    expect(screen.getByRole('link', { name: /Наши работы/ })).toBeInTheDocument();
  });

  it('secondary button has correct href', () => {
    render(<CtaButtons cta={cta} />);
    expect(screen.getByRole('link', { name: /Наши работы/ })).toHaveAttribute(
      'href',
      '/#portfolio'
    );
  });

  it('renders only primary button when one item provided', () => {
    render(<CtaButtons cta={[cta[0]]} />);
    expect(screen.getByRole('link', { name: /Оставить заявку/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Наши работы/ })).not.toBeInTheDocument();
  });

  it('renders no buttons when empty array provided', () => {
    render(<CtaButtons cta={[]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
