import type { ILocalized } from './common';

export interface IItem {
  id: number;
  slug: string;
  name: string;
  nameLocalized?: ILocalized;
  rarity: number;
  category: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface IItemData {
  description: string;
  descriptionLocalized?: ILocalized;
  bgDescription?: string;
  bgDescriptionLocalized?: ILocalized;
  obtainDescription?: string;
  obtainDescriptionLocalized?: ILocalized;
  unlockDescription?: string;
  unlockDescriptionLocalized?: ILocalized;
  cookingIngredients?: {
    item: string;
    quantity: number;
  }[];
}
