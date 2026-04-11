import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LegalSection } from './LegalSection';

describe('LegalSection', () => {
  it('renders the section heading', () => {
    render(
      <LegalSection title="Definitions">
        <p>Some content</p>
      </LegalSection>
    );
    expect(screen.getByText('Definitions')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <LegalSection title="Section">
        <p>Child text</p>
      </LegalSection>
    );
    expect(screen.getByText('Child text')).toBeInTheDocument();
  });

  it('applies id attribute when provided', () => {
    const { container } = render(
      <LegalSection id="definitions" title="Definitions">
        <p>Content</p>
      </LegalSection>
    );
    expect(container.querySelector('#definitions')).toBeInTheDocument();
  });

  it('renders without id when not provided', () => {
    const { container } = render(
      <LegalSection title="No ID">
        <p>Content</p>
      </LegalSection>
    );
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.id).toBe('');
  });

  it('renders as a section element', () => {
    const { container } = render(
      <LegalSection title="Title">
        <p>Content</p>
      </LegalSection>
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders heading as h2', () => {
    const { container } = render(
      <LegalSection title="My Section">
        <p>Content</p>
      </LegalSection>
    );
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toBe('My Section');
  });
});
