import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

vi.mock('@/types/shared/iconMap', () => ({
  ICON_MAP: new Proxy({}, { get: () => (props: object) => <svg data-testid="icon" {...props} /> }),
}));

vi.mock('@/hooks/useStaggeredReveal', () => ({
  useStaggeredReveal: () => ({
    ref: { current: null },
    isVisible: true,
    getDelay: (i: number) => i * 60,
  }),
}));

vi.mock('@/types/sections/services/servicesContent', () => ({
  servicesSectionContent: {
    label: 'Услуги',
    title: 'Наши услуги',
    description: 'Полный спектр рекламных услуг',
  },
}));

vi.mock('@/types/sections/services/services', () => ({
  services: [
    { icon: 'Zap', title: 'Контекстная реклама', description: 'Быстрый результат' },
    { icon: 'Star', title: 'SEO-продвижение', description: 'Долгосрочный эффект' },
    { icon: 'Globe', title: 'SMM', description: 'Социальные сети' },
  ],
}));

import { Services } from './index';

describe('Services', () => {
  it('renders section header label', () => {
    render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    expect(screen.getByText('Услуги')).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    expect(screen.getByText('Наши услуги')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    expect(screen.getByText('Полный спектр рекламных услуг')).toBeInTheDocument();
  });

  it('renders all service card titles', () => {
    render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    expect(screen.getByText('Контекстная реклама')).toBeInTheDocument();
    expect(screen.getByText('SEO-продвижение')).toBeInTheDocument();
    expect(screen.getByText('SMM')).toBeInTheDocument();
  });

  it('renders all service card descriptions', () => {
    render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    expect(screen.getByText('Быстрый результат')).toBeInTheDocument();
    expect(screen.getByText('Долгосрочный эффект')).toBeInTheDocument();
    expect(screen.getByText('Социальные сети')).toBeInTheDocument();
  });

  it('renders services section element', () => {
    const { container } = render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );
    expect(container.querySelector('#services')).toBeInTheDocument();
  });
});
