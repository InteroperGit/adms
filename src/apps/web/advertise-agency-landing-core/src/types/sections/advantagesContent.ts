import raw from '@data/sections/advantagesContent.json';

export interface AdvantagesSectionContent {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export const advantagesContent = raw satisfies AdvantagesSectionContent;
