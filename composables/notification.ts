import { defineStore } from 'pinia';

export const useNotification = defineStore('useNotification', () => {
  // uses
  const firebase = useFirebase();

  // states
  const enabled = useCookie<boolean>('notification.enabled');

  // computed
  const isSupported = computed<boolean>(() => {
    return typeof firebase.messaging != 'undefined';
  });

  return {
    enabled,
    isSupported
  };
});
