export const useElectron = defineStore('useElectron', () => {
  // states
  const state = ref<'' | 'starting'>('');

  // computed
  const enabled = computed(() => {
    return typeof window.electron != 'undefined';
  });

  // lifecycle
  onMounted(() => {
    if (enabled.value) state.value = 'starting';
  });

  // exports
  return { state, enabled };
});
