import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AboutValues } from './AboutValues';

vi.mock('@/types/sections/about/aboutValues', () => ({
  aboutValues: [
    { title: 'Честность', description: 'Мы всегда честны с клиентами' },
    { title: 'Инновации', description: 'Мы используем новые технологии' },
    { title: 'Результат', description: 'Мы ориентированы на результат' },
  ],
}));

describe('AboutValues', () => {
  it('renders all value titles', () => {
    render(<AboutValues />);
    expect(screen.getByText('Честность')).toBeInTheDocument();
    expect(screen.getByText('Инновации')).toBeInTheDocument();
    expect(screen.getByText('Результат')).toBeInTheDocument();
  });

  it('renders all value descriptions', () => {
    render(<AboutValues />);
    expect(screen.getByText('Мы всегда честны с клиентами')).toBeInTheDocument();
    expect(screen.getByText('Мы используем новые технологии')).toBeInTheDocument();
    expect(screen.getByText('Мы ориентированы на результат')).toBeInTheDocument();
  });

  it('renders checkmark icons for each value', () => {
    const { container } = render(<AboutValues />);
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(3);
  });

  it('renders as a list with correct item count', () => {
    const { container } = render(<AboutValues />);
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(3);
  });
});
