import { vuetifyConfig } from '../runtime/config';

export default defineNuxtPlugin({
  parallel: true,
  setup: (nuxtApp) => {
    nuxtApp.vueApp.use(vuetifyConfig);
    nuxtApp.provide('vuetify', vuetifyConfig);
  },
});
