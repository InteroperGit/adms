import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/types/sections/contact/contact', () => ({
  contactContent: {
    form: {
      name: { label: 'Имя', placeholder: 'Введите имя' },
      contact: { label: 'Контакт', placeholder: 'Email или телефон' },
      message: { label: 'Сообщение', placeholder: 'Ваше сообщение' },
      consent: 'Я согласен с',
      consentLinks: [{ label: 'политикой', href: '/privacy' }],
      consentJoiner: 'и',
      submit: 'Отправить',
      sending: 'Отправляем...',
      disclaimer: 'Мы не спамим',
      success: { title: 'Отправлено!', text: 'Скоро свяжемся', reset: 'Отправить ещё' },
    },
  },
}));

vi.mock('@/types/shared/iconMap', () => ({
  resolveIcon: () => null,
}));

vi.mock('./ContactFormFields', () => ({
  ContactFormFields: ({
    form,
    onChange,
  }: {
    form: { name: string; contact: string; message: string };
    onChange: (field: string, value: string) => void;
  }) => (
    <div>
      <input
        data-testid="name-input"
        value={form.name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <input
        data-testid="contact-input"
        value={form.contact}
        onChange={(e) => onChange('contact', e.target.value)}
      />
      <textarea
        data-testid="message-input"
        value={form.message}
        onChange={(e) => onChange('message', e.target.value)}
      />
    </div>
  ),
}));

vi.mock('./ContactConsent', () => ({
  ContactConsent: ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <input
      type="checkbox"
      data-testid="consent-checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  ),
}));

vi.mock('./ContactSuccess', () => ({
  ContactSuccess: ({ onReset }: { onReset: () => void }) => (
    <div data-testid="success-state">
      <button onClick={onReset}>Отправить ещё</button>
    </div>
  ),
}));

import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders form fields initially', () => {
    render(<ContactForm />);
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('contact-input')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ContactForm />);
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeInTheDocument();
  });

  it('submit button is disabled when consent is not checked', () => {
    render(<ContactForm />);
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
  });

  it('submit button is enabled when consent is checked', () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByTestId('consent-checkbox'));
    expect(screen.getByRole('button', { name: 'Отправить' })).not.toBeDisabled();
  });

  it('renders disclaimer text', () => {
    render(<ContactForm />);
    expect(screen.getByText('Мы не спамим')).toBeInTheDocument();
  });

  it('does not show success state initially', () => {
    render(<ContactForm />);
    expect(screen.queryByTestId('success-state')).not.toBeInTheDocument();
  });

  it('shows loading state immediately after valid submission', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Иван Иванов' } });
    fireEvent.change(screen.getByTestId('contact-input'), {
      target: { value: 'ivan@example.com' },
    });
    fireEvent.change(screen.getByTestId('message-input'), {
      target: { value: 'Текст сообщения длиннее 10 символов' },
    });
    fireEvent.click(screen.getByTestId('consent-checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
    expect(screen.getByText('Отправляем...')).toBeInTheDocument();
  });

  it('shows success state after 1200ms', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Иван Иванов' } });
    fireEvent.change(screen.getByTestId('contact-input'), {
      target: { value: 'ivan@example.com' },
    });
    fireEvent.change(screen.getByTestId('message-input'), {
      target: { value: 'Текст сообщения длиннее 10 символов' },
    });
    fireEvent.click(screen.getByTestId('consent-checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByTestId('success-state')).toBeInTheDocument();
  });

  it('resets to form after clicking reset in success state', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Иван Иванов' } });
    fireEvent.change(screen.getByTestId('contact-input'), {
      target: { value: 'ivan@example.com' },
    });
    fireEvent.change(screen.getByTestId('message-input'), {
      target: { value: 'Текст сообщения длиннее 10 символов' },
    });
    fireEvent.click(screen.getByTestId('consent-checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Отправить ещё' }));
    expect(screen.queryByTestId('success-state')).not.toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
  });

  it('does not submit when form fields are empty', () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByTestId('consent-checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.queryByTestId('success-state')).not.toBeInTheDocument();
  });
});
