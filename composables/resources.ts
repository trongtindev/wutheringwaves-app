import type {
  IAttribute,
  ICharacter,
  ICharacterData,
} from '@/interfaces/character';
import type { ICode } from '@/interfaces/code';
import type { IWeapon, IWeaponData } from '@/interfaces/weapon';
import type { IItem, IItemData } from '~/interfaces/item';
import type { IEcho, IEchoData } from '~/interfaces/echo';
import type { ITrophy } from '~/interfaces/trophy';
import type { ITimeline } from '~/interfaces/timeline';
import { CardPoolType, type IBanner } from '~/interfaces/banner';

export const useResources = defineStore('useResources', () => {
  const getBanners = async () => {
    const data = await import('~/resources/banners.json');
    return data.default.items.reverse().map((e) => {
      return {
        ...e,
        type: CardPoolType[e.type],
      };
    }) as IBanner[];
  };

  const weapons = async (): Promise<IWeapon[]> => {
    const data = await import('~/resources/weapons.json');
    return data.default.items as IWeapon[];
  };

  const getWeaponData = async (slug: string): Promise<IWeaponData> => {
    const data = await import(`~/resources/weapons/${slug}.json`);
    return data.default;
  };

  const getCharacters = async (options?: {
    ignoreHidden?: boolean;
  }): Promise<ICharacter[]> => {
    options ??= {};

    const data = await import('~/resources/characters.json');
    const attributes = await getAttributes();

    return data.default.items
      .filter((e) => {
        if (!options.ignoreHidden && e.hidden) {
          return false;
        }
        return true;
      })
      .map((e) => {
        const attribute = attributes.find((attribute) => {
          return attribute.id === e.attribute || attribute.name === e.attribute;
        });
        return {
          ...e,
          attribute: attribute || attributes[0],
        };
      });
  };

  const getCharacterData = async (slug: string): Promise<ICharacterData> => {
    const data = await import(`~/resources/characters/${slug}.json`);
    return data.default;
  };

  const getEchoes = async (options?: {
    ignoreHidden?: boolean;
  }): Promise<IEcho[]> => {
    options ??= {};

    const data: { default: { items: IEcho[] } } = await import(
      '~/resources/echoes.json'
    );
    return data.default.items.filter((e) => {
      if (!options.ignoreHidden && e.hidden) {
        return false;
      }
      return true;
    });
  };

  const getEchoData = async (slug: string): Promise<IEchoData> => {
    const data = await import(`~/resources/echoes/${slug}.json`);
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
    return data.default.items.map((e) => {
      return {
        ...e,
        publishedTime: e.publishedTime || data.default.publishedTime,
        modifiedTime: e.modifiedTime || data.default.modifiedTime,
      };
    });
  };

  const getTrophy = async (slug: string): Promise<ITrophy> => {
    const data = await import('~/resources/trophy_items.json');
    return data.default.items
      .map((e) => {
        return {
          ...e,
          publishedTime: e.publishedTime || data.default.publishedTime,
          modifiedTime: e.modifiedTime || data.default.modifiedTime,
        };
      })
      .find((e) => e.slug === slug)!;
  };

  const getTrophyData = async () => {
    const { groups, categories } = await import('@/resources/trophies');
    return { groups, categories };
  };

  const getTimeline = async (): Promise<ITimeline[][]> => {
    const data = await import('~/resources/timeline.json');
    return data.default.items;
  };

  const getAttributes = async (): Promise<IAttribute[]> => {
    const data = await import('~/resources/attributes.json');
    return data.default.items;
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
    getTrophy,
    getTrophyData,
    getTimeline,
    getAttributes,
  };
});
