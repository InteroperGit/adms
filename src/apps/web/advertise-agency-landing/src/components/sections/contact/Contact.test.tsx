import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, isVisible: true }),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false, toggle: vi.fn() }),
}));

vi.mock('@/types/sections/contact/contact', () => ({
  contactContent: {
    label: 'Контакты',
    title: 'Свяжитесь с нами',
    description: 'Мы всегда на связи',
  },
}));

vi.mock('./ContactForm', () => ({
  ContactForm: () => <div data-testid="contact-form" />,
}));

vi.mock('./ContactInfo', () => ({
  ContactInfo: ({ isDark }: { isDark: boolean }) => (
    <div data-testid="contact-info" data-dark={String(isDark)} />
  ),
}));

vi.mock('./ContactHours', () => ({
  ContactHours: () => <div data-testid="contact-hours" />,
}));

import { Contact } from './index';

describe('Contact', () => {
  it('renders section label', () => {
    render(<Contact />);
    expect(screen.getByText('Контакты')).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<Contact />);
    expect(screen.getByText('Свяжитесь с нами')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<Contact />);
    expect(screen.getByText('Мы всегда на связи')).toBeInTheDocument();
  });

  it('renders contact form', () => {
    render(<Contact />);
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
  });

  it('renders contact info', () => {
    render(<Contact />);
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
  });

  it('renders contact hours', () => {
    render(<Contact />);
    expect(screen.getByTestId('contact-hours')).toBeInTheDocument();
  });

  it('passes isDark=false to ContactInfo by default', () => {
    render(<Contact />);
    expect(screen.getByTestId('contact-info')).toHaveAttribute('data-dark', 'false');
  });
});
