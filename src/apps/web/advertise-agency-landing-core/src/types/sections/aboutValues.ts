import data from '@data/sections/aboutValues.json';

export interface AboutValue {
  title: string;
  description: string;
}

export const aboutValues = data satisfies AboutValue[];
