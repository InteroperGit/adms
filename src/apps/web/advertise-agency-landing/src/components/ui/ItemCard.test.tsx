import { render, screen } from '@testing-library/react';
import { ItemCard } from './ItemCard';

describe('ItemCard', () => {
  it('renders children', () => {
    render(<ItemCard>Card Content</ItemCard>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ItemCard className="custom-item-card">Custom Card</ItemCard>);
    expect(screen.getByText('Custom Card')).toHaveClass('custom-item-card');
  });

  it('has the group class', () => {
    render(<ItemCard>Group Card</ItemCard>);
    expect(screen.getByText('Group Card')).toHaveClass('group');
  });

  it('applies hover classes', () => {
    render(<ItemCard>Hover Card</ItemCard>);
    const card = screen.getByText('Hover Card');
    expect(card).toHaveClass('hover:-translate-y-1');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('hover:border-primary/30');
  });
});
