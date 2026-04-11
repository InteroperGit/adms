import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { OrderFormConsent } from './OrderFormConsent';
import type { OrderFormConsent as ConsentData } from '@/types/config/orderForms';

const mockConsent: ConsentData = {
  text: 'Я соглашаюсь с',
  links: [
    { label: 'Политикой конфиденциальности', href: '/privacy' },
    { label: 'Пользовательским соглашением', href: '/terms' },
  ],
  joiner: 'и',
};

function renderConsent(checked: boolean, onChange = vi.fn()) {
  return render(
    <MemoryRouter>
      <OrderFormConsent consent={mockConsent} checked={checked} onChange={onChange} />
    </MemoryRouter>
  );
}

describe('OrderFormConsent', () => {
  it('renders the consent text', () => {
    renderConsent(false);
    expect(screen.getByText('Я соглашаюсь с')).toBeInTheDocument();
  });

  it('renders all legal links', () => {
    renderConsent(false);
    expect(screen.getByRole('link', { name: 'Политикой конфиденциальности' })).toHaveAttribute(
      'href',
      '/privacy'
    );
    expect(screen.getByRole('link', { name: 'Пользовательским соглашением' })).toHaveAttribute(
      'href',
      '/terms'
    );
  });

  it('renders the checkbox', () => {
    renderConsent(false);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('checkbox reflects checked state', () => {
    renderConsent(true);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('checkbox reflects unchecked state', () => {
    renderConsent(false);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange when checkbox is clicked', async () => {
    const onChange = vi.fn();
    renderConsent(false, onChange);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
