import data from '@data/services.json';

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export const services = data satisfies Service[];
