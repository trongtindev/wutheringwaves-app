import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import dotenv from 'dotenv';

// environment
dotenv.config({ path: './.env.production', override: true });
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './.env.development', override: true });
}
dotenv.config({ path: './.env', override: true });

const {
  // general
  NUXT_PUBLIC_SITE_URL,
  NUXT_PUBLIC_API_URL,
  NUXT_PUBLIC_APP_VERSION,
  // adsense
  GOOGLE_ADSENSE_TEST_MODE,
  GOOGLE_ADSENSE_ID,
  // firebase
  NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NUXT_PUBLIC_FIREBASE_API_KEY,
  NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  NUXT_PUBLIC_FIREBASE_APP_ID,
  // sentry
  NUXT_PUBLIC_SENTRY_DEBUG,
  NUXT_PUBLIC_SENTRY_DNS,
  // dayjs
  DAYJS_TIMEZONE
} = process.env;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $production: {},
  $development: {},
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    'nuxt-jsonld',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    '@nuxtjs/device'
  ],

  build: {
    transpile: ['vuetify']
  },

  sitemap: {
    autoLastmod: true,
    exclude: ['/settings'],
    sources: [
      '/api/__sitemap__/characters',
      '/api/__sitemap__/echos',
      '/api/__sitemap__/items',
      '/api/__sitemap__/trophies',
      '/api/__sitemap__/weapons'
    ]
  },

  css: ['~/assets/tiptap.scss', '~/assets/vuetify.css'],

  typescript: {
    strict: true
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  },

  site: {
    url: NUXT_PUBLIC_SITE_URL
  },

  sourcemap: {
    server: true,
    client: true
  },

  devtools: { enabled: true },
  components: ['./components'],

  imports: {
    dirs: ['./composables', './components']
  },

  // modules config
  i18n: {
    vueI18n: './i18n.config.ts',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root'
    },
    locales: [
      { name: 'English', code: 'en', iso: 'en', isCatchallLocale: true },
      { name: 'Vietnamese', code: 'vi', iso: 'vi' }
    ]
  },

  pinia: {
    storesDirs: ['./composables/**']
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    },
    build: {
      terserOptions: {
        compress: {
          drop_console: false,
          keep_classnames: false
        }
      },
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('vuetify')) {
              return 'vuetify';
            } else if (id.includes('axios')) {
              return 'axios';
            } else if (id.includes('mingo')) {
              return 'mingo';
            } else if (id.includes('sentry')) {
              return 'sentry';
            } else if (id.includes('rxdb')) {
              return 'rxdb';
            } else if (id.includes('rxjs')) {
              return 'rxjs';
            } else if (id.includes('@vueuse')) {
              return 'vueuse';
            } else if (id.includes('src/collections')) {
              return 'collections';
            } else if (id.includes('dayjs')) {
              return 'dayjs';
            } else if (id.includes('tiptap')) {
              return 'tiptap';
            } else if (id.includes('chartjs')) {
              return 'chartjs';
            } else if (id.includes('leaflet')) {
              return 'leaflet';
            }
          }
        }
      }
    },
    plugins: [vuetify({ autoImport: true })]
    // server: {
    //   proxy: {
    //     '/__/auth': {
    //       changeOrigin: true,
    //       target: `https://${NUXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`
    //     },
    //     '/__/firebase': {
    //       changeOrigin: true,
    //       target: `https://${NUXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`
    //     }
    //   }
    // }
  },

  vueuse: { ssrHandlers: true },

  appConfig: {
    buildNumber: Date.now()
  },

  // environments
  runtimeConfig: {
    public: {
      // app
      SITE_URL: NUXT_PUBLIC_SITE_URL,
      APP_NAME: 'Astrite.app',
      APP_REPO: 'https://github.com/trongtindev/astrite-app',
      APP_DISCORD: 'https://discord.gg/MxxYyUJEfT',
      APP_VERSION: NUXT_PUBLIC_APP_VERSION,
      // api
      API_URL: NUXT_PUBLIC_API_URL,
      API_TIMEOUT: 15000,
      // firebase
      FIREBASE_API_KEY: NUXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_PROJECT_ID: NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_AUTH_DOMAIN: NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_APP_ID: NUXT_PUBLIC_FIREBASE_APP_ID,
      // sentry
      SENTRY_DNS: NUXT_PUBLIC_SENTRY_DNS,
      SENTRY_DEBUG: NUXT_PUBLIC_SENTRY_DEBUG == 'true',
      // Adsense
      GOOGLE_ADSENSE_ID: GOOGLE_ADSENSE_ID,
      GOOGLE_ADSENSE_TEST_MODE: GOOGLE_ADSENSE_TEST_MODE === 'true',
      // dayjs
      DAYJS_TIMEZONE: DAYJS_TIMEZONE
    }
  },

  compatibilityDate: '2024-07-05'
});
