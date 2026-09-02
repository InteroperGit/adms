export interface Stat {
  value: string;
  label: string;
}

export interface AboutContent {
  description1: string;
  description2: string;
  stats: Stat[];
  icon: string;
}