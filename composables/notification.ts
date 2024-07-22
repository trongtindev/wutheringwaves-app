import { defineStore } from 'pinia';
import type { INotification } from '~/interfaces/notification';

export const useNotification = defineStore('useNotification', () => {
  // states
  const items = ref<INotification[]>([]);
  const floatItems = ref<INotification[]>([]);

  // functions
  const create = async (data: Partial<INotification>) => {
    data.id ??= randomId();

    items.value.push(data as INotification);
    floatItems.value.push(data as INotification);

    if (!data.persistent) {
      setTimeout(() => remove(data.id as string), 5000);
    }

    return data.id as string;
  };

  const remove = (
    id: string,
    options?: {
      floatOnly?: boolean;
    }
  ) => {
    options ??= {};

    if (!options.floatOnly) {
      const itemIndex = items.value.findIndex((e) => e.id === id);
      if (itemIndex >= 0) items.value.splice(itemIndex);
    }

    const floatItemIndex = floatItems.value.findIndex((e) => e.id === id);
    if (floatItemIndex >= 0) floatItems.value.splice(floatItemIndex);
  };

  // exports
  return {
    items,
    floatItems,
    create,
    remove
  };
});
