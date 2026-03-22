import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/libs/resolveColor', () => ({
  resolveListItemStyles: () => ({
    bgStyle: undefined,
    textStyle: undefined,
    textClass: 'text-muted-foreground leading-relaxed',
  }),
}));

import { UnorderedListBlock } from './UnorderedListBlock';

const baseBlock = {
  __component: 'list' as const,
  style: 'unordered' as const,
  items: ['First item', 'Second item', 'Third item'],
};

describe('UnorderedListBlock', () => {
  it('renders a <ul> element', () => {
    const { container } = render(<UnorderedListBlock block={baseBlock} />);
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('renders the correct number of list items', () => {
    render(<UnorderedListBlock block={baseBlock} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('renders the item text content', () => {
    render(<UnorderedListBlock block={baseBlock} />);
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('renders bullet markers for each item', () => {
    const { container } = render(<UnorderedListBlock block={baseBlock} />);
    const bullets = container.querySelectorAll('span.font-semibold');
    expect(bullets).toHaveLength(3);
    bullets.forEach((b) => expect(b.textContent).toBe('•'));
  });

  it('renders empty list when items array is empty', () => {
    const block = { ...baseBlock, items: [] };
    render(<UnorderedListBlock block={block} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
