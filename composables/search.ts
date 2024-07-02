export const useSearch = defineStore('useSearch', () => {
  // uses
  const { controlLeft, space } = useMagicKeys();

  // states
  const active = ref(false);

  // listens
  watchEffect(() => {
    if (controlLeft.value && space.value) {
      active.value = !active.value;
    }
  });

  // exports
  return { active };
});
