export const useImportConvene = defineStore('useImportConvene', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let interval: any = null;

  // uses
  const account = useAccount();
  const database = useDatabase();

  // states
  const lastSchedule = ref(0);

  // events
  const onSchedule = () => {};

  // functions
  const importHistory = () => {};

  // lifecycle
  onNuxtReady(() => {
    interval = setInterval(() => onSchedule, 1000 * 5000);
  });
  onUnmounted(() => {
    if (interval) clearInterval(interval);
  });

  // exports
  return { importHistory };
});
