export const useSite = defineStore('useSite', () => {
  const { SITE_PREVIEW } = useRuntimeConfig().public;

  // computed
  const inDev = import.meta.dev;
  const isPreview = SITE_PREVIEW === 'true';
  const isProduction = !import.meta.dev && !isPreview;

  // exports
  return { inDev, isPreview, isProduction };
});
