import raw from '@data/sections/aboutContent.json';

export interface AboutSectionContent {
  label: string;
  title: string;
  titleHighlight: string;
  text: string[];
  card: {
    tagline: string;
    stats: Array<{ label: string; value: string }>;
    nps: { label: string; value: string };
  };
}

export const aboutContent = raw satisfies AboutSectionContent;
