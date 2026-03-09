import data from '@data/sections/advantages.json';

export interface Advantage {
  icon: string;
  title: string;
  description: string;
}

export const advantages = data satisfies Advantage[];
