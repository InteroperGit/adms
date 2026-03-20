import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CookieActions } from './CookieActions';

describe('CookieActions', () => {
  it('renders two buttons', () => {
    render(<CookieActions onAcceptAll={vi.fn()} onNecessaryOnly={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('accept button calls onAcceptAll handler', async () => {
    const user = userEvent.setup();
    const onAcceptAll = vi.fn();
    render(<CookieActions onAcceptAll={onAcceptAll} onNecessaryOnly={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(onAcceptAll).toHaveBeenCalledOnce();
  });

  it('necessary-only button calls onNecessaryOnly handler', async () => {
    const user = userEvent.setup();
    const onNecessaryOnly = vi.fn();
    render(<CookieActions onAcceptAll={vi.fn()} onNecessaryOnly={onNecessaryOnly} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);
    expect(onNecessaryOnly).toHaveBeenCalledOnce();
  });
});
