import type { ILocalized } from './common';
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
  nameLocalized?: ILocalized;
  attribute: CharacterAttribute;
  weapon: WeaponType;
  rarity: number;
  upcoming?: boolean;
}

export interface ICharacterData {
  description: string;
  skills: {
    slug: string;
    name: string;
    nameLocalized?: ILocalized;
    type: CharacterSkill;
    levels: {
      cost: {
        name: string;
        quantity: number;
      }[];
      level: number;
    }[];
    description: string;
    descriptionLocalized?: ILocalized;
  }[];
  resonanceChain: {
    idx: string;
    slug: string;
    name: string;
    nameLocalized?: ILocalized;
    params: string[];
    description: string;
    descriptionLocalized?: ILocalized;
  }[];
  stats: {
    hp: number;
    atk: number;
    def: number;
    energy: number;
  };
  ascensions: {
    cost: {
      item: number;
      quantity: number;
    }[];
    minLevel: number;
  }[];
  forte: {
    cost: {
      name: string;
      nameLocalized?: ILocalized;
      quantity: number;
    }[];
    icon: string;
    name: string;
  }[];
  quote: string;
  quoteLocalized?: ILocalized;
  birthday: string;
  birthplace: string;
}
