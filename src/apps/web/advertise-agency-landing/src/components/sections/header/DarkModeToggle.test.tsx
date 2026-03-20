import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DarkModeToggle } from './DarkModeToggle';

describe('DarkModeToggle', () => {
  it('renders Moon icon in light mode', () => {
    render(<DarkModeToggle isDark={false} onToggle={vi.fn()} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label', 'Тёмный режим');
  });

  it('renders Sun icon in dark mode', () => {
    render(<DarkModeToggle isDark={true} onToggle={vi.fn()} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label', 'Светлый режим');
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<DarkModeToggle isDark={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<DarkModeToggle isDark={false} onToggle={vi.fn()} className="custom-cls" />);
    expect(screen.getByRole('button')).toHaveClass('custom-cls');
  });
});
