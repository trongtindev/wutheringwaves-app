import { defineStore } from 'pinia';

export const useNotification = defineStore('useNotification', () => {
  // uses
  const { $firebase } = useNuxtApp();

  // states
  const enabled = useLocalStorage('notification.enabled', false);

  // computed
  const isSupported = computed<boolean>(() => {
    return typeof $firebase.messaging != 'undefined';
  });

  // exports
  return {
    enabled,
    isSupported
  };
});
