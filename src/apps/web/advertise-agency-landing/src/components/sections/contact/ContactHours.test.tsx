import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/contact/contact', () => ({
  contactContent: {
    hoursTitle: 'Часы работы',
    dayLabels: {
      weekdays: 'Пн–Пт',
      saturday: 'Суббота',
      sunday: 'Воскресенье',
    },
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: {
    contact: {
      workingHours: {
        weekdays: '9:00–18:00',
        saturday: '10:00–16:00',
        sunday: 'Выходной',
      },
    },
  },
}));

import { ContactHours } from './ContactHours';

describe('ContactHours', () => {
  it('renders hours title', () => {
    render(<ContactHours />);
    expect(screen.getByText('Часы работы')).toBeInTheDocument();
  });

  it('renders weekday label', () => {
    render(<ContactHours />);
    expect(screen.getByText('Пн–Пт')).toBeInTheDocument();
  });

  it('renders weekday hours', () => {
    render(<ContactHours />);
    expect(screen.getByText('9:00–18:00')).toBeInTheDocument();
  });

  it('renders Saturday label', () => {
    render(<ContactHours />);
    expect(screen.getByText('Суббота')).toBeInTheDocument();
  });

  it('renders Saturday hours', () => {
    render(<ContactHours />);
    expect(screen.getByText('10:00–16:00')).toBeInTheDocument();
  });

  it('renders Sunday label', () => {
    render(<ContactHours />);
    expect(screen.getByText('Воскресенье')).toBeInTheDocument();
  });

  it('renders Sunday hours', () => {
    render(<ContactHours />);
    expect(screen.getByText('Выходной')).toBeInTheDocument();
  });
});
