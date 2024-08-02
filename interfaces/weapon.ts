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
  id: number;
  slug: string;
  name: string;
  nameLocalized?: ILocalized;
  type: WeaponType;
  rarity: number;
  upcoming?: boolean;
  publishedTime: string;
  modifiedTime: string;
}

export interface IWeaponData {
  description?: string;
  descriptionLocalized?: ILocalized;
  stats: {
    atk?: number;
    atkRate?: number;
    critRate?: number;
    critDMG?: number;
    energy?: number;
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
}
