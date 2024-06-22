import type { ILocalized } from '~/interfaces/common';

export type WeaponType =
  | 'Gauntlets'
  | 'Rectifier'
  | 'Broadblade'
  | 'Pistols'
  | 'Sword';
export type WeaponAcquisitionMethod =
  | 'Convene'
  | 'Pioneer Podcast'
  | 'Crafting'
  | 'Chests';

export interface IWeapon {
  slug: string;
  name: string;
  nameLocalized?: ILocalized;
  type: WeaponType;
  rarity: number;
  upcoming?: boolean;
}

export interface IWeaponData {
  description?: string;
  descriptionLocalized?: ILocalized;
  stats: {
    atk?: string;
    critRate?: string;
    energy?: string;
    critDMG?: string;
  };
  skill: {
    params: string[];
    description: string;
  };
  ascensions: {
    cost: {
      item: number;
      quantity: number;
    }[];
    minLevel: number;
  }[];
  ranks?: string;
  ranksLocalized?: ILocalized;
}
