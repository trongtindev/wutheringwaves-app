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
  id: number;
  slug: string;
  name: string;
  nameLocalized?: ILocalized;
  attribute?: CharacterAttribute;
  weapon?: WeaponType;
  rarity?: number;
  upcoming?: boolean;
  version?: number;
  suggestedEchos?: string[];
}

export interface ICharacterSkillData {
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
}

export interface ICharacterRCData {
  idx: string;
  slug: string;
  name: string;
  nameLocalized?: ILocalized;
  params: string[];
  description: string;
  descriptionLocalized?: ILocalized;
}

export interface ICharacterData {
  /**
   * When the data was first published.
   * @example '1970-01-01T00:00:00.000Z'
   */
  publishedTime?: string;
  /**
   * When the data was last changed.
   * @example '1970-01-01T00:00:00.000Z'
   */
  modifiedTime?: string;
  description?: string;
  descriptionLocalized?: ILocalized;
  skillPriority?: CharacterSkill[];
  skills?: ICharacterSkillData[];
  resonanceChain?: ICharacterRCData[];
  stats?: {
    hp: number;
    atk: number;
    def: number;
  };
  ascensions?: {
    cost: {
      item: number;
      quantity: number;
    }[];
    minLevel: number;
  }[];
  forte?: {
    cost: {
      name: string;
      nameLocalized?: ILocalized;
      quantity: number;
    }[];
    icon: string;
    name: string;
  }[];
  quote?: string;
  quoteLocalized?: ILocalized;
  birthday?: string;
  birthplace?: string;
  bestWeapons?: {
    item: string;
    rank: number;
    different: number;
  }[];
  bestEchoSets?: {
    items: string[];
    different: number;
  }[];
  bestMainEchoes?: string[];
  bestEchoStats?: {
    type: string;
    items: {
      cost: number;
      stats: string;
    }[];
  }[];
  bestTeams?: {
    name: string;
    items: {
      role: string;
      items: string[];
    }[];
  }[];
}
