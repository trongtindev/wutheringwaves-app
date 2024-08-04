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
  const getBanners = async (selector?: IBanner) => {
    const data = await import('~/resources/banners.json');
    const clone = cloneObject(data.default.items);
    const items = clone
      .reverse()
      .map((e) => {
        return {
          ...e,
          type: CardPoolType[e.type],
        };
      })
      .filter((e) => {
        if (selector) {
          return Object.entries(selector).every(
            ([selectorKey, selectorValue]) => e[selectorKey] === selectorValue,
          );
        }
        return true;
      });

    return items;
  };

  const weapons = async (): Promise<IWeapon[]> => {
    const data = await import('~/resources/weapons.json');
    const clone = cloneObject(data.default.items);
    return clone as IWeapon[];
  };

  const getWeaponData = async (slug: string): Promise<IWeaponData> => {
    const data = await import(`~/resources/weapons/${slug}.json`);
    return data.default;
  };

  const getCharacters = async (
    selector?: Partial<ICharacter>,
  ): Promise<ICharacter[]> => {
    const data = await import('~/resources/characters.json');
    const clone = cloneObject(data.default.items);
    const attributes = await getAttributes();

    const items = clone
      .map((e) => {
        return {
          ...e,
          hidden: typeof e.hidden === 'undefined' ? false : e.hidden,
          upcoming: typeof e.upcoming === 'undefined' ? false : e.upcoming,
        };
      })
      .filter((e) => {
        if (selector) {
          return Object.entries(selector).every(
            ([selectorKey, selectorValue]) => e[selectorKey] === selectorValue,
          );
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
    return items;
  };

  const getCharacterData = async (slug: string): Promise<ICharacterData> => {
    const data = await import(`~/resources/characters/${slug}.json`);
    const clone = JSON.parse(JSON.stringify(data.default));
    return clone;
  };

  const getEchoes = async (selector?: Partial<IEcho>): Promise<IEcho[]> => {
    const data = await import('~/resources/echoes.json');
    const clone = cloneObject(data.default.items);
    const items = clone.filter((e) => {
      if (selector) {
        return Object.entries(selector).every(
          ([selectorKey, selectorValue]) => e[selectorKey] === selectorValue,
        );
      }
      return true;
    });
    return items;
  };

  const getEchoData = async (slug: string): Promise<IEchoData> => {
    const data = await import(`~/resources/echoes/${slug}.json`);
    return data.default;
  };

  const getCodes = async (): Promise<ICode[]> => {
    const data = await import('~/resources/codes.json');
    return data.default.items;
  };

  const getItems = async (selector?: Partial<IItem>): Promise<IItem[]> => {
    const data = await import('~/resources/items.json');
    const clone = cloneObject(data.default.items);
    const items = clone.filter((e) => {
      if (selector) {
        return Object.entries(selector).every(
          ([selectorKey, selectorValue]) => e[selectorKey] === selectorValue,
        );
      }
      return true;
    });
    return JSON.parse(JSON.stringify(items));
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
