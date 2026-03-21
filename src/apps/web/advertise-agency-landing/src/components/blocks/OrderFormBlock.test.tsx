import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/config/orderForms', () => ({
  orderFormsData: {
    forms: {
      consultation: {
        id: 'consultation',
        title: 'Consultation Form',
        fields: [],
        trustBadges: [
          { icon: 'Shield', label: 'Secure' },
          { icon: 'Clock', label: 'Fast' },
        ],
      },
    },
  },
}));

vi.mock('@/components/ui/orderForm', () => ({
  OrderForm: ({ definition }: { definition: { id: string } }) => (
    <div data-testid="order-form" data-form-id={definition.id} />
  ),
}));

vi.mock('@/types/shared/iconMap', () => ({
  resolveIcon:
    () =>
    ({ size, className }: { size: number; className: string }) => (
      <svg data-testid="trust-badge-icon" data-size={size} className={className} />
    ),
}));

import { OrderFormBlock } from './OrderFormBlock';

describe('OrderFormBlock', () => {
  it('renders mobile and desktop form views for known formId', () => {
    render(<OrderFormBlock block={{ __component: 'order-form', formId: 'consultation' }} />);
    expect(screen.getAllByTestId('order-form')).toHaveLength(2);
  });

  it('renders form with correct formId', () => {
    render(<OrderFormBlock block={{ __component: 'order-form', formId: 'consultation' }} />);
    const forms = screen.getAllByTestId('order-form');
    expect(forms[0]).toHaveAttribute('data-form-id', 'consultation');
  });

  it('returns null for unknown formId', () => {
    const { container } = render(
      <OrderFormBlock block={{ __component: 'order-form', formId: 'nonexistent' }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title in mobile view when provided', () => {
    render(
      <OrderFormBlock
        block={{ __component: 'order-form', formId: 'consultation', title: 'Get Started' }}
      />
    );
    expect(screen.getAllByText('Get Started').length).toBeGreaterThan(0);
  });

  it('renders trust badges in desktop view', () => {
    render(<OrderFormBlock block={{ __component: 'order-form', formId: 'consultation' }} />);
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
  });
});
