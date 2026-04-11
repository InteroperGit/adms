import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderFormCustomerFields } from './OrderFormCustomerFields';
import type { FormFieldDefinition } from '@/types/config/orderForms';

const customerFields: FormFieldDefinition[] = [
  { key: 'name', type: 'text', label: 'Имя', required: true },
  { key: 'phone', type: 'text', label: 'Телефон', placeholder: '+7 (___) ___-__-__' },
  { key: 'email', type: 'text', label: 'Email', placeholder: 'example@mail.ru' },
];

describe('OrderFormCustomerFields', () => {
  it('renders the "Контактные данные" heading', () => {
    render(<OrderFormCustomerFields fields={customerFields} values={{}} onChange={vi.fn()} />);
    expect(screen.getByText('Контактные данные')).toBeInTheDocument();
  });

  it('renders all customer fields', () => {
    render(<OrderFormCustomerFields fields={customerFields} values={{}} onChange={vi.fn()} />);
    expect(screen.getByLabelText(/Имя/)).toBeInTheDocument();
    expect(screen.getByLabelText('Телефон')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('passes values to rendered fields', () => {
    render(
      <OrderFormCustomerFields
        fields={customerFields}
        values={{ name: 'Мария', phone: '+79001234567', email: 'test@example.com' }}
        onChange={vi.fn()}
      />
    );
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('Мария');
    expect(inputs[1]).toHaveValue('+79001234567');
    expect(inputs[2]).toHaveValue('test@example.com');
  });

  it('renders a separator element', () => {
    const { container } = render(
      <OrderFormCustomerFields fields={customerFields} values={{}} onChange={vi.fn()} />
    );
    expect(container.querySelector('[data-orientation="horizontal"]')).toBeInTheDocument();
  });
});
