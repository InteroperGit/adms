import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OrderFormField } from './OrderFormField';
import type { FormFieldDefinition } from '@/types/config/orderForms';

const textField: FormFieldDefinition = {
  key: 'name',
  type: 'text',
  label: 'Имя',
  placeholder: 'Введите имя',
  required: true,
};

const numberField: FormFieldDefinition = {
  key: 'qty',
  type: 'number',
  label: 'Количество',
  min: 1,
  max: 100,
};

const selectField: FormFieldDefinition = {
  key: 'size',
  type: 'select',
  label: 'Размер',
  options: [
    { value: 'sm', label: 'Маленький' },
    { value: 'lg', label: 'Большой' },
  ],
};

const radioField: FormFieldDefinition = {
  key: 'format',
  type: 'radio',
  label: 'Формат',
  required: true,
  options: [
    { value: 'print', label: 'Печать' },
    { value: 'digital', label: 'Цифровой' },
  ],
};

const checkboxField: FormFieldDefinition = {
  key: 'urgent',
  type: 'checkbox',
  label: 'Срочный заказ',
};

const textareaField: FormFieldDefinition = {
  key: 'comment',
  type: 'textarea',
  label: 'Комментарий',
  placeholder: 'Напишите здесь',
};

describe('OrderFormField', () => {
  describe('text type', () => {
    it('renders a text input with label', () => {
      render(<OrderFormField field={textField} value="" onChange={vi.fn()} />);
      expect(screen.getByLabelText(/Имя/)).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('shows required asterisk', () => {
      render(<OrderFormField field={textField} value="" onChange={vi.fn()} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('calls onChange on input', async () => {
      const onChange = vi.fn();
      render(<OrderFormField field={textField} value="" onChange={onChange} />);
      await userEvent.type(screen.getByRole('textbox'), 'Иван');
      expect(onChange).toHaveBeenCalledWith('name', expect.any(String));
    });
  });

  describe('number type', () => {
    it('renders a number input with label', () => {
      render(<OrderFormField field={numberField} value="1" onChange={vi.fn()} />);
      expect(screen.getByLabelText('Количество')).toBeInTheDocument();
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });
  });

  describe('select type', () => {
    it('renders a select with label and options', () => {
      render(<OrderFormField field={selectField} value="" onChange={vi.fn()} />);
      expect(screen.getByLabelText('Размер')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Маленький')).toBeInTheDocument();
      expect(screen.getByText('Большой')).toBeInTheDocument();
    });

    it('calls onChange when selection changes', async () => {
      const onChange = vi.fn();
      render(<OrderFormField field={selectField} value="" onChange={onChange} />);
      await userEvent.selectOptions(screen.getByRole('combobox'), 'lg');
      expect(onChange).toHaveBeenCalledWith('size', 'lg');
    });
  });

  describe('radio type', () => {
    it('renders radio buttons with fieldset legend', () => {
      render(<OrderFormField field={radioField} value="" onChange={vi.fn()} />);
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByText('Формат')).toBeInTheDocument();
      expect(screen.getByLabelText('Печать')).toHaveAttribute('type', 'radio');
      expect(screen.getByLabelText('Цифровой')).toHaveAttribute('type', 'radio');
    });

    it('calls onChange when radio is selected', async () => {
      const onChange = vi.fn();
      render(<OrderFormField field={radioField} value="" onChange={onChange} />);
      await userEvent.click(screen.getByLabelText('Цифровой'));
      expect(onChange).toHaveBeenCalledWith('format', 'digital');
    });
  });

  describe('checkbox type', () => {
    it('renders a checkbox with label', () => {
      render(<OrderFormField field={checkboxField} value={false} onChange={vi.fn()} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Срочный заказ')).toBeInTheDocument();
    });

    it('calls onChange with boolean when clicked', async () => {
      const onChange = vi.fn();
      render(<OrderFormField field={checkboxField} value={false} onChange={onChange} />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith('urgent', true);
    });
  });

  describe('textarea type', () => {
    it('renders a textarea with label', () => {
      render(<OrderFormField field={textareaField} value="" onChange={vi.fn()} />);
      expect(screen.getByLabelText('Комментарий')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls onChange on textarea input', async () => {
      const onChange = vi.fn();
      render(<OrderFormField field={textareaField} value="" onChange={onChange} />);
      await userEvent.type(screen.getByRole('textbox'), 'Тест');
      expect(onChange).toHaveBeenCalled();
    });
  });
});
