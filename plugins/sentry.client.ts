import {
  init,
  httpClientIntegration,
  browserTracingIntegration,
  browserProfilingIntegration,
  replayIntegration,
  vueIntegration,
  breadcrumbsIntegration,
  feedbackIntegration,
  debugIntegration
} from '@sentry/vue';

export default defineNuxtPlugin((nuxtApp) => {
  const analytics = useAnalytics();
  const runtimeConfig = useRuntimeConfig();

  if (!analytics.optOut) {
    init({
      app: nuxtApp.vueApp,
      dsn: runtimeConfig.public.SENTRY_DNS,
      debug: runtimeConfig.public.SENTRY_DEBUG,
      enabled: !import.meta.dev,
      environment: import.meta.dev ? 'development' : 'production',
      integrations: [
        // Captures errors on failed requests from Fetch and XHR and attaches request and response information.
        httpClientIntegration(),
        browserTracingIntegration(),
        browserProfilingIntegration(),
        replayIntegration(),
        vueIntegration({
          app: nuxtApp.vueApp
        }),
        breadcrumbsIntegration(),
        feedbackIntegration(),
        ...(import.meta.dev ? [debugIntegration()] : [])
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      ignoreErrors: [
        'Network*',
        'Failed to fetch',
        'Load failed',
        'TypeError: Load failed',
        'AxiosError',
        'offline'
      ],
      // This option is required for capturing headers and cookies.
      sendDefaultPii: true
      // beforeSend(event, hint) {
      //   // Check if it is an exception, and if so, show the report dialog
      //   if (event.exception && event.event_id) {
      //     showReportDialog({ eventId: event.event_id });
      //   }
      //   return event;
      // }
    });
  }
});
