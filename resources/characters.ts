import type { ICharacter } from '@/interfaces/character';
import json from './characters.json';

const items = [
  ...json,
  {
    slug: 'rover',
    name: 'Rover',
    weapon: 'Sword',
    attribute: 'Havoc',
    releaseDate: 'May 23, 2024'
  },
  {
    slug: 'rover-havoc',
    name: 'Rover (Havoc)',
    weapon: 'Sword',
    attribute: 'Havoc',
    releaseDate: 'May 23, 2024'
  }
].map((e) => {
  return {
    ...e,
    rarity: 5,
    attribute: e.attribute || 'Spectro',
    releaseDate: new Date(`${e.releaseDate}`)
  };
}) as ICharacter[];

export default items;
