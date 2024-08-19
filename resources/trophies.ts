import type { ITrophyCategory, ITrophyGroup } from '~/interfaces/trophy';
import trophyCategories from './trophy_categories.json';
import trophyGroups from './trophy_groups.json';

export const groups: ITrophyGroup[] = trophyGroups;
export const categories: ITrophyCategory[] = trophyCategories;
