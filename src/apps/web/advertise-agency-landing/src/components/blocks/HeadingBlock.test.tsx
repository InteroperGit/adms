import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeadingBlock } from './HeadingBlock';

describe('HeadingBlock', () => {
  it('renders h2 with correct text and font size class', () => {
    render(<HeadingBlock block={{ __component: 'heading', level: 2, text: 'Section Title' }} />);
    const el = screen.getByRole('heading', { level: 2, name: 'Section Title' });
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('text-2xl');
  });

  it('renders h3 with correct text and font size class', () => {
    render(<HeadingBlock block={{ __component: 'heading', level: 3, text: 'Sub Title' }} />);
    const el = screen.getByRole('heading', { level: 3, name: 'Sub Title' });
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('text-xl');
  });

  it('renders h4 with correct text and font size class', () => {
    render(<HeadingBlock block={{ __component: 'heading', level: 4, text: 'Minor Title' }} />);
    const el = screen.getByRole('heading', { level: 4, name: 'Minor Title' });
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('text-lg');
  });

  it('applies font-heading class', () => {
    render(<HeadingBlock block={{ __component: 'heading', level: 2, text: 'Test' }} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('font-heading');
  });
});
