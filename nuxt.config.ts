import dotenv from 'dotenv';
import type { LocaleObject } from '@nuxtjs/i18n';

// environment
dotenv.config({ path: './.env.production', override: true });
dotenv.config({ path: './.env', override: true });

const {
  // general
  SITE_URL,
  SITE_NAME,
  SITE_REPO,
  SITE_PREVIEW,
  // api
  API_URL,
  API_TIMEOUT,
  // file
  FILE_URL,
  // google
  GOOGLE_TAG_ID,
  GOOGLE_CLIENT_ID,
  // discord
  DISCORD_INVITE_LINK,
  DISCORD_BOT_NAME,
  // clarity
  CLARITY_ID,
  // donate
  DONATE_URL,
  DONATE_DISABLED,
} = import.meta.env;
const NITRO_PRERENDER = import.meta.env.NITRO_PRERENDER !== 'false';

const localesMetadata: LocaleObject[] = [
  {
    name: 'English',
    code: 'en',
    iso: 'en',
    isCatchallLocale: true,
    files: ['en/default.json'],
  },
  { name: 'Indonesia', code: 'id', iso: 'id', files: ['id/default.json'] },
  { name: '日本語', code: 'ja', iso: 'ja', files: ['ja/default.json'] },
  { name: '한국어', code: 'ko', iso: 'ko', files: ['ko/default.json'] },
  {
    name: 'ภาษาไทย',
    code: 'th',
    iso: 'th',
    rtl: true,
    files: ['th/default.json'],
  },
  { name: 'Türkçe', code: 'tr', iso: 'tr', files: ['tr/default.json'] },
  { name: 'Tiếng Việt', code: 'vi', iso: 'vi', files: ['vi/default.json'] },
  { name: 'Ukrainian', code: 'uk', iso: 'uk', files: ['uk/default.json'] },
  { name: '中文(简体)', code: 'zh', iso: 'zh', files: ['zh/default.json'] },
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: {
    devtools: { enabled: false },
  },

  $production: {
    i18n: {
      baseUrl: SITE_URL,
    },
    scripts: {
      registry: {
        googleAnalytics: {
          id: GOOGLE_TAG_ID!,
        },
        clarity: {
          id: CLARITY_ID!,
        },
      },
    },
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
    '@nuxt/scripts',
    // dev
    '@nuxt/eslint',
  ],

  routeRules: {
    '/': { prerender: true },
    '/characters': { prerender: true },
    '/characters/**': { prerender: true },
    '/echoes': { prerender: true },
    '/echoes/**': { prerender: true },
    '/items': { prerender: true },
    '/items/**': { prerender: true },
    '/weapons': { prerender: true },
    '/weapons/**': { prerender: true },
    '/trophies': { prerender: true },
    '/trophies/**': { prerender: true },
    '/settings': { robots: false },
    '/convene-history/import': { robots: false },
    '/license': { robots: false },
    '/guides': { prerender: false },
    '/guides/editor': { robots: false, prerender: false },
    '/guides/rss': { proxy: '/api/rss/guides', prerender: false },
    '/commit': { robots: false, prerender: false },
    '/commit/**': { robots: false, prerender: false },
    '/calculator/import': { robots: false, prerender: false },
    '/calculator/inventory': { robots: false, prerender: false },
    // TODO: remove soon
    '/echos/**': { redirect: '/echoes/**' },
  },

  sitemap: {
    autoLastmod: true,
    exclude: [
      '/settings',
      '/convene-history/import',
      '/privacy-policy',
      '/license',
      '/donation',
      '/guides/rss',
      '/guides/editor',
      '/errors',
      '/commit',
      '/calculator/import',
      '/calculator/inventory',
    ],
    sources: [
      '/api/__sitemap__/characters',
      '/api/__sitemap__/echoes',
      '/api/__sitemap__/items',
      '/api/__sitemap__/trophies',
      '/api/__sitemap__/weapons',
    ],
  },

  css: ['~/assets/main.css', '~/assets/main.scss'],

  features: {
    inlineStyles: false,
  },

  site: {
    url: SITE_URL,
    indexable: SITE_PREVIEW !== 'true',
  },

  sourcemap: {
    server: false,
    client: false,
  },

  i18n: {
    vueI18n: './i18n/i18n.config.ts',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root',
    },
    locales: localesMetadata,
    langDir: './i18n/messages',
    compilation: {
      strictMessage: false,
    },
  },

  vite: {
    esbuild: {
      legalComments: 'none',
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.json'],
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
            } else if (id.includes('i18n')) {
              return 'i18n';
            }
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    server: {
      warmup: {
        clientFiles: [
          'app.vue',
          'layouts/*.vue',
          './components/**/*.vue',
          './composables/*.ts',
          './pages/**/*.vue',
        ],
      },
    },
  },

  nitro: {
    prerender: {
      crawlLinks: NITRO_PRERENDER,
      routes: NITRO_PRERENDER ? ['/', '/sitemap.xml'] : [],
    },
  },

  appConfig: {
    buildNumber: Date.now(),
  },

  // environments
  runtimeConfig: {
    public: {
      // general
      SITE_URL,
      SITE_NAME,
      SITE_REPO,
      SITE_PREVIEW,
      // api
      API_URL,
      API_TIMEOUT: parseInt(API_TIMEOUT!),
      // file
      FILE_URL,
      // google
      GOOGLE_TAG_ID,
      GOOGLE_CLIENT_ID,
      // discord
      DISCORD_INVITE_LINK,
      DISCORD_BOT_NAME,
      // clarity
      CLARITY_ID,
      // donate
      DONATE_URL,
      DONATE_DISABLED,
    },
  },

  experimental: {
    viewTransition: true,
  },

  compatibilityDate: '2024-07-05',
});
