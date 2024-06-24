import { defineStore } from 'pinia';

export const useBackup = defineStore('useBackup', () => {
  let checkSyncQueue: any;

  // uses
  const api = useApi();
  const i18n = useI18n();
  const auth = useAuth();
  const dialog = useDialog();
  const snackbar = useSnackbar();
  const database = useDatabase();

  // states
  const state = ref<'' | 'syncing' | 'synced' | 'restore'>('');
  const lastLocalChanged = useCookie<number>('lastLocalChanged');
  const lastCloudChanged = useCookie<number>('lastCloudChanged');
  const isCheckSync = ref(false);

  // functions
  /**
   *
   */
  const info = async () => {
    if (import.meta.server) {
      throw new Error('Cannot run on server-side!');
    }

    if (auth.isLoggedIn === false) {
      throw new Error('not logged in');
    } else if (database.isInitialized === false) {
      throw new Error('database not initialized');
    }

    const response = await api.getInstance().get<{
      data?: string;
      createdAt: string;
    }>('backup');
    return response.data;
  };

  /**
   *
   */
  const backup = async () => {
    if (import.meta.server) {
      throw new Error('Cannot run on server-side!');
    }

    if (auth.isLoggedIn === false) {
      throw new Error('not logged in');
    } else if (database.isInitialized === false) {
      throw new Error('database not initialized');
    }

    const db = await database.getInstance();
    const json = await db.exportJSON();
    const response = await api
      .getInstance()
      .post<{ createdAt: Date }>('backup', { data: JSON.stringify(json) });

    const time = response.data.createdAt.getTime();
    lastCloudChanged.value = time;
    lastLocalChanged.value = time;

    snackbar.show({
      content: i18n.t('backup.dataSynced')
    });
  };

  /**
   *
   */
  const restore = async () => {
    if (import.meta.server) {
      throw new Error('Cannot run on server-side!');
    }

    if (auth.isLoggedIn === false) {
      throw new Error('not logged in');
    } else if (database.isInitialized === false) {
      throw new Error('database not initialized');
    }

    state.value = 'restore';
    const response = await api
      .getInstance()
      .get<{ data: string; createdAt: Date }>('backup', {
        params: {
          withData: true
        }
      });

    // remove
    let db = await database.getInstance();
    await db.remove();

    // recreate
    await database.initialize({ override: true });
    db = await database.getInstance();

    await db.importJSON(response.data.data as any);

    const time = response.data.createdAt.getTime();
    lastLocalChanged.value = time;

    setTimeout(() => window.location.reload(), 250);
  };

  /**
   *
   */
  const eraseAll = async () => {
    if (auth.isLoggedIn === false) {
      throw new Error('not logged in');
    } else if (database.isInitialized === false) {
      throw new Error('database not initialized');
    }

    await api.getInstance().delete('backup');

    lastCloudChanged.value = new Date().getTime();
  };

  // TODO: check data conflict by key
  const checkSync = async () => {
    // prevent recheck
    if (isCheckSync.value) return;

    if (auth.isLoggedIn === false) {
      throw new Error('not logged in');
    } else if (database.isInitialized === false) {
      throw new Error('database not initialized');
    }

    const response = await api
      .getInstance()
      .get<{ createdAt?: Date }>('backup');
    lastCloudChanged.value = response.data.createdAt
      ? response.data.createdAt.getTime()
      : 0;

    console.warn(
      'backup',
      'checkSync',
      lastLocalChanged.value,
      lastCloudChanged.value
    );
    if (lastCloudChanged.value > lastLocalChanged.value) {
      dialog.show({
        title: i18n.t('backup.conflictTitle'),
        content: i18n.t('backup.conflictMessage'),
        persistent: true,
        cancelButtonText: i18n.t('backup.useLocalData'),
        confirmButtonText: i18n.t('backup.useCloudData'),
        onCancel: () => backup(),
        onConfirm: () => restore()
      });
    } else if (lastCloudChanged.value != lastLocalChanged.value) {
      backup();
    }
  };

  // functions
  const initialize = () => {
    if (import.meta.server) {
      throw new Error('Cannot initialize backup on server-side!');
    }
  };

  // changes
  if (import.meta.client) {
    watch(
      () => auth.isLoggedIn,
      (value) => {
        if (value && database.isInitialized) checkSync();
      }
    );

    watch(
      () => database.isChanged,
      () => {
        lastLocalChanged.value = new Date().getTime();

        if (!auth.isLoggedIn) return;
        if (checkSyncQueue) clearTimeout(checkSyncQueue);
        checkSyncQueue = setTimeout(() => checkSync(), 5000);
      }
    );
  }

  return {
    state,
    status: state,
    lastLocalChanged,
    lastCloudChanged,
    info,
    backup,
    restore,
    eraseAll,
    initialize
  };
});
