import { render, screen } from '@testing-library/react';
import { SectionDivider } from './SectionDivider';
import { describe, it, expect } from 'vitest';

describe('SectionDivider', () => {
  it('renders SVG with correct background and fill colors for bg-to-muted variant', () => {
    render(<SectionDivider variant="bg-to-muted" data-testid="section-divider-svg" />);
    const divElement = screen.getByTestId('section-divider-svg').closest('div');
    expect(divElement).toHaveStyle('background: hsl(var(--background))');

    const svgPath = screen.getByTestId('section-divider-svg').querySelector('path');
    expect(svgPath).toHaveAttribute('fill', 'hsl(var(--muted))');
  });

  it('renders SVG with correct background and fill colors for primary-to-bg variant', () => {
    render(<SectionDivider variant="primary-to-bg" data-testid="section-divider-svg" />);
    const divElement = screen.getByTestId('section-divider-svg').closest('div');
    expect(divElement).toHaveStyle('background: hsl(var(--primary))');

    const svgPath = screen.getByTestId('section-divider-svg').querySelector('path');
    expect(svgPath).toHaveAttribute('fill', 'hsl(var(--background))');
  });

  it('renders wave shape by default', () => {
    render(<SectionDivider variant="bg-to-muted" data-testid="section-divider-svg" />);
    const svgPath = screen.getByTestId('section-divider-svg').querySelector('path');
    expect(svgPath).toHaveAttribute('d', 'M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z');
  });

  it('renders slant shape when specified', () => {
    render(
      <SectionDivider variant="bg-to-muted" shape="slant" data-testid="section-divider-svg" />
    );
    const svgPath = screen.getByTestId('section-divider-svg').querySelector('path');
    expect(svgPath).toHaveAttribute('d', 'M0,64 L1440,0 L1440,64 Z');
  });

  it('renders curve shape when specified', () => {
    render(
      <SectionDivider variant="bg-to-muted" shape="curve" data-testid="section-divider-svg" />
    );
    const svgPath = screen.getByTestId('section-divider-svg').querySelector('path');
    expect(svgPath).toHaveAttribute('d', 'M0,48 Q720,0 1440,48 L1440,64 L0,64 Z');
  });

  it('applies flipX class when flipX is true', () => {
    render(<SectionDivider variant="bg-to-muted" flipX data-testid="section-divider-svg" />);
    const svgElement = screen.getByTestId('section-divider-svg');
    expect(svgElement).toHaveClass('-scale-x-100');
  });

  it('merges custom className', () => {
    render(
      <SectionDivider
        variant="bg-to-muted"
        className="custom-class"
        data-testid="section-divider-svg"
      />
    );
    const divElement = screen.getByTestId('section-divider-svg').closest('div');
    expect(divElement).toHaveClass('custom-class');
  });
});
