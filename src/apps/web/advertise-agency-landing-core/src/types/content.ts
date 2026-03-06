import raw from '@data/content.json';

export interface CtaLink {
  label: string;
  href: string;
}

export interface Content {
  lang: string;
  logo: { letter: string; text: string };
  nav: CtaLink[];
  navCta: string;
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cta: CtaLink[];
    stats: Array<{ value: string; label: string }>;
  };
  carousel: { label: string };
  about: {
    label: string;
    title: string;
    titleHighlight: string;
    text: string[];
    card: {
      tagline: string;
      stats: Array<{ label: string; value: string }>;
      nps: { label: string; value: string };
    };
  };
  services: { label: string; title: string; description: string };
  portfolio: {
    label: string;
    title: string;
    description: string;
    allCategory: string;
    detailsLabel: string;
    cta: CtaLink;
  };
  advantages: {
    label: string;
    title: string;
    titleHighlight: string;
    description: string;
  };
  callToAction: {
    title: string;
    subtitle: string;
    cta: CtaLink[];
  };
  testimonials: { label: string; title: string; description: string };
  contact: {
    label: string;
    title: string;
    description: string;
    form: {
      name: { label: string; placeholder: string };
      contact: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
      consent: string;
      consentLinks: CtaLink[];
      consentJoiner: string;
      submit: string;
      disclaimer: string;
      success: { title: string; text: string; reset: string };
    };
    directTitle: string;
    contactLabels: { phone: string; email: string; address: string };
    socialTitle: string;
    hoursTitle: string;
    dayLabels: { weekdays: string; saturday: string; sunday: string };
  };
  footer: {
    description: string;
    navTitle: string;
    servicesTitle: string;
    contactsTitle: string;
    copyright: string;
    tagline: string;
    legalLinks: CtaLink[];
  };
  portfolioCase: {
    backLabel: string;
    overviewLabels: { client: string; category: string; year: string; services: string };
    challengeTitle: string;
    solutionTitle: string;
    resultsTitle: string;
    galleryTitle: string;
    photoAlt: string;
    cta: { title: string; subtitle: string; label: string };
    notFound: { title: string; back: string };
  };
  imageGallery: {
    prevLabel: string;
    nextLabel: string;
    counter: string;
  };
  cookies: {
    ariaLabel: string;
    closeLabel: string;
    title: string;
    text: string;
    privacyLink: CtaLink;
    acceptAll: string;
    necessaryOnly: string;
  };
}

export const content = raw satisfies Content;
