import type { ICharacter, ICharacterData } from '@/interfaces/character';
import type { ICode } from '@/interfaces/code';
import type { IWeapon, IWeaponData } from '@/interfaces/weapon';
import type { IItem, IItemData } from '~/interfaces/item';
import type { IEcho, IEchoData } from '~/interfaces/echo';
import type { ITrophy } from '~/interfaces/trophy';

export const useResources = defineStore('useResources', () => {
  const getBanners = async () => {
    return (await import('~/resources/banners')).default;
  };

  const weapons = async (): Promise<IWeapon[]> => {
    const data = await import('~/resources/weapons.json');
    return data.default.items as IWeapon[];
  };

  const getWeaponData = async (slug: string): Promise<IWeaponData> => {
    const data = await import(`~/resources/weapons/${slug}.json`);
    return data.default;
  };

  const getCharacters = async (): Promise<ICharacter[]> => {
    const data = await import('~/resources/characters.json');
    return data.default.items as ICharacter[];
  };

  const getCharacterData = async (slug: string): Promise<ICharacterData> => {
    const data = await import(`~/resources/characters/${slug}.json`);
    return data.default;
  };

  const getEchoes = async (): Promise<IEcho[]> => {
    const data = await import('~/resources/echos.json');
    return data.default.items;
  };

  const getEchoData = async (slug: string): Promise<IEchoData> => {
    const data = await import(`~/resources/echos/${slug}.json`);
    return data.default;
  };

  const getCodes = async (): Promise<ICode[]> => {
    const data = await import('~/resources/codes.json');
    return data.default.items;
  };

  const getItems = async (): Promise<IItem[]> => {
    const data = await import('~/resources/items.json');
    return data.default.items as IItem[];
  };

  const getItemData = async (slug: string): Promise<IItemData> => {
    const data = await import(`~/resources/items/${slug}.json`);
    return data.default as IItemData;
  };

  const getTrophies = async (): Promise<ITrophy[]> => {
    const data = await import('~/resources/trophy_items.json');
    return data.default.items;
  };

  const getTrophyData = async () => {
    const { groups, categories } = await import('@/resources/trophies');
    return { groups, categories };
  };

  const getEvents = async () => {
    return (await import('~/resources/events')).default;
  };

  return {
    banners: getBanners,
    getBanners,
    weapons,
    getWeapons: weapons,
    getWeaponData,
    getCharacters,
    getCharacterData,
    getEchoes,
    getEchoData,
    getCodes,
    getItems,
    getItemData,
    getTrophies,
    getTrophyData,
    getEvents
  };
});
