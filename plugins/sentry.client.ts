export default defineNuxtPlugin(async (nuxtApp) => {
  const device = useDevice();
  const analytics = useAnalytics();
  const runtimeConfig = useRuntimeConfig();

  if (!device.isCrawler && !analytics.optOut) {
    const {
      init,
      httpClientIntegration,
      browserTracingIntegration,
      browserProfilingIntegration,
      vueIntegration,
      breadcrumbsIntegration,
      debugIntegration
    } = await import('@sentry/vue');

    init({
      app: nuxtApp.vueApp,
      dsn: runtimeConfig.public.SENTRY_DNS,
      debug: runtimeConfig.public.SENTRY_DEBUG,
      enabled: !import.meta.dev,
      environment: import.meta.dev ? 'development' : 'production',
      integrations: [
        vueIntegration({
          app: nuxtApp.vueApp
        }),
        // Captures errors on failed requests from Fetch and XHR and attaches request and response information.
        httpClientIntegration(),
        browserTracingIntegration(),
        browserProfilingIntegration(),
        breadcrumbsIntegration(),
        ...(import.meta.dev ? [debugIntegration()] : [])
      ],
      tracesSampleRate: 1.0,
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
