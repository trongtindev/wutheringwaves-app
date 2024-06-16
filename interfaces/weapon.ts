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
  nameLocalized: { [key: string]: string };
  type: WeaponType;
  rarity: number;
  subStats: string;
  acquisitionMethod: WeaponAcquisitionMethod;
}

export interface IWeaponData {
  description: string;
  ranks: string[];
  ranksLocalized?: { [key: string]: string[] };
  ascensionsAndStats: {
    stats: {
      level: number;
      baseStats: string;
      substats: string;
    }[];
    materials: {
      amount: number;
      name: string;
    }[];
  }[];
  recommendedCharacters: string[];
}
