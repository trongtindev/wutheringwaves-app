import type { ITrophy } from '~/interfaces/trophy';
import json from './trophies.json';

const items: ITrophy[] = json;
export default items.sort((a, b) => a.name.localeCompare(b.name));
