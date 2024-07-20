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
