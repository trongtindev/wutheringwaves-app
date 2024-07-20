import type { ICharacter } from '@/interfaces/character';
import json from './characters.json';

const items = [
  ...json.items,
  {
    slug: 'rover',
    name: 'Rover',
    weapon: 'Sword',
    rarity: 5,
    attribute: 'Spectro'
  },
  {
    slug: 'rover-havoc',
    name: 'Rover (Havoc)',
    rarity: 5,
    weapon: 'Sword',
    attribute: 'Havoc'
  },
  {
    slug: 'rover-electro',
    name: 'Rover (Electro)',
    rarity: 5,
    weapon: 'Sword',
    attribute: 'Electro',
    upcoming: true
  }
] as ICharacter[];

export default items.sort((a, b) => a.name.localeCompare(b.name));
