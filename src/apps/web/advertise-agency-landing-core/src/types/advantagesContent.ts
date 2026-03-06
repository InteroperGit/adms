import raw from '@data/advantages-content.json';

export interface AdvantagesSectionContent {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export const advantagesContent = raw satisfies AdvantagesSectionContent;
