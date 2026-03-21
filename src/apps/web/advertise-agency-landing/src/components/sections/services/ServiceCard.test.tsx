import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { Service } from '@/types/sections/services/services';

vi.mock('@/types/shared/iconMap', () => ({
  ICON_MAP: new Proxy({}, { get: () => (props: object) => <svg data-testid="icon" {...props} /> }),
}));

import { ServiceCard } from './ServiceCard';

const service: Service = {
  icon: 'Zap',
  title: 'Контекстная реклама',
  description: 'Быстрый и точный охват целевой аудитории',
};

describe('ServiceCard', () => {
  it('renders service title', () => {
    render(<ServiceCard service={service} index={0} />);
    expect(screen.getByText('Контекстная реклама')).toBeInTheDocument();
  });

  it('renders service description', () => {
    render(<ServiceCard service={service} index={0} />);
    expect(screen.getByText('Быстрый и точный охват целевой аудитории')).toBeInTheDocument();
  });

  it('renders icon with icon-shake class', () => {
    const { container } = render(<ServiceCard service={service} index={0} />);
    expect(container.querySelector('.icon-shake')).toBeInTheDocument();
  });

  it('renders inside ItemCard (has group class)', () => {
    const { container } = render(<ServiceCard service={service} index={0} />);
    expect(container.querySelector('.group')).toBeInTheDocument();
  });
});
