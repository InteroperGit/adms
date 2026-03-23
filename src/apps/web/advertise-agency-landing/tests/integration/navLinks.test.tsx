import React from 'react';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Skip guard — data files are gitignored; tests skip gracefully in CI
// ---------------------------------------------------------------------------
const ROOT = process.cwd();
const dataExists = [
  'data/content/sections/header/header.json',
  'data/content/sections/footer/footer.json',
  'data/content/sections/services/services.json',
  'data/content/config/site.json',
].every((p) => existsSync(resolve(ROOT, p)));

// ---------------------------------------------------------------------------
// @data JSON fallback mocks — allow module load when data files are absent.
// When real files exist, importOriginal() passes through the real JSON.
// Tests are skipped via describe.skipIf(!dataExists) when files are missing.
// ---------------------------------------------------------------------------
vi.mock('@data/sections/header/header.json', async (importOriginal) => {
  try {
    return await importOriginal();
  } catch {
    return {
      default: {
        lang: 'ru',
        logo: { href: '/', src: '' },
        nav: [],
        navCta: '',
        openMenuLabel: '',
        closeMenuLabel: '',
      },
    };
  }
});
vi.mock('@data/sections/footer/footer.json', async (importOriginal) => {
  try {
    return await importOriginal();
  } catch {
    return {
      default: {
        description: '',
        navTitle: '',
        servicesTitle: '',
        contactsTitle: '',
        copyright: '',
        tagline: '',
        legalLinks: [],
      },
    };
  }
});
vi.mock('@data/sections/services/services.json', async (importOriginal) => {
  try {
    return await importOriginal();
  } catch {
    return { default: [] };
  }
});
vi.mock('@data/config/site.json', async (importOriginal) => {
  try {
    return await importOriginal();
  } catch {
    return {
      default: {
        name: '',
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
    };
  }
});

// ---------------------------------------------------------------------------
// Imports — after all vi.mock() declarations
// ---------------------------------------------------------------------------
import { HeaderNav } from '@/components/sections/header/HeaderNav';
import { FooterNav } from '@/components/sections/footer/FooterNav';
import { FooterServices } from '@/components/sections/footer/FooterServices';
import { FooterBottom } from '@/components/sections/footer/FooterBottom';
import { headerContent } from '@/types/sections/header/header';
import { footerContent } from '@/types/sections/footer/footer';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function withRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe.skipIf(!dataExists)('Navigation links correctness (IT6)', () => {
  describe('Header nav links', () => {
    it('renders a link for each entry in headerContent.nav', () => {
      withRouter(<HeaderNav isHome={true} />);
      for (const link of headerContent.nav) {
        expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
      }
    });

    it('prefixes hrefs with "/" when not on home page (isHome=false)', () => {
      withRouter(<HeaderNav isHome={false} />);
      for (const link of headerContent.nav) {
        expect(screen.getByRole('link', { name: link.label })).toHaveAttribute(
          'href',
          `/${link.href}`
        );
      }
    });
  });

  describe('Footer nav links', () => {
    it('renders a link for each header nav entry in the footer nav column', () => {
      withRouter(<FooterNav />);
      for (const link of headerContent.nav) {
        expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
      }
    });
  });

  describe('Footer service links', () => {
    it('all service links point to the #services anchor', () => {
      withRouter(<FooterServices />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link).toHaveAttribute('href', '#services');
      }
    });

    it('shows at most 4 service links', () => {
      withRouter(<FooterServices />);
      expect(screen.getAllByRole('link').length).toBeLessThanOrEqual(4);
    });
  });

  describe('Footer legal links', () => {
    it('renders a link for each entry in footerContent.legalLinks', () => {
      withRouter(<FooterBottom />);
      for (const link of footerContent.legalLinks) {
        expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
      }
    });

    it('includes /privacy-policy link', () => {
      withRouter(<FooterBottom />);
      const hrefs = screen.getAllByRole('link').map((el) => el.getAttribute('href'));
      expect(hrefs).toContain('/privacy-policy');
    });

    it('includes /user-agreement link', () => {
      withRouter(<FooterBottom />);
      const hrefs = screen.getAllByRole('link').map((el) => el.getAttribute('href'));
      expect(hrefs).toContain('/user-agreement');
    });

    it('includes /consent link', () => {
      withRouter(<FooterBottom />);
      const hrefs = screen.getAllByRole('link').map((el) => el.getAttribute('href'));
      expect(hrefs).toContain('/consent');
    });
  });
});
