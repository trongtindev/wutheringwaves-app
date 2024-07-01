export enum CardPoolType {
  'featured-resonator' = 1,
  'featured-weapon' = 2,
  'standard-resonator' = 3,
  'standard-weapon' = 4,
  'beginner' = 5,
  'beginner-choice' = 6,
  'beginner-choice-custom' = 7
}

export interface IBanner {
  type: CardPoolType;
  name: {
    en: string;
    [key: string]: string;
  };
  thumbnail?: string;
  time?: {
    start: string;
    end: string;
  };
  featured?: string[];
  featuredRare?: string;
  version?: string;
}
