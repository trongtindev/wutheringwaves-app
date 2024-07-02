import { defineStore } from 'pinia';
import { logEvent as _logEvent } from 'firebase/analytics';

export const useAnalytics = defineStore('useAnalytics', () => {
  // uses
  const { isCrawler } = useDevice();
  const nuxtApp = useNuxtApp();

  // states
  const optOut = useCookie<boolean>('analytics.optOut');

  // functions
  const initialize = () => {
    if (import.meta.server) {
      throw new Error('Cannot initialize analytics on server-side!');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logEvent = async (event: string, params: { [Key: string]: any }) => {
    if (import.meta.dev || isCrawler) return;

    if (nuxtApp.$firebase.analytics) {
      _logEvent(nuxtApp.$firebase.analytics, event, params);
    }
  };

  // exports
  return { optOut, initialize, logEvent };
});
