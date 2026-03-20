import { render, screen } from '@testing-library/react';
import { FadeInSection } from './FadeInSection';
import { useFadeIn } from '@/hooks';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';

// Mock the useFadeIn hook
vi.mock('@/hooks/useFadeIn', () => ({
  useFadeIn: vi.fn(),
}));

describe('FadeInSection', () => {
  beforeEach(() => {
    (useFadeIn as MockedFunction<typeof useFadeIn>).mockReturnValue({
      ref: { current: null },
      isVisible: false,
    });
  });

  it('renders children', () => {
    render(
      <FadeInSection>
        <div>Test Children</div>
      </FadeInSection>
    );
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('applies id attribute when provided', () => {
    render(
      <FadeInSection id="test-id" data-testid="fade-in-section-container">
        <div>Test Children</div>
      </FadeInSection>
    );
    expect(screen.getByTestId('fade-in-section-container')).toHaveAttribute('id', 'test-id');
  });

  it('applies custom className to the section element', () => {
    render(
      <FadeInSection className="custom-section-class" data-testid="fade-in-section-container">
        <div>Test Children</div>
      </FadeInSection>
    );
    expect(screen.getByTestId('fade-in-section-container')).toHaveClass('custom-section-class');
  });

  it('applies "fade-in-section" class to the inner div', () => {
    render(
      <FadeInSection>
        <div>Test Children</div>
      </FadeInSection>
    );
    const innerDiv = screen.getByTestId('fade-in-content');
    expect(innerDiv).toHaveClass('fade-in-section');
  });

  it('applies "is-visible" class to the inner div when isVisible is true', () => {
    (useFadeIn as MockedFunction<typeof useFadeIn>).mockReturnValue({
      ref: { current: null },
      isVisible: true,
    });
    render(
      <FadeInSection>
        <div>Test Children</div>
      </FadeInSection>
    );
    const innerDiv = screen.getByTestId('fade-in-content');
    expect(innerDiv).toHaveClass('is-visible');
  });

  it('does not apply "is-visible" class to the inner div when isVisible is false', () => {
    render(
      <FadeInSection>
        <div>Test Children</div>
      </FadeInSection>
    );
    const innerDiv = screen.getByTestId('fade-in-content');
    expect(innerDiv).not.toHaveClass('is-visible');
  });
});
