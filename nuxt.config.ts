import type { LocaleObject } from '@nuxtjs/i18n';
import dotenv from 'dotenv';

// environment
dotenv.config({ path: './.env.production', override: true });
dotenv.config({ path: './.env', override: true });

const {
  // general
  SITE_URL,
  SITE_NAME,
  SITE_REPO,
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
  // github
  GITHUB_OWNER,
  GITHUB_REPO,
} = import.meta.env;

const NITRO_PRERENDER = import.meta.env.NITRO_PRERENDER !== 'false';
const NITRO_PRERENDER_CRAWL =
  NITRO_PRERENDER && import.meta.env.NITRO_PRERENDER_CRAWL !== 'false';

const localesMetadata: LocaleObject[] = [
  {
    name: 'English',
    code: 'en',
    language: 'en',
    isCatchallLocale: true,
    files: ['en/default.json'],
  },
  { name: 'Indonesia', code: 'id', language: 'id', files: ['id/default.json'] },
  { name: '日本語', code: 'ja', language: 'ja', files: ['ja/default.json'] },
  { name: '한국어', code: 'ko', language: 'ko', files: ['ko/default.json'] },
  { name: 'ภาษาไทย', code: 'th', language: 'th', files: ['th/default.json'] },
  { name: 'Türkçe', code: 'tr', language: 'tr', files: ['tr/default.json'] },
  {
    name: 'Tiếng Việt',
    code: 'vi',
    language: 'vi',
    files: ['vi/default.json'],
  },
  { name: 'Ukrainian', code: 'uk', language: 'uk', files: ['uk/default.json'] },
  {
    name: '中文(简体)',
    code: 'zh',
    language: 'zh',
    files: ['zh/default.json'],
  },
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: {
    devtools: { enabled: false },
    typescript: {
      strict: true,
    },
    sourcemap: {
      server: true,
      client: true,
    },
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
    sourcemap: {
      server: false,
      client: false,
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
    '@nuxtjs/device',
    '@nuxt/scripts',
    // dev
    '@nuxt/eslint',
  ],

  routeRules: {
    '/robots.txt': { proxy: '/api/robots' },
    '/guides/rss': { proxy: '/api/rss/guides' },
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
      '/guides/rss',
      '/guides/editor',
      '/errors',
      '/calculator/import',
      '/calculator/inventory',
      '/calculator/simulation',
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
  },

  i18n: {
    vueI18n: './app/i18n/i18n.config.ts',
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
    lazy: false,
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
      concurrency: 10,
      crawlLinks: NITRO_PRERENDER_CRAWL,
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
      // github
      GITHUB_OWNER,
      GITHUB_REPO,
    },
  },

  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viewTransition: true,
    checkOutdatedBuildInterval: 60 * 5 * 1000,
  },

  compatibilityDate: '2024-07-05',
});
