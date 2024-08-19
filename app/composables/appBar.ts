export const useAppBar = defineStore('useAppBar', () => {
  // define
  const title = ref();
  const titleTag = ref();

  // functions
  const setTitle = (text: string, tag?: string) => {
    title.value = text;
    titleTag.value = tag || undefined;
  };

  // exports
  return {
    title,
    titleTag,
    setTitle,
  };
});
