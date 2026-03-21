import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/testimonials/testimonials', () => ({
  testimonials: [{ id: 1, name: 'John Doe', role: 'CEO', company: 'ACME', text: 'Great service!' }],
}));

vi.mock('@/components/ui/testimonial/TestimonialCard', () => ({
  TestimonialCard: ({ testimonial }: { testimonial: { name: string } }) => (
    <div data-testid="testimonial-card">{testimonial.name}</div>
  ),
}));

import { BlockquoteBlock } from './BlockquoteBlock';

describe('BlockquoteBlock', () => {
  describe('inline blockquote variant', () => {
    it('renders blockquote element with quote text', () => {
      const { container } = render(
        <BlockquoteBlock
          block={{ __component: 'blockquote', text: 'Great work', author: 'Alice' }}
        />
      );
      expect(container.querySelector('blockquote')).toBeInTheDocument();
      expect(screen.getByText(/Great work/)).toBeInTheDocument();
    });

    it('renders author name', () => {
      render(
        <BlockquoteBlock block={{ __component: 'blockquote', text: 'Quote', author: 'Alice' }} />
      );
      expect(screen.getByText(/Alice/)).toBeInTheDocument();
    });

    it('renders role when provided', () => {
      render(
        <BlockquoteBlock
          block={{ __component: 'blockquote', text: 'Quote', author: 'Alice', role: 'Manager' }}
        />
      );
      expect(screen.getByText(/Manager/)).toBeInTheDocument();
    });

    it('renders company when provided', () => {
      render(
        <BlockquoteBlock
          block={{ __component: 'blockquote', text: 'Quote', author: 'Alice', company: 'ACME' }}
        />
      );
      expect(screen.getByText(/ACME/)).toBeInTheDocument();
    });

    it('renders large quote mark decoration', () => {
      const { container } = render(
        <BlockquoteBlock block={{ __component: 'blockquote', text: 'Quote', author: 'Alice' }} />
      );
      const deco = container.querySelector('[aria-hidden="true"]');
      expect(deco).toBeInTheDocument();
    });
  });

  describe('testimonial reference variant', () => {
    it('renders TestimonialCard for known testimonialId', () => {
      render(<BlockquoteBlock block={{ __component: 'blockquote', testimonialId: 1 }} />);
      expect(screen.getByTestId('testimonial-card')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('returns null for unknown testimonialId', () => {
      const { container } = render(
        <BlockquoteBlock block={{ __component: 'blockquote', testimonialId: 999 }} />
      );
      expect(container.firstChild).toBeNull();
    });
  });
});
