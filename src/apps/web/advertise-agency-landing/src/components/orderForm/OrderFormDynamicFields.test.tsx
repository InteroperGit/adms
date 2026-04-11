import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderFormDynamicFields } from './OrderFormDynamicFields';
import type { FormFieldDefinition } from '@/types/config/orderForms';

const fields: FormFieldDefinition[] = [
  { key: 'name', type: 'text', label: 'Имя', placeholder: 'Введите имя' },
  { key: 'urgent', type: 'checkbox', label: 'Срочный заказ' },
  {
    key: 'size',
    type: 'select',
    label: 'Размер',
    options: [
      { value: 'sm', label: 'Маленький' },
      { value: 'lg', label: 'Большой' },
    ],
  },
];

describe('OrderFormDynamicFields', () => {
  it('renders all fields from definitions', () => {
    render(<OrderFormDynamicFields fields={fields} values={{}} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByText('Срочный заказ')).toBeInTheDocument();
    expect(screen.getByLabelText('Размер')).toBeInTheDocument();
  });

  it('passes current values to each field', () => {
    render(
      <OrderFormDynamicFields
        fields={fields}
        values={{ name: 'Иван', urgent: false, size: 'sm' }}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Имя')).toHaveValue('Иван');
    expect(screen.getByRole('combobox')).toHaveValue('sm');
  });

  it('defaults checkbox value to false when not in values', () => {
    render(<OrderFormDynamicFields fields={fields} values={{}} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('defaults text value to empty string when not in values', () => {
    render(<OrderFormDynamicFields fields={fields} values={{}} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Имя')).toHaveValue('');
  });

  it('renders nothing when fields array is empty', () => {
    const { container } = render(
      <OrderFormDynamicFields fields={[]} values={{}} onChange={vi.fn()} />
    );
    expect(container.querySelectorAll('input, select, textarea')).toHaveLength(0);
  });
});
