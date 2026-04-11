import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AboutCard } from './AboutCard';

vi.mock('@/components/shared/logo/Logo', () => ({
  Logo: ({ className }: { className?: string }) => (
    <div data-testid="logo" className={className}>
      Logo
    </div>
  ),
}));

const card = {
  tagline: 'Ваш надёжный партнёр с 2010 года',
  stats: [
    { label: 'Клиентов', value: '150+' },
    { label: 'Проектов', value: '200+' },
    { label: 'Наград', value: '30+' },
  ],
  nps: { label: 'NPS', value: '95' },
};

describe('AboutCard', () => {
  it('renders logo', () => {
    render(<AboutCard card={card} />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders tagline', () => {
    render(<AboutCard card={card} />);
    expect(screen.getByText('Ваш надёжный партнёр с 2010 года')).toBeInTheDocument();
  });

  it('renders all stat labels', () => {
    render(<AboutCard card={card} />);
    expect(screen.getByText('Клиентов')).toBeInTheDocument();
    expect(screen.getByText('Проектов')).toBeInTheDocument();
    expect(screen.getByText('Наград')).toBeInTheDocument();
  });

  it('renders all stat values', () => {
    render(<AboutCard card={card} />);
    expect(screen.getByText('150+')).toBeInTheDocument();
    expect(screen.getByText('200+')).toBeInTheDocument();
    expect(screen.getByText('30+')).toBeInTheDocument();
  });

  it('renders correct number of stat rows', () => {
    const { container } = render(<AboutCard card={card} />);
    // Each stat row has a label and value in a flex row
    const rows = container.querySelectorAll('.group');
    expect(rows).toHaveLength(3);
  });
});
