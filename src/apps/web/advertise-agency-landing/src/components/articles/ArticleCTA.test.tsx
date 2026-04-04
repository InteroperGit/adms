import { render, screen } from '@/test/utils';
import { describe, it, expect } from 'vitest';

import { ArticleCTA } from './ArticleCTA';

const defaultProps = {
  title: 'Готовы к похожему результату?',
  subtitle: 'Расскажите о вашем проекте.',
  label: 'Обсудить проект',
  href: '/#contact',
};

describe('ArticleCTA', () => {
  it('renders the CTA section heading', () => {
    render(<ArticleCTA {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Готовы к похожему результату?'
    );
  });

  it('renders the subtitle text', () => {
    render(<ArticleCTA {...defaultProps} />);
    expect(screen.getByText('Расскажите о вашем проекте.')).toBeInTheDocument();
  });

  it('renders the CTA button with the configured label', () => {
    render(<ArticleCTA {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Обсудить проект' })).toBeInTheDocument();
  });

  it('links the button to the configured href', () => {
    render(<ArticleCTA {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Обсудить проект' })).toHaveAttribute(
      'href',
      '/#contact'
    );
  });
});
