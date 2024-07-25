import axios from 'axios';
import axiosRetry from 'axios-retry';

export const useUpdater = defineStore('useUpdater', () => {
  // late
  let interval: NodeJS.Timeout;

  // uses
  const http = axios.create();
  const i18n = useI18n();
  const dialog = useDialog();
  const device = useDevice();
  const appConfig = useAppConfig();
  const desktopApp = useDesktopApp();
  const isUpdateAvailable = ref(false);

  // functions
  const initialize = () => {
    if (device.isCrawler) return;

    axiosRetry(http, { validateResponse: () => true });

    if (desktopApp.enabled) {
      checkAppForUpdates();
    } else {
      checkWebForUpdates();
    }
  };

  const dispose = () => {
    if (interval) clearInterval(interval);
  };

  const checkAppForUpdates = async () => {
    if (import.meta.dev) return;

    if (!interval) {
      interval = setInterval(() => checkAppForUpdates(), 60 * 5 * 1000);
    }
  };

  const checkWebForUpdates = async () => {
    if (import.meta.dev) return;

    if (!interval) {
      interval = setInterval(() => checkWebForUpdates(), 60 * 5 * 1000);
    }

    // fetch version
    const { data, status } = await http.get<{ buildNumber: number }>(
      '/api/version'
    );
    if (status != 200) return;

    console.debug('updater', appConfig.buildNumber, data.buildNumber);
    if (data.buildNumber && appConfig.buildNumber === data.buildNumber) {
      return;
    }
    isUpdateAvailable.value = true;

    // TODO: move to manager component
    dialog.show({
      title: i18n.t('updater.title'),
      content: i18n.t('updater.message'),
      cancelButtonText: i18n.t('updater.later'),
      confirmButtonText: i18n.t('updater.refresh'),
      onConfirm: () => {
        reloadNuxtApp();
      },
      persistent: true
    });
    clearInterval(interval);
  };

  // lifecycle
  onMounted(() => initialize());
  onUnmounted(() => dispose());

  // exports
  return { checkAppForUpdates, checkWebForUpdates };
});
