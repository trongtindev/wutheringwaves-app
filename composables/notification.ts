import { defineStore } from 'pinia';

export const useNotification = defineStore('useNotification', () => {
  // uses
  const nuxtApp = useNuxtApp();

  // states
  const enabled = useCookie<boolean>('notification.enabled');
  const isPermissionGranted = ref(false);

  // functions
  const initialize = async () => {
    const { onMessage } = await import('firebase/messaging');
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
    isPermissionGranted
  };
});
