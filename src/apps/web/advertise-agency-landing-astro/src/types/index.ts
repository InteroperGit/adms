// src/types/index.ts

export interface Project {
  id: number;
  title: string;
  client: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  result: string;
}

export interface Review {
  id: number;
  name: string;
  position: string;
  company: string;
  text: string;
  avatar: string;
}