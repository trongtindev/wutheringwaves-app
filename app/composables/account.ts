import type { AccountDocument } from '~/database/documents/account';

export const useAccount = defineStore('useAccount', () => {
  // uses
  const i18n = useI18n();
  const route = useRoute();
  const database = useDatabase();
  const notification = useNotification();
  const importConvene = useImportConvene();

  // states
  const items = ref<AccountDocument[]>([]);
  const active = ref<AccountDocument>();

  // functions
  const initialize = () => {
    loadItems();

    if (items.value.length > 0) {
      startImport();
    }
  };

  const loadItems = () => {
    items.value = database.accounts.find().map((e) => e[1]);
    if (items.value.length > 0) {
      active.value = items.value[0];
    } else {
      active.value = undefined;
    }
  };

  // computed
  const isActive = (playerId: string) => {
    return active.value && active.value.playerId === playerId;
  };

  const timeOffset = computed<number>(() => {
    if (active.value) {
      return timeOffsetIds[active.value.serverId];
    }
    return 0;
  });

  // functions
  const setActive = (playerId: string) => {
    const [id, doc] = database.accounts.findOne({ playerId });
    if (!id) return;
    active.value = doc;
  };

  // events
  const startImport = () => {
    console.debug('startImport');
    items.value.forEach(async (account) => {
      if (!account.conveneHistoryUrl) return;
      if (typeof route.query.forceAutoImport === 'undefined') {
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
      }
      const nid = notification.create({
        title: i18n.t('autoImport.notificationTitle'),
        message: i18n.t('autoImport.notificationMessage', [account.playerId]),
        persistent: true,
      });

      console.debug('autoImport', account.playerId, 'start');
      importConvene
        .start(account.conveneHistoryUrl)
        .then((result) => {
          console.debug('autoImport', account.playerId, 'done', result);
          notification.create({
            title: i18n.t('autoImport.done.title'),
            message: i18n.t('autoImport.done.message', [account.playerId]),
            color: 'success',
          });
        })
        .catch((error) => {
          console.error(error);
          console.warn('autoImport', account.playerId, error.message);
        })
        .finally(() => {
          console.debug('autoImport', account.playerId, 'finally');
          notification.remove(nid);
        });
    });
  };

  // changes
  watch(() => database.onChanged, loadItems);

  // lifecycle
  onMounted(initialize);

  return {
    items,
    active,
    isActive,
    timeOffset,
    setActive,
  };
});
