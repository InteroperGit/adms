import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label with correct text', () => {
    render(
      <FormField id="name" label="Имя">
        <input id="name" />
      </FormField>
    );
    expect(screen.getByText('Имя')).toBeInTheDocument();
  });

  it('label has correct htmlFor', () => {
    render(
      <FormField id="name" label="Имя">
        <input id="name" />
      </FormField>
    );
    expect(screen.getByText('Имя')).toHaveAttribute('for', 'name');
  });

  it('renders children', () => {
    render(
      <FormField id="test" label="Test">
        <input data-testid="child-input" id="test" />
      </FormField>
    );
    expect(screen.getByTestId('child-input')).toBeInTheDocument();
  });

  it('does not render error when error is absent', () => {
    render(
      <FormField id="test" label="Test">
        <input />
      </FormField>
    );
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    render(
      <FormField id="name" label="Имя" error="Обязательное поле">
        <input />
      </FormField>
    );
    expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
  });

  it('error message has correct id for aria-describedby', () => {
    render(
      <FormField id="email" label="Email" error="Неверный формат">
        <input />
      </FormField>
    );
    expect(screen.getByText('Неверный формат')).toHaveAttribute('id', 'email-error');
  });
});
