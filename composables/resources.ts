import type { ICharacterData } from '@/interfaces/character';
import type { ICode } from '@/interfaces/code';
import type { IWeaponData } from '@/interfaces/weapon';
import { defineStore } from 'pinia';
import type { IItemData } from '~/interfaces/item';
import type { IEchoData } from '~/interfaces/echo';

export const useResources = defineStore('useResources', () => {
  // functions
  const getBanners = async () => {
    return (await import('@/resources/banners')).default;
  };

  const weapons = async () => {
    return (await import('@/resources/weapons')).default;
  };

  const getWeaponData = async (slug: string): Promise<IWeaponData> => {
    return (await import(`@/resources/weapons/${slug}.json`)).default;
  };

  const characters = async () => {
    return (await import('@/resources/characters')).default;
  };

  const getCharacterData = async (slug: string): Promise<ICharacterData> => {
    return (await import(`@/resources/characters/${slug}.json`)).default;
  };

  const echos = async () => {
    return (await import('@/resources/echos')).default;
  };

  const getEchoData = async (slug: string): Promise<IEchoData> => {
    return (await import(`@/resources/echos/${slug}.json`)).default;
  };

  const getCodes = async (): Promise<ICode[]> => {
    return (await import('@/resources/codes')).default;
  };

  const getItems = async () => {
    return (await import('@/resources/items')).default;
  };

  const getItemData = async (slug: string): Promise<IItemData> => {
    return (await import(`@/resources/items/${slug}.json`)).default;
  };

  const getTrophies = async () => {
    return (await import('@/resources/trophies')).default;
  };

  const getEvents = async () => {
    return (await import('@/resources/events')).default;
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
    getTrophies,
    getEvents
  };
});
