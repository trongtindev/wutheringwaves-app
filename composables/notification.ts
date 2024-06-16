import { defineStore } from 'pinia';

export const useNotification = defineStore('useNotification', () => {
  // uses
  const { isAndroid, isDesktop } = useDevice();
  const firebase = useFirebase();

  // states
  const enabled = useCookie<boolean>('notification.enabled');

  // computed
  const isSupported = computed<boolean>(() => {
    return (isAndroid || isDesktop) && typeof firebase.messaging != 'undefined';
  });

  return {
    enabled,
    isSupported
  };
});
