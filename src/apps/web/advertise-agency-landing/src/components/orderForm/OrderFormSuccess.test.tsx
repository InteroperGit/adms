import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OrderFormSuccess } from './OrderFormSuccess';
import type { OrderFormSuccess as SuccessData } from '@/types/config/orderForms';

const mockSuccess: SuccessData = {
  title: 'Заявка отправлена!',
  text: 'Мы свяжемся с вами в ближайшее время.',
  reset: 'Отправить ещё одну заявку',
};

describe('OrderFormSuccess', () => {
  it('renders the success title', () => {
    render(<OrderFormSuccess success={mockSuccess} onReset={vi.fn()} />);
    expect(screen.getByText('Заявка отправлена!')).toBeInTheDocument();
  });

  it('renders the success text', () => {
    render(<OrderFormSuccess success={mockSuccess} onReset={vi.fn()} />);
    expect(screen.getByText('Мы свяжемся с вами в ближайшее время.')).toBeInTheDocument();
  });

  it('renders the reset button with correct label', () => {
    render(<OrderFormSuccess success={mockSuccess} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Отправить ещё одну заявку' })).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const onReset = vi.fn();
    render(<OrderFormSuccess success={mockSuccess} onReset={onReset} />);
    await userEvent.click(screen.getByRole('button', { name: 'Отправить ещё одну заявку' }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
