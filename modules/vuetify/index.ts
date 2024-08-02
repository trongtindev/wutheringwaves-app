import { defineNuxtModule, addPlugin, createResolver } from 'nuxt/kit';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtModule({
  meta: {
    name: 'vuetify',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  setup: (options, nuxt) => {
    nuxt.options.build.transpile.push('vuetify');

    const resolver = createResolver(import.meta.url);
    addPlugin(resolver.resolve('./plugins/vuetify.ts'));
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.vue ??= {};
      config.vue.template ??= {};
      config.vue.template.transformAssetUrls = transformAssetUrls;

      config.optimizeDeps ??= {};
      config.optimizeDeps.exclude ??= [];
      config.optimizeDeps.exclude.push('vuetify');

      config.plugins ??= [];
      config.plugins.push(
        vuetify({
          // styles: {
          //   configFile: './assets/settings.scss',
          // },
          autoImport: true,
        }),
      );
    },
  },
});
