import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/contact/contact', () => ({
  contactContent: {
    form: {
      name: { label: 'Имя', placeholder: 'Введите имя' },
      contact: { label: 'Контакт', placeholder: 'Email или телефон' },
      message: { label: 'Сообщение', placeholder: 'Ваше сообщение' },
    },
  },
}));

vi.mock('./ContactFormInput', () => ({
  ContactFormInput: ({ id, label }: { id: string; label: string }) => (
    <input data-testid={`input-${id}`} aria-label={label} />
  ),
}));

vi.mock('./ContactFormTextarea', () => ({
  ContactFormTextarea: ({ id, label }: { id: string; label: string }) => (
    <textarea data-testid={`textarea-${id}`} aria-label={label} />
  ),
}));

import { ContactFormFields } from './ContactFormFields';
import type { FormState } from './ContactFormFields';

const emptyForm: FormState = { name: '', contact: '', message: '' };

describe('ContactFormFields', () => {
  it('renders name input', () => {
    render(
      <ContactFormFields form={emptyForm} errors={emptyForm} onChange={vi.fn()} onBlur={vi.fn()} />
    );
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
  });

  it('renders contact input', () => {
    render(
      <ContactFormFields form={emptyForm} errors={emptyForm} onChange={vi.fn()} onBlur={vi.fn()} />
    );
    expect(screen.getByTestId('input-contact')).toBeInTheDocument();
  });

  it('renders message textarea', () => {
    render(
      <ContactFormFields form={emptyForm} errors={emptyForm} onChange={vi.fn()} onBlur={vi.fn()} />
    );
    expect(screen.getByTestId('textarea-message')).toBeInTheDocument();
  });

  it('passes correct labels from content', () => {
    render(
      <ContactFormFields form={emptyForm} errors={emptyForm} onChange={vi.fn()} onBlur={vi.fn()} />
    );
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Контакт')).toBeInTheDocument();
    expect(screen.getByLabelText('Сообщение')).toBeInTheDocument();
  });
});
