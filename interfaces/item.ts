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
