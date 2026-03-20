import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ConsentState } from '@/hooks/useCookieConsent';

const mockConsent = vi.hoisted(() => ({ value: null as string | null }));

vi.mock('@/hooks/useCookieConsent', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks/useCookieConsent')>();
  return {
    ...actual,
    useCookieConsent: () => mockConsent.value,
  };
});

vi.mock('@/types/config/siteData', () => ({
  siteData: {
    yandexMetrikaId: '12345678',
    name: 'Test',
    description: '',
    homeLabel: '',
    contact: {
      phone: '',
      email: '',
      address: '',
      telegram: '',
      vk: '',
      workingHours: { weekdays: '', saturday: '', sunday: '' },
    },
  },
}));

async function importMetrikaScript() {
  const { MetrikaScript } = await import('./MetrikaScript');
  return MetrikaScript;
}

describe('MetrikaScript', () => {
  beforeEach(() => {
    mockConsent.value = null;
    document.getElementById('yandex-metrika-script')?.remove();
    delete window.ym;
    vi.resetModules();
  });

  afterEach(() => {
    document.getElementById('yandex-metrika-script')?.remove();
    delete window.ym;
  });

  it('does not inject script without consent', async () => {
    const MetrikaScript = await importMetrikaScript();
    mockConsent.value = null;
    render(
      <MemoryRouter>
        <MetrikaScript />
      </MemoryRouter>
    );
    expect(document.getElementById('yandex-metrika-script')).not.toBeInTheDocument();
  });

  it('injects script when consent is ALL', async () => {
    const MetrikaScript = await importMetrikaScript();
    mockConsent.value = ConsentState.ALL;
    await act(async () => {
      render(
        <MemoryRouter>
          <MetrikaScript />
        </MemoryRouter>
      );
    });
    expect(document.getElementById('yandex-metrika-script')).toBeInTheDocument();
  });

  it('renders noscript fallback image', async () => {
    const MetrikaScript = await importMetrikaScript();
    mockConsent.value = null;
    const { container } = render(
      <MemoryRouter>
        <MetrikaScript />
      </MemoryRouter>
    );
    expect(container.querySelector('noscript')).toBeInTheDocument();
  });
});
