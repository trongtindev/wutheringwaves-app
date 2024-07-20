import type { IItem } from '~/interfaces/item';
import json from './items.json';

const items = json.items as IItem[];
export default items.sort((a, b) => a.name.localeCompare(b.name));
