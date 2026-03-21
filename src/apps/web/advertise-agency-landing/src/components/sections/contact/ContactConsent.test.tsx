import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

vi.mock('@/types/sections/contact/contact', () => ({
  contactContent: {
    form: {
      consent: 'Я согласен с',
      consentLinks: [
        { label: 'Политикой конфиденциальности', href: '/privacy' },
        { label: 'Пользовательским соглашением', href: '/agreement' },
      ],
      consentJoiner: 'и',
    },
  },
}));

import { ContactConsent } from './ContactConsent';

function renderConsent(checked = false, onChange = vi.fn()) {
  return render(
    <MemoryRouter>
      <ContactConsent checked={checked} onChange={onChange} />
    </MemoryRouter>
  );
}

describe('ContactConsent', () => {
  it('renders checkbox', () => {
    renderConsent();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('checkbox reflects unchecked state', () => {
    renderConsent(false);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('checkbox reflects checked state', () => {
    renderConsent(true);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onChange with true when checkbox is toggled', () => {
    const onChange = vi.fn();
    renderConsent(false, onChange);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('renders consent text', () => {
    renderConsent();
    expect(screen.getByText(/Я согласен с/)).toBeInTheDocument();
  });

  it('renders first legal link', () => {
    renderConsent();
    const link = screen.getByRole('link', { name: 'Политикой конфиденциальности' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/privacy');
  });

  it('renders second legal link', () => {
    renderConsent();
    const link = screen.getByRole('link', { name: 'Пользовательским соглашением' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/agreement');
  });
});
