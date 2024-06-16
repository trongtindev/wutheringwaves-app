import type { ILocalized } from './common';

export interface IItem {
  id: number;
  slug: string;
  name: string;
  nameLocalized?: ILocalized;
  rarity: number;
  category: string;
}

export interface IItemData {
  description: string;
  descriptionLocalized?: ILocalized;
  bgDescription?: string;
  bgDescriptionLocalized?: ILocalized;
}
