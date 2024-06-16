import type { WeaponType } from './weapon';

export type CharacterAttribute =
  | 'Aero'
  | 'Glacio'
  | 'Electro'
  | 'Fusion'
  | 'Havoc'
  | 'Spectro';
export type CharacterSkill =
  | 'Basic Attack'
  | 'Resonance Skill'
  | 'Resonance Liberation'
  | 'Inherent Skill'
  | 'Intro Skill'
  | 'Forte Circuit'
  | 'Outro Skill';

export interface ICharacter {
  slug: string;
  name: string;
  attribute: CharacterAttribute;
  weapon: WeaponType;
  rarity: number;
  class: string;
  releaseDate: Date;
}

export interface ICharacterData {
  description: string;
  skills: {
    icon: string;
    name: string;
    type: CharacterSkill;
    levels: {
      cost: {
        name: string;
        quantity: number;
      }[];
      level: number;
    }[];
    description: string;
  }[];
  resonanceChain: {
    icon: string;
    name: string;
    params: string[] | number[];
    description: string;
  }[];
  stats: {
    hp: number;
    atk: number;
    def: number;
    energy: number;
  };
  ascensions: {
    cost: {
      name: string;
      quantity: number;
    }[];
    minLevel: number;
  }[];
  forte: {
    cost: {
      name: string;
      quantity: number;
    }[];
    icon: string;
    name: string;
  }[];
  // name: string;
  // nameLocalized: { [key: string]: string };
  // quote: string;
  // birthday: string;
  // birthplace: string;
  // resonanceChain: {
  //   name: string;
  // }[];
  // ascensionMaterials: {
  //   name: string;
  //   amount: number;
  // }[];
}
