import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/types/config/errorFallback', () => ({
  errorFallbackContent: {
    title: 'Что-то пошло не так',
    description: 'Произошла ошибка при загрузке страницы',
    resetLabel: 'Попробовать снова',
  },
}));

import { ErrorFallback } from './ErrorFallback';

describe('ErrorFallback', () => {
  it('renders the error title', () => {
    render(<ErrorFallback />);
    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
  });

  it('renders the error description', () => {
    render(<ErrorFallback />);
    expect(screen.getByText('Произошла ошибка при загрузке страницы')).toBeInTheDocument();
  });

  it('renders the reset button with correct label', () => {
    render(<ErrorFallback />);
    expect(screen.getByRole('button', { name: 'Попробовать снова' })).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const onReset = vi.fn();
    render(<ErrorFallback onReset={onReset} />);
    await userEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('navigates to homepage when no onReset provided', async () => {
    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { href: originalHref },
      writable: true,
      configurable: true,
    });

    render(<ErrorFallback />);
    await userEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }));
    expect(window.location.href).toBe('/');
  });
});
