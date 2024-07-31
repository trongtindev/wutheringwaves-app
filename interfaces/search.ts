import type { ILocalized } from './common';

export enum SearchResultType {
  'item',
  'character',
  'weapon',
  'trophy',
  'echo',
}

export interface ISearchResult {
  type: SearchResultType;
  slug: string;
  icon?: string;
  name: string;
  nameLocalized?: ILocalized;
  rarity?: number;
}
