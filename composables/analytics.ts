export const useAnalytics = defineStore('useAnalytics', () => {
  // uses
  const auth = useAuth();
  const device = useDevice();

  const { GOOGLE_TAG_ID, CLARITY_ID } = useRuntimeConfig().public;
  const { gtag } = import.meta.dev
    ? { gtag: undefined }
    : useScriptGoogleAnalytics({
        id: GOOGLE_TAG_ID,
      });
  const { clarity } = import.meta.dev
    ? { clarity: undefined }
    : useScriptClarity({
        id: CLARITY_ID,
      });

  // functions
  const initialize = () => {
    if (device.isCrawler) return;

    if (gtag) {
      gtag('js', new Date());
      gtag('config', GOOGLE_TAG_ID);
    }

    // if (clarity) { }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logEvent = async (eventName: any, eventParams?: any) => {
    if (gtag) {
      gtag('event', eventName, eventParams);
    }
  };

  // watch
  watch(
    () => auth.user,
    () => {
      if (auth.user) {
        if (clarity) {
          clarity('identify', auth.user.email, auth.user.name);
        }
      }
    },
  );

  // lifecycle
  onNuxtReady(initialize);

  // exports
  return { logEvent };
});
