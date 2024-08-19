export const useSearch = defineStore('useSearch', () => {
  // uses
  const { slash } = useMagicKeys();

  // states
  const active = ref(false);

  // listens
  watch(slash, (value) => {
    if (!value) return;
    active.value = !active.value;
  });

  // exports
  return { active };
});
