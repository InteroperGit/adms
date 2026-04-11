import { render, screen } from '@testing-library/react';
import { ItemCard } from './ItemCard';
import { describe, it, expect } from 'vitest';

describe('ItemCard', () => {
  // 1. Rendering with Basic Content
  it('renders its children content correctly', () => {
    render(
      <ItemCard>
        <div>Test Content</div>
      </ItemCard>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  // 2. Applying Custom Class Names
  it("applies additional className props to the card's root element", () => {
    render(
      <ItemCard className="custom-card" data-testid="item-card">
        <div>Content</div>
      </ItemCard>
    );
    const card = screen.getByTestId('item-card');
    expect(card).toHaveClass('custom-card');
  });

  // Check for default classes
  it('applies default base classes', () => {
    render(
      <ItemCard data-testid="item-card">
        <div>Content</div>
      </ItemCard>
    );
    const card = screen.getByTestId('item-card');
    expect(card).toHaveClass('group');
    expect(card).toHaveClass('relative');
    expect(card).toHaveClass('rounded-2xl');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-card');
  });

  // 3. Hover State - Visual Changes (checking classes)
  it('applies hover-specific classes for visual changes', () => {
    render(
      <ItemCard data-testid="item-card">
        <div>Hover me</div>
      </ItemCard>
    );
    const card = screen.getByTestId('item-card');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('duration-300');
    expect(card).toHaveClass('hover:-translate-y-1');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('hover:border-primary/30');
    expect(card).toHaveClass('dark:hover:border-primary/50');
  });

  // 4. Dark Mode - Border Color (already covered by dark:hover:border-primary/50 test)

  // 5. Passing Through Additional Props
  it('ensures additional HTML attributes are passed to the root div element', () => {
    render(
      <ItemCard id="my-card" data-testid="item-card-test">
        <div>Content</div>
      </ItemCard>
    );
    const card = screen.getByTestId('item-card-test');
    expect(card).toHaveAttribute('id', 'my-card');
    expect(card).toHaveAttribute('data-testid', 'item-card-test');
  });
});
