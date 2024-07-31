import type { ICharacter } from './character';
import type { IEcho } from './echo';
import type { IWeapon } from './weapon';

export type TierListType = 'character' | 'echo' | 'weapon';
export type TierListItem = ICharacter | IEcho | IWeapon;

export interface ITierList {
  id: string;
  type: TierListType;
  title: string;
  content: string;
  isLiveVoting?: boolean;
  isVerified?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ITierListRow {
  id: string;
  label: string;
  items: TierListItem[];
  color: string;
}
