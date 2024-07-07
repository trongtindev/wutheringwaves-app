import { defineStore } from 'pinia';

export const useAccount = defineStore('useAccount', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let interval: any = null;

  // uses
  const i18n = useI18n();
  const snackbar = useSnackbar();
  const database = useDatabase();
  const notification = useNotification();
  const importConvene = useImportConvene();
  // const conveneChangedDebounce = useDebounceFn()

  // states
  const items = ref<any[]>([]);
  const onConveneChanged = ref<[string, string]>(['', '']);
  /**
   * This is playerId in-game
   */
  const active = ref<string>(null as any);
  const timeOffset = ref(8);

  // functions
  const initialize = async () => {
    if (!database.isInitialized) {
      setTimeout(() => initialize(), 250);
      return;
    }

    // register hook
    const db = await database.getInstance();
    db.accounts.postInsert(() => loadItems(), false);

    await loadItems();
    if (items.value.length > 0) onSchedule();
  };

  const upsert = async (playerId: string, serverId: string) => {
    const db = await database.getInstance();
    const exists = await db.accounts
      .findOne({
        selector: { playerId }
      })
      .exec();
    if (!exists) {
      snackbar.show({
        content: i18n.t('accounts.newAccountDetected')
      });

      await db.accounts.upsert({
        playerId,
        serverId
      });
    }
  };

  const loadItems = async () => {
    const db = await database.getInstance();
    const result = await db.accounts
      .find()
      .sort({
        createdAt: 'asc'
      })
      .exec();
    if (result.length > 0) {
      // TODO: save default account
      // set first account as default
      active.value = result[0].playerId;
    }

    items.value = result as any;
  };

  const getDocument = async (playerId: string) => {
    const db = await database.getInstance();
    return await db.accounts
      .findOne({
        selector: {
          playerId
        }
      })
      .exec();
  };

  const getConveneHistoryUrl = async (playerId?: string) => {
    playerId ??= active.value;
    if (playerId) {
      const document = await getDocument(playerId);
      return document ? document.conveneHistoryUrl : undefined;
    }
  };

  const setConveneHistoryUrl = async (url: string, playerId?: string) => {
    playerId ??= active.value;
    const document = await getDocument(playerId);
    await document?.update({
      $set: {
        conveneHistoryUrl: url
      }
    });
  };

  // events
  const onSchedule = () => {
    items.value.forEach(async (account) => {
      if (!account.conveneHistoryUrl) return;
      if (!account.autoImport) {
        console.debug('autoImport', account.playerId, 'disabled');
        return;
      }
      if (
        account.lastImport &&
        Date.now() - 60 * 15 * 1000 < account.lastImport
      ) {
        console.debug('autoImport', account.playerId, 'skip');
        return;
      }

      const nid = await notification.create({
        title: i18n.t('account.autoImport.notificationTitle'),
        message: i18n.t('account.autoImport.notificationMessage', [
          account.playerId
        ]),
        persistent: true
      });

      console.debug('autoImport', account.playerId, 'start');
      importConvene
        .start(account.conveneHistoryUrl)
        .then(() => {
          console.debug('autoImport', account.playerId, 'done');
          onConveneChanged.value = [account.playerId, randomId()];
        })
        .catch((error) => {
          console.error(error);
          console.warn('autoImport', account.playerId, error.message);
        })
        .finally(() => {
          console.debug('autoImport', account.playerId, 'finally');

          getDocument(account.playerId).then((doc) => {
            if (!doc) return;
            doc.patch({ lastImport: Date.now() });
          });
          notification.remove(nid);
        });
    });
  };

  // changes
  watch(active, (newValue, oldValue) => {
    if (newValue) {
      getDocument(newValue).then((result) => {
        if (!result) return;
        timeOffset.value = timeOffsetIds[result.serverId];
      });
    }

    if (newValue && oldValue) {
      snackbar.show({
        content: i18n.t('accounts.successfullySwitched', [newValue])
      });
    }
  });

  // lifecycle
  onNuxtReady(() => {
    initialize();

    // schedule
    const timer = 60 * 5 * 1000;
    interval = setInterval(() => onSchedule, timer);
  });

  onUnmounted(() => {
    if (interval) clearInterval(interval);
  });

  return {
    items,
    active,
    timeOffset,
    onConveneChanged,
    upsert,
    getDocument,
    getConveneHistoryUrl,
    setConveneHistoryUrl,
    initialize
  };
});
