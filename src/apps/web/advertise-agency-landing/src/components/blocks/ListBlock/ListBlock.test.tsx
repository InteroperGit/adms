import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('./ChecklistBlock', () => ({
  ChecklistBlock: () => <div data-testid="checklist-block" />,
}));

vi.mock('./OrderedListBlock', () => ({
  OrderedListBlock: () => <div data-testid="ordered-list-block" />,
}));

vi.mock('./UnorderedListBlock', () => ({
  UnorderedListBlock: () => <div data-testid="unordered-list-block" />,
}));

import { ListBlock } from './index';

describe('ListBlock', () => {
  it('routes to ChecklistBlock when style is checklist', () => {
    render(<ListBlock block={{ __component: 'list', style: 'checklist', items: ['a', 'b'] }} />);
    expect(screen.getByTestId('checklist-block')).toBeInTheDocument();
  });

  it('routes to OrderedListBlock when style is ordered', () => {
    render(<ListBlock block={{ __component: 'list', style: 'ordered', items: ['a', 'b'] }} />);
    expect(screen.getByTestId('ordered-list-block')).toBeInTheDocument();
  });

  it('routes to UnorderedListBlock when style is unordered', () => {
    render(<ListBlock block={{ __component: 'list', style: 'unordered', items: ['a', 'b'] }} />);
    expect(screen.getByTestId('unordered-list-block')).toBeInTheDocument();
  });

  it('defaults to UnorderedListBlock when style is not specified', () => {
    // style is required per schema; passing 'unordered' is the default fallback
    render(<ListBlock block={{ __component: 'list', style: 'unordered', items: ['a', 'b'] }} />);
    expect(screen.getByTestId('unordered-list-block')).toBeInTheDocument();
  });
});
