import type { ICharacterData } from '@/interfaces/character';
import type { ICode } from '@/interfaces/code';
import type { IWeaponData } from '@/interfaces/weapon';
import { defineStore } from 'pinia';
import type { IItemData } from '~/interfaces/item';
import type { IEchoData } from '~/interfaces/echo';

export const useResources = defineStore('useResources', () => {
  // functions
  const getBanners = async () => {
    const index = (await import('@/resources/banners')).default;
    return index;
  };

  const weapons = async () => {
    const index = (await import('@/resources/weapons')).default;
    return index;
  };

  const getWeaponData = async (slug: string): Promise<IWeaponData> => {
    const index = (await import(`@/resources/weapons/${slug}.json`)).default;
    return index;
  };

  const characters = async () => {
    const index = (await import('@/resources/characters')).default;
    return index;
  };

  const getCharacterData = async (slug: string): Promise<ICharacterData> => {
    const index = (await import(`@/resources/characters/${slug}.json`)).default;
    return index;
  };

  const echos = async () => {
    const index = (await import('@/resources/echos')).default;
    return index;
  };

  const getEchoData = async (slug: string): Promise<IEchoData> => {
    const index = (await import(`@/resources/echos/${slug}.json`)).default;
    return index;
  };

  const getCodes = async (): Promise<ICode[]> => {
    const index = (await import('@/resources/codes')).default;
    return index;
  };

  const getItems = async () => {
    const index = (await import('@/resources/items')).default;
    return index;
  };

  const getItemData = async (slug: string): Promise<IItemData> => {
    const index = (await import(`@/resources/items/${slug}.json`)).default;
    return index;
  };

  const getTrophies = async () => {
    const index = (await import('@/resources/trophies')).default;
    return index;
  };

  return {
    /**
     * @deprecated
     */
    banners: getBanners,
    getBanners,
    weapons,
    getWeaponData,
    characters,
    getCharacterData,
    echos,
    getEchoData,
    getCodes,
    getItems,
    getItemData,
    getTrophies
  };
});
