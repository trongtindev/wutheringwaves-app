import { inject } from '@vercel/analytics';

export default defineNuxtPlugin(() => {
  const analytics = useAnalytics();

  if (!import.meta.dev) {
    if (analytics.optOut) {
      console.warn('vercel', 'analytics', 'optOut', true);
    }
    inject();
  }
});
