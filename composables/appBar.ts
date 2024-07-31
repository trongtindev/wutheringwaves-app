import { defineStore } from 'pinia';

export const useAppBar = defineStore('useAppBar', () => {
  // config
  const { APP_NAME } = useRuntimeConfig().public;

  // define
  const name = computed(() => APP_NAME);
  /**
   * @deprecated
   */
  const title = ref();
  const titleTag = ref();

  // functions
  const setTitle = (text: string, tag?: string) => {
    title.value = text;
    titleTag.value = tag || undefined;
  };

  // exports
  return {
    name,
    title,
    titleTag,
    setTitle,
  };
});
