import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import dotenv from 'dotenv';
import type { LocaleObject } from '@nuxtjs/i18n';

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
  // google
  GOOGLE_TAG_ID,
  GOOGLE_CLIENT_ID,
  // adsense
  GOOGLE_ADSENSE_TEST_MODE,
  GOOGLE_ADSENSE_ID,
  // sentry
  NUXT_PUBLIC_SENTRY_DEBUG,
  NUXT_PUBLIC_SENTRY_DNS
} = process.env;

const localesMetadata: LocaleObject[] = [
  { name: 'English', code: 'en', iso: 'en', isCatchallLocale: true },
  { name: 'Indonesia', code: 'id', iso: 'id' },
  { name: '日本語', code: 'ja', iso: 'ja' },
  { name: '한국어', code: 'ko', iso: 'ko' },
  { name: 'ภาษาไทย', code: 'th', iso: 'th', rtl: true },
  { name: 'Türkçe', code: 'tr', iso: 'tr' },
  { name: 'Tiếng Việt', code: 'vi', iso: 'vi' },
  { name: 'Ukrainian', code: 'uk', iso: 'uk' },
  { name: '中文(简体)', code: 'zh', iso: 'zh' }
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: {
    // ssr: false,
    // debug: true,
  },

  modules: [
    // 3rd
    'nuxt-jsonld',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    '@nuxtjs/robots',
    '@nuxtjs/device',
    // performance
    '@nuxtjs/fontaine',
    // dev
    '@nuxt/eslint'
  ],

  routeRules: {
    '/': {
      prerender: true
    },
    '/**': {
      prerender: true
    },
    '/settings': {
      robots: false
    },
    '/convene-history/import': {
      robots: false
    },
    '/license': {
      robots: false
    },
    '/donation': {
      robots: false
    },
    '/guides/editor': {
      robots: false,
      prerender: false
    },
    '/codes': { prerender: true },
    '/guides/rss': {
      proxy: '/api/rss/guides'
    },
    '/characters/rss': {
      proxy: '/api/rss/characters'
    },
    // TODO: remove soon
    '/echos/**': {
      redirect: '/echoes/**'
    }
  },

  sitemap: {
    autoLastmod: true,
    exclude: [
      '/settings',
      '/convene-history/import',
      '/privacy-policy',
      '/license',
      '/donation'
    ],
    sources: [
      '/api/__sitemap__/characters',
      '/api/__sitemap__/echoes',
      '/api/__sitemap__/items',
      '/api/__sitemap__/trophies',
      '/api/__sitemap__/weapons'
    ]
  },

  css: ['~/assets/main.css', '~/assets/main.scss', '~/assets/tiptap.scss'],

  features: {
    inlineStyles: false
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    },
    serverAssets: [
      {
        baseName: 'resources',
        dir: './resources'
      }
    ]
  },

  site: {
    url: NUXT_PUBLIC_SITE_URL
  },

  sourcemap: {
    server: false,
    client: true
  },

  devtools: { enabled: false },

  telemetry: false,

  components: ['./components'],

  imports: {
    dirs: ['./composables', './components']
  },

  // modules config
  i18n: {
    vueI18n: './i18n/i18n.config.ts',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root'
    },
    locales: localesMetadata,
    experimental: {
      localeDetector: './i18n/i18n.detector.ts'
    }
  },

  pinia: {
    storesDirs: ['./composables/**']
  },

  vueuse: { ssrHandlers: true },

  vite: {
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.json']
    },
    vue: {
      template: {
        transformAssetUrls
      }
    },
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 250 * 1024,
          manualChunks: (id) => {
            if (id.includes('resources/characters')) {
              return 'resources-characters';
            } else if (id.includes('resources/echoes')) {
              return 'resources-echoes';
            } else if (id.includes('resources/items')) {
              return 'resources-items';
            } else if (id.includes('resources/weapons')) {
              return 'resources-weapons';
            } else if (id.includes('resources')) {
              return 'resources-other';
            }
          }
        }
      }
    },
    plugins: [
      vuetify({
        autoImport: true
      })
    ]
  },

  build: {
    transpile: ['vuetify']
  },

  appConfig: {
    buildNumber: Date.now()
  },

  // environments
  runtimeConfig: {
    public: {
      // general
      SITE_URL: NUXT_PUBLIC_SITE_URL,
      APP_NAME: 'WutheringWaves.app',
      APP_REPO: 'https://github.com/trongtindev/wutheringwaves-app',
      APP_DISCORD: 'https://discord.gg/MxxYyUJEfT',
      APP_VERSION: NUXT_PUBLIC_APP_VERSION,
      // api
      API_URL: NUXT_PUBLIC_API_URL,
      API_TIMEOUT: 15000,
      // sentry
      SENTRY_DNS: NUXT_PUBLIC_SENTRY_DNS,
      SENTRY_DEBUG: NUXT_PUBLIC_SENTRY_DEBUG == 'true',
      // google
      GOOGLE_TAG_ID,
      GOOGLE_CLIENT_ID,
      // Adsense
      GOOGLE_ADSENSE_ID: GOOGLE_ADSENSE_ID,
      GOOGLE_ADSENSE_TEST_MODE: GOOGLE_ADSENSE_TEST_MODE === 'true'
    }
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2024-07-05'
});
