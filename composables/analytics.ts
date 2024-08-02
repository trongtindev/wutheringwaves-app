import { defineStore } from 'pinia';

export const useAnalytics = defineStore('useAnalytics', () => {
  // uses
  const auth = useAuth();
  const { GOOGLE_TAG_ID } = useRuntimeConfig().public;

  // states
  const optOut = useLocalStorage('analytics.optOut', false);

  // functions
  const initialize = () => {
    if (optOut.value) {
      console.warn('useAnalytics', 'skip');
      return;
    }
    console.debug('useAnalytics', 'initialize');

    if (auth.user) {
      config({
        user_id: auth.user.id,
      });
    }
  };

  const config = async (
    config?:
      | Gtag.ControlParams
      | Gtag.EventParams
      | Gtag.CustomParams
      | Gtag.ConfigParams
      | undefined,
  ) => {
    if (typeof window.gtag === 'undefined') {
      if (!import.meta.dev && !optOut.value) {
        console.warn('useAnalytics', 'gtag is not initialized!');
      }
      return;
    }

    console.debug('useAnalytics', 'config', config);
    window.gtag('config', GOOGLE_TAG_ID, config);
  };

  const logEvent = async (
    // eslint-disable-next-line @typescript-eslint/ban-types
    eventName: Gtag.EventNames | (string & {}),
    eventParams?:
      | Gtag.ControlParams
      | Gtag.EventParams
      | Gtag.CustomParams
      | undefined,
  ) => {
    if (typeof window.gtag === 'undefined') {
      if (!import.meta.dev && !optOut.value) {
        console.warn('useAnalytics', 'gtag is not initialized!');
      }

      return;
    }
    console.debug('useAnalytics', 'logEvent', eventName, eventParams);
    window.gtag('event', eventName, eventParams);
  };

  // changes
  watch(
    () => auth.user,
    (value) => {
      config({
        user_id: value ? value.id : undefined,
      });
    },
  );

  // lifecycle
  onMounted(initialize);

  // exports
  return { optOut, logEvent };
});
