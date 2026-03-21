import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AboutText } from './AboutText';

vi.mock('@/types/sections/about/aboutContent', () => ({
  aboutContent: {
    label: 'О нас',
    title: 'Мы создаём',
    titleHighlight: 'эффективную рекламу',
    text: [
      'Агентство {name} работает с 2010 года.',
      'Мы специализируемся на digital-рекламе.',
      'Доверьте нам продвижение вашего бизнеса.',
    ],
    card: {
      tagline: 'tagline',
      stats: [],
      nps: { label: 'NPS', value: '95' },
    },
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: { name: 'Рекламастер' },
}));

describe('AboutText', () => {
  it('renders all paragraphs', () => {
    render(<AboutText />);
    expect(screen.getByText('Агентство Рекламастер работает с 2010 года.')).toBeInTheDocument();
    expect(screen.getByText('Мы специализируемся на digital-рекламе.')).toBeInTheDocument();
    expect(screen.getByText('Доверьте нам продвижение вашего бизнеса.')).toBeInTheDocument();
  });

  it('interpolates company name into text', () => {
    render(<AboutText />);
    expect(screen.getByText(/Рекламастер/)).toBeInTheDocument();
  });

  it('renders correct number of paragraphs', () => {
    const { container } = render(<AboutText />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(3);
  });

  it('last paragraph has mb-10 class', () => {
    const { container } = render(<AboutText />);
    const paragraphs = container.querySelectorAll('p');
    const last = paragraphs[paragraphs.length - 1];
    expect(last.className).toContain('mb-10');
  });
});
