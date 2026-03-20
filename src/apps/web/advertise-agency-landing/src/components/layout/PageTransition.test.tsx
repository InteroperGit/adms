import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { PageTransition } from './PageTransition';

// Mock react-router hooks
const mockLocation = { pathname: '/test', search: '', hash: '', state: null, key: 'default' };
let mockNavigationState: 'idle' | 'loading' | 'submitting' = 'idle';
const mockNavigation = {
  get state() {
    return mockNavigationState;
  },
  location: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined,
};

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useLocation: () => mockLocation,
    useNavigation: () => mockNavigation,
  };
});

describe('PageTransition', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <PageTransition>
          <p>Page content</p>
        </PageTransition>
      </MemoryRouter>
    );
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('applies animate-fade-in class', () => {
    const { container } = render(
      <MemoryRouter>
        <PageTransition>
          <p>content</p>
        </PageTransition>
      </MemoryRouter>
    );
    expect(container.firstChild).toHaveClass('animate-fade-in');
  });

  it('applies opacity class when navigating', () => {
    mockNavigationState = 'loading';
    const { container } = render(
      <MemoryRouter>
        <PageTransition>
          <p>content</p>
        </PageTransition>
      </MemoryRouter>
    );
    expect(container.firstChild).toHaveClass('opacity-50');
    mockNavigationState = 'idle';
  });

  it('does not apply opacity class when idle', () => {
    mockNavigationState = 'idle';
    const { container } = render(
      <MemoryRouter>
        <PageTransition>
          <p>content</p>
        </PageTransition>
      </MemoryRouter>
    );
    expect(container.firstChild).not.toHaveClass('opacity-50');
  });
});
