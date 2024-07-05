import { defineStore } from 'pinia';
import type { Analytics } from 'firebase/analytics';
import type { FirebasePerformance } from 'firebase/performance';

export const useAnalytics = defineStore('useAnalytics', () => {
  // uses
  const device = useDevice();
  const nuxtApp = useNuxtApp();
  const delayHydration = useDelayHydration();

  // states
  const isInitialized = ref(false);
  const optOut = useCookie<boolean>('analytics.optOut');
  const analytics = ref<Analytics>();
  const performance = ref<FirebasePerformance>();
  const firebaseLogEvent = ref();

  // computed
  const dataCollectionEnabled = computed(() => {
    return !import.meta.dev && !optOut.value && !device.isCrawler;
  });

  // functions
  const initialize = async () => {
    if (device.isCrawler) return;
    if (isInitialized.value) return;
    if (!dataCollectionEnabled.value) return;
    console.debug('useAnalytics', 'initialize');

    const { getAnalytics, logEvent: _logEvent } = await import(
      'firebase/analytics'
    );
    analytics.value = getAnalytics(nuxtApp.$firebase.app);
    firebaseLogEvent.value = _logEvent;

    const { getPerformance } = await import('firebase/performance');
    performance.value = getPerformance(nuxtApp.$firebase.app);

    isInitialized.value = true;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logEvent = async (event: string, params: { [Key: string]: any }) => {
    if (isInitialized.value) {
      firebaseLogEvent.value(analytics.value, event, params);
    }
  };

  // listens
  watch(
    () => delayHydration.active,
    () => initialize()
  );

  // exports
  return { optOut, initialize, logEvent };
});
