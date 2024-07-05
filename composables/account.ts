// import type { AccountDocument } from '@/collections/account';
import { defineStore } from 'pinia';

export const useAccount = defineStore('useAccount', () => {
  // uses
  const i18n = useI18n();
  const snackbar = useSnackbar();
  const database = useDatabase();

  // states
  const items = ref<any[]>([]);
  /**
   * This is playerId in-game
   */
  const active = ref<string>(null as any);
  const timeOffset = ref(8);

  // functions
  const initialize = async () => {
    if (import.meta.server) {
      throw new Error('Cannot initialize account on server-side!');
    }

    if (!database.isInitialized) {
      setTimeout(() => initialize(), 250);
      return;
    }

    // register hook
    const db = await database.getInstance();
    db.accounts.postInsert(() => loadItems(), false);

    await loadItems();
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

  /**
   * @deprecated
   */
  const getAccounts = <T>() => {
    return items.value as T;
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

  return {
    items,
    active,
    timeOffset,
    upsert,
    getAccounts,
    getDocument,
    getConveneHistoryUrl,
    setConveneHistoryUrl,
    initialize
  };
});
