import type { ILocalized } from './common';
import type { ISonata } from './sonata';

export interface IAttribute {
  slug: string;
  name: string;
  icon: string;
}

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
  attribute: IAttribute;
  weapon: string;
  rarity?: number;
  upcoming?: boolean;
  version?: number;
  suggestedEchos?: string[];
  modifiedTime: string;
  publishedTime: string;
  hidden?: boolean;
  images: {
    icon: string;
    cover?: string;
    portrait: string;
  };
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

export interface ICharacterDataStats {
  hp: number;
  atk: number;
  def: number;
}

export interface ICharacterData {
  description?: string;
  descriptionLocalized?: ILocalized;
  skillPriority?: CharacterSkill[];
  skills?: ICharacterSkillData[];
  resonanceChain?: ICharacterRCData[];
  stats?: ICharacterDataStats;
  ascensions?: {
    cost: {
      item: number | string;
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
    items: ISonata[];
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
  splashArt?: boolean | string;
}
