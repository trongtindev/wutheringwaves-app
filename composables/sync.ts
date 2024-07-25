import { defineStore } from 'pinia';
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
  const checkDebounce = useDebounceFn(() => check(), 2500);

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
      lastCloudChanged: lastCloudChanged.value
    });
  };

  const check = async () => {
    console.debug('useSync', 'check');

    const response = await api.get<ISyncPull>('sync/pull');
    lastCloudChanged.value = response.data.createdAt
      ? new Date(response.data.createdAt).getTime()
      : 0;

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
        onConfirm: () => pull()
      });
    } else if (lastCloudChanged.value != lastLocalChanged.value) {
      push();
    }
  };

  const push = async () => {
    console.debug('useSync', 'push');

    if (database.isInitialized === false) {
      throw new Error('database not initialized');
    }

    const db = await database.getInstance();
    const json = await db.exportJSON();
    const response = await api.post<ISyncPush>('sync/push', {
      data: JSON.stringify(json)
    });

    const time = new Date(response.data.createdAt).getTime();
    lastCloudChanged.value = time;
    lastLocalChanged.value = time;

    snackbar.show({
      content: i18n.t('sync.dataSynced')
    });
  };

  const pull = async () => {
    console.debug('useSync', 'pull');

    if (database.isInitialized === false) {
      throw new Error('database not initialized');
    }

    state.value = 'restore';
    const response = await api.get<ISyncPull>('sync/pull', {
      params: {
        withData: true
      }
    });

    try {
      // remove
      let db = await database.getInstance();
      await db.remove();

      // recreate
      await database.initialize({ override: true });
      db = await database.getInstance();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.importJSON(response.data.data as any);

      if (response.data.createdAt) {
        const time = new Date(response.data.createdAt).getTime();
        lastLocalChanged.value = time;
      }
      setTimeout(() => window.location.reload(), 250);
    } catch (error) {
      console.error(error);

      // TODO: handle
      alert(error);
    } finally {
      state.value = '';
    }
  };

  const eraseAll = async () => {
    if (auth.isLoggedIn === false) {
      throw new Error('not logged in');
    } else if (database.isInitialized === false) {
      throw new Error('database not initialized');
    }

    await api.delete('sync');

    lastCloudChanged.value = new Date().getTime();
  };

  // changes
  watch(
    () => auth.isLoggedIn,
    () => {
      if (auth.isLoggedIn && database.isInitialized) checkDebounce();
    }
  );

  watch(
    () => database.isInitialized,
    () => {
      if (database.isInitialized && auth.isLoggedIn) checkDebounce();
    }
  );

  watch(
    () => database.isChanged,
    () => {
      lastLocalChanged.value = new Date().getTime();
      if (auth.isLoggedIn) checkDebounce();
    }
  );

  // lifecycle
  onMounted(() => initialize());

  // exports
  return {
    state,
    lastLocalChanged,
    lastCloudChanged,
    pull,
    push,
    eraseAll
  };
});
