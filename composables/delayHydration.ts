export const useDelayHydration = defineStore('useDelayHydration', () => {
  // states
  const active = ref(false);

  // functions
  const initialize = () => {
    window.addEventListener('mousedown', dispose);
    window.addEventListener('mousemove', dispose);
  };

  const dispose = () => {
    active.value = true;
    window.removeEventListener('mousedown', dispose);
    window.removeEventListener('mousemove', dispose);
  };

  // lifecycle
  onMounted(initialize);

  // exports
  return { active };
});
