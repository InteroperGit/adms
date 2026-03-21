import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactFormTextarea } from './ContactFormTextarea';

const baseProps = {
  id: 'message',
  label: 'Сообщение',
  placeholder: 'Введите сообщение',
  value: '',
  onChange: vi.fn(),
  onBlur: vi.fn(),
};

describe('ContactFormTextarea', () => {
  beforeEach(() => {
    baseProps.onChange.mockClear();
    baseProps.onBlur.mockClear();
  });

  it('renders textarea with label', () => {
    render(<ContactFormTextarea {...baseProps} />);
    expect(screen.getByLabelText('Сообщение')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите сообщение')).toBeInTheDocument();
  });

  it('renders current value', () => {
    render(<ContactFormTextarea {...baseProps} value="Hello" />);
    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<ContactFormTextarea {...baseProps} error="Слишком коротко" />);
    expect(screen.getByText('Слишком коротко')).toBeInTheDocument();
  });

  it('does not show error when error is absent', () => {
    const { container } = render(<ContactFormTextarea {...baseProps} />);
    expect(container.querySelector('[id$="-error"]')).not.toBeInTheDocument();
  });

  it('applies aria-invalid when error is present', () => {
    render(<ContactFormTextarea {...baseProps} error="Ошибка" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<ContactFormTextarea {...baseProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('uses default rows=5 when rows prop is not provided', () => {
    render(<ContactFormTextarea {...baseProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('uses custom rows when provided', () => {
    render(<ContactFormTextarea {...baseProps} rows={8} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  });

  it('calls onChange with new value when user types', async () => {
    render(<ContactFormTextarea {...baseProps} />);
    await userEvent.type(screen.getByRole('textbox'), 'X');
    expect(baseProps.onChange).toHaveBeenCalledWith('X');
  });

  it('calls onBlur when textarea loses focus', async () => {
    render(<ContactFormTextarea {...baseProps} />);
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.tab();
    expect(baseProps.onBlur).toHaveBeenCalledOnce();
  });
});
