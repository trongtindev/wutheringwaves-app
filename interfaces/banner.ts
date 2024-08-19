import type { ILocalized } from './common';

export enum CardPoolType {
  'featured-resonator' = 1,
  'featured-weapon' = 2,
  'standard-resonator' = 3,
  'standard-weapon' = 4,
  'beginner' = 5,
  'beginner-choice' = 6,
  'beginner-choice-custom' = 7,
}

export interface IBanner {
  type: CardPoolType;
  name: string;
  nameLocalized?: ILocalized;
  thumbnail?: string;
  time?: {
    start: string;
    end: string;
  };
  featured?: string[];
  featuredRare?: string;
  featuredSecondaryRare?: string;
  version?: string;
}
