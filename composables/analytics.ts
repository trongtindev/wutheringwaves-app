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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logEvent = async (eventName: any, eventParams?: any) => {
    if (gtag) {
      gtag('event', eventName, eventParams);
    }
    if (clarity) {
      clarity('event', eventName, eventParams);
    }
  };

  // watch
  watch(
    () => auth.user,
    () => {
      if (auth.user) {
        if (gtag) {
          gtag('set', { email: auth.user.email, name: auth.user.name });
        }
        if (clarity) {
          clarity('identify', auth.user.email, auth.user.name);
        }
      }
    },
  );

  // exports
  return { logEvent };
});
