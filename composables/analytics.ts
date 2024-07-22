import { defineStore } from 'pinia';

export const useAnalytics = defineStore('useAnalytics', () => {
  // uses
  const gtag = useGtag();

  // states
  const optOut = useCookie<boolean>('analytics.optOut');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logEvent = async (event: string, params: { [Key: string]: any }) => {
    gtag.gtag('event', event, params);
  };

  // lifecycle
  onMounted(() => {
    if (optOut.value) {
      console.log('useAnalytics', 'gtag.disableAnalytics');
      gtag.disableAnalytics();
    }
  });

  // exports
  return { optOut, logEvent };
});
