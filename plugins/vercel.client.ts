import { inject } from '@vercel/analytics';

export default defineNuxtPlugin(() => {
  const analytics = useAnalytics();

  if (analytics.optOut) {
    console.warn('vercel', 'analytics', 'optOut', true);
  }

  if (!import.meta.dev) {
    inject();
  }
});
