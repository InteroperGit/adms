import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/libs/resolveColor', () => ({
  resolveListItemStyles: () => ({
    bgStyle: undefined,
    textStyle: undefined,
    textClass: 'text-muted-foreground leading-relaxed',
  }),
}));

import { ChecklistBlock } from './ChecklistBlock';

const baseBlock = {
  __component: 'list' as const,
  style: 'checklist' as const,
  items: ['Done task', 'Another task', 'Third task'],
};

describe('ChecklistBlock', () => {
  it('renders a <ul> element', () => {
    const { container } = render(<ChecklistBlock block={baseBlock} />);
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('renders the correct number of list items', () => {
    render(<ChecklistBlock block={baseBlock} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('renders the item text content', () => {
    render(<ChecklistBlock block={baseBlock} />);
    expect(screen.getByText('Done task')).toBeInTheDocument();
    expect(screen.getByText('Another task')).toBeInTheDocument();
    expect(screen.getByText('Third task')).toBeInTheDocument();
  });

  it('renders an SVG check icon for each item', () => {
    const { container } = render(<ChecklistBlock block={baseBlock} />);
    const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgs).toHaveLength(3);
  });

  it('each check icon has a circle and a checkmark path', () => {
    const { container } = render(<ChecklistBlock block={baseBlock} />);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach((svg) => {
      expect(svg.querySelector('circle')).toBeInTheDocument();
      expect(svg.querySelector('path')).toBeInTheDocument();
    });
  });

  it('check icon circle has fill-primary/15 class', () => {
    const { container } = render(<ChecklistBlock block={baseBlock} />);
    const circles = container.querySelectorAll('circle');
    circles.forEach((circle) => {
      expect(circle.classList.contains('fill-primary/15')).toBe(true);
    });
  });

  it('check icon path has stroke-primary class', () => {
    const { container } = render(<ChecklistBlock block={baseBlock} />);
    const paths = container.querySelectorAll('path');
    paths.forEach((path) => {
      expect(path.classList.contains('stroke-primary')).toBe(true);
    });
  });

  it('renders empty list when items array is empty', () => {
    const block = { ...baseBlock, items: [] };
    render(<ChecklistBlock block={block} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
