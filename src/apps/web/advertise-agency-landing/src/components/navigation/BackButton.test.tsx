import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackButton } from './BackButton';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

// Mock react-router's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('BackButton', () => {
  it('renders a button', () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders default label text', () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );
    expect(screen.getByText('Вернуться назад')).toBeInTheDocument();
  });

  it('renders custom label text', () => {
    render(
      <MemoryRouter>
        <BackButton label="Go Back" />
      </MemoryRouter>
    );
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('clicking button calls navigate(-1)', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('applies custom className', () => {
    render(
      <MemoryRouter>
        <BackButton className="custom-class" />
      </MemoryRouter>
    );
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
