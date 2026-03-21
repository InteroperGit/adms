import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ParagraphBlock } from './ParagraphBlock';

describe('ParagraphBlock', () => {
  it('renders paragraph with plain text', () => {
    render(<ParagraphBlock block={{ __component: 'paragraph', text: 'Hello world' }} />);
    const el = screen.getByText('Hello world');
    expect(el.tagName).toBe('P');
  });

  it('renders HTML via dangerouslySetInnerHTML', () => {
    const { container } = render(
      <ParagraphBlock block={{ __component: 'paragraph', text: 'Hello <strong>world</strong>' }} />
    );
    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.querySelector('strong')!.textContent).toBe('world');
  });

  it('applies text-center class when align is center', () => {
    const { container } = render(
      <ParagraphBlock block={{ __component: 'paragraph', text: 'centered', align: 'center' }} />
    );
    expect(container.querySelector('p')).toHaveClass('text-center');
  });

  it('applies text-left class when align is left', () => {
    const { container } = render(
      <ParagraphBlock block={{ __component: 'paragraph', text: 'left', align: 'left' }} />
    );
    expect(container.querySelector('p')).toHaveClass('text-left');
  });

  it('defaults to text-left when align is not specified', () => {
    const { container } = render(
      <ParagraphBlock block={{ __component: 'paragraph', text: 'default' }} />
    );
    expect(container.querySelector('p')).toHaveClass('text-left');
  });
});
