import type { ITrophyCategory, ITrophyGroup } from '~/interfaces/trophy';
import trophyGroups from './trophy_groups.json';
import trophyCategories from './trophy_categories.json';

export const groups: ITrophyGroup[] = trophyGroups;
export const categories: ITrophyCategory[] = trophyCategories;
