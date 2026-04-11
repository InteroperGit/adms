import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TestimonialCard } from './TestimonialCard';
import type { Testimonial } from '@/types/sections/testimonials/testimonials';

const mockTestimonial: Testimonial = {
  id: 1,
  name: 'Иван Петров',
  role: 'Директор',
  company: 'ООО Пример',
  avatar: 'ИП',
  avatarColor: 'from-blue-500 to-indigo-600',
  rating: 4,
  text: 'Отличная работа команды, очень доволен результатом.',
};

describe('TestimonialCard', () => {
  it('renders the author name', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
  });

  it('renders the quote text wrapped in guillemets', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    expect(
      screen.getByText('«Отличная работа команды, очень доволен результатом.»')
    ).toBeInTheDocument();
  });

  it('renders role and company', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    expect(screen.getByText('Директор · ООО Пример')).toBeInTheDocument();
  });

  it('renders the avatar initials', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    expect(screen.getByText('ИП')).toBeInTheDocument();
  });

  it('renders the correct number of stars (4)', () => {
    const { container } = render(<TestimonialCard testimonial={mockTestimonial} />);
    const stars = container.querySelectorAll('svg.fill-primary');
    expect(stars).toHaveLength(4);
  });

  it('renders as a blockquote element', () => {
    const { container } = render(<TestimonialCard testimonial={mockTestimonial} />);
    expect(container.querySelector('blockquote')).toBeInTheDocument();
  });

  it('does not render quote icon by default', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    // Quote icon SVGs would be extra — with showQuoteIcon=false there should be exactly 4 stars
    // and no additional icons beyond them
    const { container } = render(<TestimonialCard testimonial={mockTestimonial} />);
    // The default is showQuoteIcon=false, so no Quote icon wrapper div
    const quoteWrapper = container.querySelector('.text-primary\\/10');
    expect(quoteWrapper).not.toBeInTheDocument();
  });

  it('renders quote icon when showQuoteIcon is true', () => {
    const { container } = render(<TestimonialCard testimonial={mockTestimonial} showQuoteIcon />);
    const quoteWrapper = container.querySelector('.text-primary\\/10');
    expect(quoteWrapper).toBeInTheDocument();
  });

  it('applies custom className to blockquote', () => {
    const { container } = render(
      <TestimonialCard testimonial={mockTestimonial} className="custom-card" />
    );
    expect(container.querySelector('blockquote')).toHaveClass('custom-card');
  });

  it('applies avatarColor class to avatar element', () => {
    const { container } = render(<TestimonialCard testimonial={mockTestimonial} />);
    const avatar = container.querySelector('.from-blue-500');
    expect(avatar).toBeInTheDocument();
  });
});
