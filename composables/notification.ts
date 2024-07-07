import { defineStore } from 'pinia';
import type { INotification } from '~/interfaces/notification';

export const useNotification = defineStore('useNotification', () => {
  // uses
  const nuxtApp = useNuxtApp();

  // states
  const enabled = useCookie<boolean>('notification.enabled');
  const isPermissionGranted = ref(false);
  const items = ref<INotification[]>([]);
  const floatItems = ref<INotification[]>([]);

  // functions
  const initialize = async () => {
    const { onMessage } = await import('firebase/messaging');
  };

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

  // computed
  const isSupported = computed<boolean>(() => {
    return (
      typeof nuxtApp.$firebase.messaging != 'undefined' &&
      'Notification' in window
    );
  });

  // changes
  watch(
    () => enabled.value,
    (value) => {
      if (!('Notification' in window)) return;
      if (value && !isPermissionGranted.value) {
        console.debug('Notification.requestPermission');
        Notification.requestPermission()
          .then((result) => {
            isPermissionGranted.value = result == 'granted';
            if (enabled.value && !isPermissionGranted.value) {
              enabled.value = false;
            }
          })
          .catch(() => {
            enabled.value = false;
            isPermissionGranted.value = false;
          });
      }
    }
  );

  // lifecycle
  onMounted(() => {
    if (!('Notification' in window)) return;
    isPermissionGranted.value = Notification.permission == 'granted';
    if (enabled.value && !isPermissionGranted.value) {
      enabled.value = false;
    }
  });

  // exports
  return {
    enabled,
    isSupported,
    isPermissionGranted,
    items,
    floatItems,
    create,
    remove
  };
});
