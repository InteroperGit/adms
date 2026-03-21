import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/contact/contact', () => ({
  contactContent: {
    form: {
      success: {
        title: 'Сообщение отправлено!',
        text: 'Мы свяжемся с вами в ближайшее время',
        reset: 'Отправить ещё раз',
      },
    },
  },
}));

import { ContactSuccess } from './ContactSuccess';

describe('ContactSuccess', () => {
  it('renders success title', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByText('Сообщение отправлено!')).toBeInTheDocument();
  });

  it('renders success description', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByText('Мы свяжемся с вами в ближайшее время')).toBeInTheDocument();
  });

  it('renders reset button', () => {
    render(<ContactSuccess onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Отправить ещё раз' })).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(<ContactSuccess onReset={onReset} />);
    fireEvent.click(screen.getByRole('button', { name: 'Отправить ещё раз' }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('renders send icon', () => {
    const { container } = render(<ContactSuccess onReset={vi.fn()} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
