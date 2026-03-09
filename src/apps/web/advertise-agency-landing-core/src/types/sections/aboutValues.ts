import data from '@data/sections/about-values.json';

export interface AboutValue {
  title: string;
  description: string;
}

export const aboutValues = data satisfies AboutValue[];
