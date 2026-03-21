import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TestimonialsEmpty } from './TestimonialsEmpty';

describe('TestimonialsEmpty', () => {
  it('renders empty state message', () => {
    render(<TestimonialsEmpty />);
    expect(screen.getByText('Отзывы не найдены')).toBeInTheDocument();
  });

  it('renders configuration hint with yandexMapsOrgId key', () => {
    render(<TestimonialsEmpty />);
    expect(screen.getByText('yandexMapsOrgId')).toBeInTheDocument();
  });

  it('renders the MessageSquareOff icon container', () => {
    render(<TestimonialsEmpty />);
    // The icon is wrapped in a rounded-full div with animate-float
    const iconWrapper = document.querySelector('.animate-float');
    expect(iconWrapper).toBeInTheDocument();
  });
});
