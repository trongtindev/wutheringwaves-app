import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import dotenv from 'dotenv';
import pkg from './package.json';

// environment
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './.env.development', override: true });
} else {
  dotenv.config({ path: './.env.production', override: true });
}
dotenv.config({ path: './.env', override: true });

const {
  // general
  NUXT_PUBLIC_SITE_URL,
  NUXT_PUBLIC_API_URL,
  // adsense
  GOOGLE_ADSENSE_TEST_MODE,
  // firebase
  NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NUXT_PUBLIC_FIREBASE_API_KEY,
  NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  // sentry
  NUXT_PUBLIC_SENTRY_DEBUG
} = process.env;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: {
    // ssr: false,
    runtimeConfig: {
      public: {
        SITE_URL: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:8080',
        googleAdsense: {
          test: process.env.GOOGLE_ADSENSE_TEST_MODE === 'true' || true
        }
        // FIREBASE_AUTH_DOMAIN:
        //   process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost:8080'
      }
    }
  },
  $production: {
    nitro: {
      storage: {
        data: {
          driver: 'vercelKV'
        }
      }
    }
  },
  css: ['~/assets/tiptap.scss'],
  typescript: {
    strict: true
  },
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    'nuxt-jsonld',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    '@nuxtjs/device',
    'nuxt3-leaflet'
  ],
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  },
  routeRules: {
    '/': {
      prerender: true
    },
    '/echos': {
      prerender: true
    },
    '/echos/**': {
      prerender: true
    },
    '/weapons': {
      prerender: true
    },
    '/weapons/**': {
      prerender: true
    },
    '/characters': {
      prerender: true
    },
    '/characters/**': {
      prerender: true
    },
    '/items': {
      prerender: true
    },
    '/items/**': {
      prerender: true
    },
    '/trophies': {
      prerender: true
    },
    '/trophies/**': {
      prerender: true
    }
  },
  site: {
    url: 'https://wutheringwaves.app'
  },
  devServer: {
    port: 8080
  },
  sourcemap: {
    server: false,
    client: true
  },
  build: {
    transpile: ['vuetify']
  },
  devtools: { enabled: true },
  components: ['./components'],
  imports: {
    dirs: ['./composables', './components']
  },
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
    ],
    baseUrl: 'https://wutheringwaves.app'
  },
  pinia: {
    storesDirs: ['./composables/**']
  },
  eslint: {
    // checker: true
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
          drop_console: false
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
            }
          }
        }
      }
    },
    plugins: [vuetify({ autoImport: true })],
    server: {
      proxy: {
        '/__/auth': {
          changeOrigin: true,
          target: 'https://wuthering-357ea.firebaseapp.com'
        },
        '/__/firebase': {
          changeOrigin: true,
          target: 'https://wuthering-357ea.firebaseapp.com'
        }
      }
    }
  },
  appConfig: {
    buildNumber: Date.now()
  },
  runtimeConfig: {
    public: {
      // app
      SITE_URL:
        process.env.NUXT_PUBLIC_SITE_URL || 'https://wutheringwaves.app',
      APP_NAME: 'WutheringWaves.app',
      APP_REPO: 'https://github.com/trongtindev/wuthering-waves-app',
      APP_DISCORD: 'https://discord.gg/MxxYyUJEfT',
      APP_VERSION: process.env.NUXT_PUBLIC_APP_VERSION || pkg.appVersion,
      // api
      API_URL:
        process.env.NUXT_PUBLIC_API_URL || 'https://api.wutheringwaves.app',
      API_TIMEOUT: 15000,
      // firebase
      FIREBASE_API_KEY:
        process.env.NUXT_PUBLIC_FIREBASE_API_KEY ||
        'AIzaSyDbcnxqQFlNfsGIBE9INTXsI5MfrTQ_GM0',
      FIREBASE_PROJECT_ID:
        process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'wuthering-357ea',
      FIREBASE_AUTH_DOMAIN:
        process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'wutheringwaves.app',
      // sentry
      SENTRY_DNS:
        'https://214a17c9a4934da4031b2e8faa80e026@o4505463839850496.ingest.us.sentry.io/4507391548784640',
      SENTRY_DEBUG: process.env.NUXT_PUBLIC_SENTRY_DEBUG == 'true',
      // Adsense
      GOOGLE_ADSENSE_ID:
        process.env.GOOGLE_ADSENSE_ID || 'ca-pub-8470189548892016',
      GOOGLE_ADSENSE_TEST_MODE: process.env.GOOGLE_ADSENSE_TEST_MODE === 'true'
    }
  }
});
