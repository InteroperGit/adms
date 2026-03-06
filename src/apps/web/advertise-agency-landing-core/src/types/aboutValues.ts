import data from '@data/about-values.json';

export interface AboutValue {
  title: string;
  description: string;
}

export const aboutValues = data satisfies AboutValue[];
