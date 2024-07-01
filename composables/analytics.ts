import { defineStore } from 'pinia';

export const useAnalytics = defineStore('useAnalytics', () => {
  // uses
  const { isCrawler } = useDevice();
  const { $firebase } = useNuxtApp();

  // states
  const optOut = useCookie<boolean>('analytics.optOut');
  const firebaseLogEvent = ref();

  // functions
  const initialize = () => {
    if (import.meta.server) {
      throw new Error('Cannot initialize analytics on server-side!');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logEvent = async (event: string, params: { [Key: string]: any }) => {
    if (import.meta.dev || isCrawler) return;
    if ($firebase.analytics) {
      if (!firebaseLogEvent.value) {
        const { logEvent: _logEvent } = await import('firebase/analytics');
        firebaseLogEvent.value = _logEvent;
      }
      firebaseLogEvent.value($firebase.analytics, event, params);
    }
  };

  // exports
  return { optOut, initialize, logEvent };
});
