import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/ui/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="optimized-image" />
  ),
}));

import { CaseHero } from './CaseHero';

const baseProps = {
  category: 'Брендинг',
  title: 'Редизайн ACME',
  description: 'Полный ребрендинг за 6 недель.',
};

describe('CaseHero', () => {
  describe('common content', () => {
    it('renders the title as h1', () => {
      render(<CaseHero hero={{ gradient: 'from-violet-600 to-indigo-700' }} {...baseProps} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Редизайн ACME');
    });

    it('renders the category badge', () => {
      render(<CaseHero hero={{ gradient: 'from-violet-600 to-indigo-700' }} {...baseProps} />);
      expect(screen.getByText('Брендинг')).toBeInTheDocument();
    });

    it('renders the description', () => {
      render(<CaseHero hero={{ gradient: 'from-violet-600 to-indigo-700' }} {...baseProps} />);
      expect(screen.getByText('Полный ребрендинг за 6 недель.')).toBeInTheDocument();
    });
  });

  describe('gradient mode (no image)', () => {
    it('does not render an image', () => {
      render(<CaseHero hero={{ gradient: 'from-violet-600 to-indigo-700' }} {...baseProps} />);
      expect(screen.queryByTestId('optimized-image')).not.toBeInTheDocument();
    });

    it('applies the gradient class to the section', () => {
      const { container } = render(
        <CaseHero hero={{ gradient: 'from-violet-600 to-indigo-700' }} {...baseProps} />
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('from-violet-600');
      expect(section).toHaveClass('to-indigo-700');
    });

    it('includes bg-gradient-to-br on the section', () => {
      const { container } = render(
        <CaseHero hero={{ gradient: 'from-blue-500 to-purple-600' }} {...baseProps} />
      );
      expect(container.querySelector('section')).toHaveClass('bg-gradient-to-br');
    });
  });

  describe('image mode', () => {
    it('renders the OptimizedImage with the correct src and alt', () => {
      render(<CaseHero hero={{ image: '/img/hero.jpg', gradient: '' }} {...baseProps} />);
      const img = screen.getByTestId('optimized-image');
      expect(img).toHaveAttribute('src', '/img/hero.jpg');
      expect(img).toHaveAttribute('alt', 'Редизайн ACME');
    });

    it('renders the dark overlay div', () => {
      const { container } = render(
        <CaseHero hero={{ image: '/img/hero.jpg', gradient: '' }} {...baseProps} />
      );
      const overlay = container.querySelector('.bg-neutral-900\\/60');
      expect(overlay).toBeInTheDocument();
    });

    it('applies bg-neutral-900 to the section', () => {
      const { container } = render(
        <CaseHero hero={{ image: '/img/hero.jpg', gradient: '' }} {...baseProps} />
      );
      expect(container.querySelector('section')).toHaveClass('bg-neutral-900');
    });
  });
});
