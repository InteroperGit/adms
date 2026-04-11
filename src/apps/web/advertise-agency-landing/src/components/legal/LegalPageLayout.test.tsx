import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LegalPageLayout } from './LegalPageLayout';

describe('LegalPageLayout', () => {
  it('renders the document title', () => {
    render(
      <LegalPageLayout title="Privacy Policy" version="1.0" effectiveDate="01.01.2024">
        <p>Content here</p>
      </LegalPageLayout>
    );
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('renders the effective date in the header', () => {
    render(
      <LegalPageLayout title="Privacy Policy" version="1.0" effectiveDate="01.01.2024">
        <p>Content</p>
      </LegalPageLayout>
    );
    expect(screen.getByText('Дата вступления в силу: 01.01.2024')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <LegalPageLayout title="Doc" version="1.0" effectiveDate="01.01.2024">
        <p>Child content</p>
      </LegalPageLayout>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders footer metadata with version and date', () => {
    render(
      <LegalPageLayout title="Doc" version="2.1" effectiveDate="15.06.2024">
        <p>Content</p>
      </LegalPageLayout>
    );
    expect(
      screen.getByText('Версия 2.1 · Дата последнего обновления: 15.06.2024')
    ).toBeInTheDocument();
  });

  it('renders as a main element', () => {
    const { container } = render(
      <LegalPageLayout title="Doc" version="1.0" effectiveDate="01.01.2024">
        <p>Content</p>
      </LegalPageLayout>
    );
    expect(container.querySelector('main')).toBeInTheDocument();
  });
});
