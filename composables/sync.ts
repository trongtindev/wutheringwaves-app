import type { ISyncPull, ISyncPush } from '~/interfaces/sync';

export const useSync = defineStore('useSync', () => {
  // uses
  const api = useApi();
  const i18n = useI18n();
  const auth = useAuth();
  const route = useRoute();
  const dialog = useDialog();
  const snackbar = useSnackbar();
  const database = useDatabase();

  // states
  const state = ref<'' | 'syncing' | 'synced' | 'restore'>('');
  const lastLocalChanged = useLocalStorage('lastLocalChanged', 0);
  const lastCloudChanged = useLocalStorage('lastCloudChanged', 0);

  // functions
  const initialize = () => {
    if (route.query.syncTestLocalChanged) {
      lastLocalChanged.value = 1;
      lastCloudChanged.value = 0;
    } else if (route.query.syncTestCloudChanged) {
      lastLocalChanged.value = 0;
      lastCloudChanged.value = 1;
    }

    console.log('useSync', 'initialize', {
      lastLocalChanged: lastLocalChanged.value,
      lastCloudChanged: lastCloudChanged.value,
    });
    check();
  };

  const check = async () => {
    if (!auth.user) return;
    console.debug('useSync', 'check');

    const response = await api.get<ISyncPull>('sync/pull');
    lastCloudChanged.value = response.data.createdAt
      ? new Date(response.data.createdAt).getTime()
      : 0;
    console.debug('useSync', 'check', {
      lastLocalChanged: lastLocalChanged.value,
      lastCloudChanged: lastCloudChanged.value,
    });

    if (lastCloudChanged.value && !lastLocalChanged.value) {
      pull();
    } else if (lastCloudChanged.value > lastLocalChanged.value) {
      dialog.show({
        persistent: true,
        title: i18n.t('sync.conflict.title'),
        content: i18n.t('sync.conflict.message'),
        cancelButtonText: i18n.t('sync.conflict.useLocalData'),
        confirmButtonText: i18n.t('sync.conflict.useCloudData'),
        onCancel: () => push(),
        onConfirm: () => pull(),
      });
    } else if (lastCloudChanged.value != lastLocalChanged.value) {
      push();
    }
  };

  const checkDebounce = useDebounceFn(() => check(), 2500);

  const push = async () => {
    console.debug('useSync', 'push');

    const response = await api.post<ISyncPush>('sync/push', {
      data: database.exportJson(),
    });

    const time = new Date(response.data.createdAt).getTime();
    lastCloudChanged.value = time;
    lastLocalChanged.value = time;

    snackbar.show({
      content: i18n.t('sync.dataSynced'),
    });
  };

  const pull = async () => {
    console.debug('useSync', 'pull');

    state.value = 'restore';
    const response = await api.get<ISyncPull>('sync/pull', {
      params: {
        withData: true,
      },
    });

    try {
      database.importJson(response.data.content);
    } catch (error) {
      console.error(error);

      // TODO: handle
      alert(error);
    } finally {
      state.value = '';
    }
  };

  const eraseAll = async () => {
    database.eraseAllData();
    if (auth.isLoggedIn) {
      await api.delete('sync');
    }
    lastCloudChanged.value = new Date().getTime();
  };

  // changes
  watch(
    () => auth.user,
    () => checkDebounce(),
  );

  watch(
    () => database.onChanged,
    () => {
      lastLocalChanged.value = new Date().getTime();
      if (auth.isLoggedIn) checkDebounce();
    },
  );

  // lifecycle
  onMounted(initialize);

  // exports
  return {
    state,
    lastLocalChanged,
    lastCloudChanged,
    pull,
    push,
    eraseAll,
  };
});
