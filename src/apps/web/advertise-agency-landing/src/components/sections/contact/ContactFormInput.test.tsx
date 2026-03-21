import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactFormInput } from './ContactFormInput';

const baseProps = {
  id: 'name',
  label: 'Ваше имя',
  placeholder: 'Введите имя',
  value: '',
  onChange: vi.fn(),
  onBlur: vi.fn(),
};

describe('ContactFormInput', () => {
  beforeEach(() => {
    baseProps.onChange.mockClear();
    baseProps.onBlur.mockClear();
  });

  it('renders input with label', () => {
    render(<ContactFormInput {...baseProps} />);
    expect(screen.getByLabelText('Ваше имя')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите имя')).toBeInTheDocument();
  });

  it('renders current value', () => {
    render(<ContactFormInput {...baseProps} value="John" />);
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<ContactFormInput {...baseProps} error="Обязательное поле" />);
    expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
  });

  it('does not show error message when error is absent', () => {
    render(<ContactFormInput {...baseProps} />);
    expect(screen.queryByRole('paragraph', { name: /ошибка/i })).not.toBeInTheDocument();
  });

  it('applies aria-invalid when error is present', () => {
    render(<ContactFormInput {...baseProps} error="Ошибка" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<ContactFormInput {...baseProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('calls onChange with new value when user types', async () => {
    render(<ContactFormInput {...baseProps} />);
    await userEvent.type(screen.getByRole('textbox'), 'A');
    expect(baseProps.onChange).toHaveBeenCalledWith('A');
  });

  it('calls onBlur when input loses focus', async () => {
    render(<ContactFormInput {...baseProps} />);
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.tab();
    expect(baseProps.onBlur).toHaveBeenCalledOnce();
  });
});
