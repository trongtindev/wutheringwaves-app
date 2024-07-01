export default defineNuxtPlugin(async (nuxtApp) => {
  const { VueMasonryPlugin } = await import('vue-masonry');
  nuxtApp.vueApp.use(VueMasonryPlugin);
});
