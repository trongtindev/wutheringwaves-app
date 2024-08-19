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

  // lifecycle
  onMounted(() => initialize());
  onUnmounted(() => dispose());

  // exports
  return { checkAppForUpdates };
});
