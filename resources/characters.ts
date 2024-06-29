import type { ICharacter } from '@/interfaces/character';
import json from './characters.json';

const items = [
  ...json,
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
  }
].map((e) => {
  return {
    ...e,
    attribute: e.attribute || 'Spectro'
  };
}) as ICharacter[];

export default items.sort((a, b) => a.name.localeCompare(b.name));
