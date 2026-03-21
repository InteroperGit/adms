import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FooterSection } from './FooterSection';

describe('FooterSection', () => {
  it('renders section title', () => {
    render(
      <FooterSection title="Услуги">
        <li>Item 1</li>
      </FooterSection>
    );
    expect(screen.getByText('Услуги')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <FooterSection title="Навигация">
        <li>Главная</li>
        <li>О нас</li>
      </FooterSection>
    );
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('О нас')).toBeInTheDocument();
  });

  it('renders children inside a ul element', () => {
    render(
      <FooterSection title="Test">
        <li data-testid="child-item">Child</li>
      </FooterSection>
    );
    const item = screen.getByTestId('child-item');
    expect(item.closest('ul')).toBeInTheDocument();
  });

  it('applies default spacing class', () => {
    render(
      <FooterSection title="Test">
        <li>Item</li>
      </FooterSection>
    );
    const ul = screen.getByText('Item').closest('ul');
    expect(ul).toHaveClass('space-y-3');
  });

  it('applies custom spacing class when provided', () => {
    render(
      <FooterSection title="Test" spacing="space-y-6">
        <li>Item</li>
      </FooterSection>
    );
    const ul = screen.getByText('Item').closest('ul');
    expect(ul).toHaveClass('space-y-6');
  });
});
