import type {
  ITrophy,
  ITrophyCategory,
  ITrophyGroup
} from '~/interfaces/trophy';
import trophyItems from './trophy_items.json';
import trophyGroups from './trophy_groups.json';
import trophyCategories from './trophy_categories.json';

export const items: ITrophy[] = trophyItems;
export const groups: ITrophyGroup[] = trophyGroups;
export const categories: ITrophyCategory[] = trophyCategories;

export default items.sort((a, b) => a.name.localeCompare(b.name));
