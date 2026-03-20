import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Hello</Container>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('has max-width class', () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstChild).toHaveClass('max-w-7xl');
  });

  it('has mx-auto class for centering', () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstChild).toHaveClass('mx-auto');
  });

  it('accepts custom className', () => {
    const { container } = render(<Container className="custom-class">content</Container>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as div by default', () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('renders as specified element via as prop', () => {
    const { container } = render(<Container as="section">content</Container>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
