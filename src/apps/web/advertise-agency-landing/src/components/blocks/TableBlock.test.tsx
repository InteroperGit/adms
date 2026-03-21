import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableBlock } from './TableBlock';

const baseBlock = {
  __component: 'table' as const,
  head: ['Name', 'Value', 'Status'],
  rows: [
    ['Item A', '100', 'Active'],
    ['Item B', '200', 'Inactive'],
    ['Item C', '300', 'Active'],
  ],
};

describe('TableBlock', () => {
  it('renders table headers', () => {
    render(<TableBlock block={baseBlock} />);
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Value').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
  });

  it('renders table rows', () => {
    render(<TableBlock block={baseBlock} />);
    expect(screen.getAllByText('Item A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Item B').length).toBeGreaterThan(0);
  });

  it('renders optional title when provided', () => {
    render(<TableBlock block={{ ...baseBlock, title: 'Pricing Table' }} />);
    expect(screen.getByText('Pricing Table')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    const { container } = render(<TableBlock block={baseBlock} />);
    expect(container.querySelector('h2')).not.toBeInTheDocument();
  });

  it('renders caption when provided', () => {
    render(<TableBlock block={{ ...baseBlock, caption: 'Table caption' }} />);
    expect(screen.getByText('Table caption')).toBeInTheDocument();
  });

  it('applies zebra-striping classes to even rows', () => {
    const { container } = render(<TableBlock block={baseBlock} />);
    const tbodyRows = container.querySelectorAll('tbody tr');
    // Even rows (index 0, 2) should have bg-card class
    expect(tbodyRows[0]).toHaveClass('bg-card');
  });

  it('renders total row in tfoot when provided', () => {
    const { container } = render(
      <TableBlock block={{ ...baseBlock, total: ['Total', '600', ''] }} />
    );
    expect(container.querySelector('tfoot')).toBeInTheDocument();
  });
});
