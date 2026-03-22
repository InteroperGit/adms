import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/libs/resolveColor', () => ({
  resolveListItemStyles: () => ({
    bgStyle: undefined,
    textStyle: undefined,
    textClass: 'text-muted-foreground leading-relaxed',
  }),
}));

import { OrderedListBlock } from './OrderedListBlock';

const baseBlock = {
  __component: 'list' as const,
  style: 'ordered' as const,
  items: ['First item', 'Second item', 'Third item'],
};

describe('OrderedListBlock', () => {
  it('renders an <ol> element', () => {
    const { container } = render(<OrderedListBlock block={baseBlock} />);
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('renders the correct number of list items', () => {
    render(<OrderedListBlock block={baseBlock} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('renders the item text content', () => {
    render(<OrderedListBlock block={baseBlock} />);
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('renders sequential number markers (1., 2., 3.)', () => {
    const { container } = render(<OrderedListBlock block={baseBlock} />);
    const numbers = container.querySelectorAll('span.font-semibold');
    expect(numbers).toHaveLength(3);
    expect(numbers[0].textContent).toBe('1.');
    expect(numbers[1].textContent).toBe('2.');
    expect(numbers[2].textContent).toBe('3.');
  });

  it('renders empty list when items array is empty', () => {
    const block = { ...baseBlock, items: [] };
    render(<OrderedListBlock block={block} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
