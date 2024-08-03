export const useAnalytics = defineStore('useAnalytics', () => {
  // uses
  const auth = useAuth();
  const { gtag } = import.meta.dev
    ? { gtag: undefined }
    : useScriptGoogleAnalytics();
  const { clarity } = import.meta.dev
    ? { clarity: undefined }
    : useScriptClarity();

  // functions
  const initialize = () => {
    // if (dataLayer) { }
    // if (clarity) { }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logEvent = async (eventName: any, eventParams?: any) => {
    console.debug('logEvent', eventName, eventParams);
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
