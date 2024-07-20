import type { IWeapon } from '@/interfaces/weapon';
import json from './weapons.json';

const items = json.items as IWeapon[];
export default items.sort((a, b) => a.name.localeCompare(b.name));
