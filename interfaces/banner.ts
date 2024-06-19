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
  time?: {
    start: Date;
    end: Date;
  };
  featured?: string[];
  featuredRare?: string;
  version?: string;
}
