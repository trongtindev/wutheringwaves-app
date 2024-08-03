import type { AccountDocument } from './database';

export const useAccount = defineStore('useAccount', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let interval: any = null;

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
    items.value = database.accounts.find().map((e) => e[1]);
    if (items.value.length > 0) {
      active.value = items.value[0];
    }
    console.debug('account', items.value.length, active.value);
  };

  // computed
  const isActive = (playerId: string) => {
    return active.value && active.value.playerId === playerId;
  };

  const timeOffset = computed(() => {
    return 0;
  });

  // functions
  const setActive = (playerId: string) => {
    const [id, doc] = database.accounts.findOne({ playerId });
    if (!id) return;
    active.value = doc;
  };

  // events
  const onSchedule = () => {
    // items.value.forEach(async (account) => {
    //   if (!account.conveneHistoryUrl) return;
    //   if (typeof route.query.forceAutoImport === 'undefined') {
    //     if (!account.autoImport) {
    //       console.debug('autoImport', account.playerId, 'disabled');
    //       return;
    //     }
    //     if (
    //       account.lastImport &&
    //       Date.now() - 60 * 15 * 1000 < account.lastImport
    //     ) {
    //       console.debug('autoImport', account.playerId, 'skip');
    //       return;
    //     }
    //   }
    //   const nid = notification.create({
    //     title: i18n.t('autoImport.notificationTitle'),
    //     message: i18n.t('autoImport.notificationMessage', [account.playerId]),
    //     persistent: true,
    //   });
    //   console.debug('autoImport', account.playerId, 'start');
    //   importConvene
    //     .start(account.conveneHistoryUrl)
    //     .then((result) => {
    //       console.debug('autoImport', account.playerId, 'done', result);
    //       conveneChangedDebounce(account.playerId);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //       console.warn('autoImport', account.playerId, error.message);
    //     })
    //     .finally(() => {
    //       console.debug('autoImport', account.playerId, 'finally');
    //       notification.remove(nid);
    //     });
    // });
  };

  // changes
  watch(
    () => database.onChanged,
    () => {
      console.log('account', 'database changed');
      initialize();
    },
  );

  // lifecycle
  onMounted(initialize);

  onNuxtReady(() => {
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
    isActive,
    timeOffset,
    setActive,
  };
});
