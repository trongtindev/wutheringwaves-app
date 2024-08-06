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

export interface IWeaponDataStats {
  def?: number;
  hp?: number;
  atk?: number;
  atkFlat: number;
  critRate?: number;
  critDMG?: number;
  energyRegen?: number;
}

export interface IWeapon {
  id: number;
  slug: string;
  icon: string;
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
  stats: IWeaponDataStats;
  skill: {
    params: string[];
    description: string;
    descriptionLocalized: ILocalized;
  };
  ascensions: {
    cost: {
      item: number;
      quantity: number;
    }[];
    minLevel: number;
  }[];
}
