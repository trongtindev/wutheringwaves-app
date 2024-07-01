import { defineStore } from 'pinia';

export const useApp = defineStore('useApp', () => {
  let interval: any;

  // uses
  const i18n = useI18n();
  const dialog = useDialog();
  const appConfig = useAppConfig();
  const runtimeConfig = useRuntimeConfig();

  // config
  const { APP_NAME, APP_DISCORD, APP_VERSION, APP_REPO } = runtimeConfig.public;

  // define
  const name = computed(() => APP_NAME);
  const title = ref();
  const discord = computed(() => APP_DISCORD);
  const version = computed(() => APP_VERSION);
  const githubRepo = computed(() => APP_REPO);

  // states
  const fluid = ref(false);

  // computed
  const inDev = computed(() => import.meta.dev);
  const indBeta = computed(() => APP_VERSION.startsWith('0.'));
  const indProd = computed(() => !import.meta.dev);

  // functions
  const initialize = () => {
    if (import.meta.server) {
      throw new Error('Cannot run app.initialize on server-side!');
    }

    if (!import.meta.dev) {
      checkForUpdates();
      interval = setInterval(checkForUpdates, 60 * 5 * 1000);
    }
  };

  const checkForUpdates = async () => {
    try {
      const { buildNumber } = await $fetch<{ buildNumber: number }>(
        '/api/checkForUpdates',
        {
          signal: AbortSignal.timeout(5000)
        }
      );

      console.debug('checkForUpdates', appConfig.buildNumber, buildNumber);
      if (appConfig.buildNumber === buildNumber) {
        return;
      }

      dialog.show({
        title: i18n.t('common.updateFound'),
        content: i18n.t('common.updateFoundMessage'),
        onConfirm: () => {
          reloadNuxtApp();
        }
      });
      clearInterval(interval);
    } catch (error: any) {
      console.error(error);
    }
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // exports
  return {
    name,
    title,
    version,
    discord,
    githubRepo,
    fluid,
    inDev,
    indProd,
    indBeta,
    initialize,
    scrollTop
  };
});
