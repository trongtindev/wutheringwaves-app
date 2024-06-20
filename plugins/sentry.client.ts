import * as Sentry from '@sentry/vue';

export default defineNuxtPlugin((nuxtApp) => {
  const analytics = useAnalytics();
  const runtimeConfig = useRuntimeConfig();

  if (!analytics.optOut) {
    Sentry.init({
      app: nuxtApp.vueApp,
      dsn: runtimeConfig.public.SENTRY_DNS,
      enabled: !import.meta.dev,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration()
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      ignoreErrors: [
        'Network request failed',
        'Failed to fetch',
        'NetworkError',
        'Network Error',
        'Load failed',
        'TypeError: Load failed',
        'AxiosError'
      ]
    });
  }
});
