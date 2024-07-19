<script setup lang="ts">
import '@@/assets/app.css';
import dayjs from 'dayjs';
import { useLocale } from 'vuetify';

// uses
const i18n = useI18n();
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
  identifierAttribute: 'default'
});
const app = useApp();
const auth = useAuth();
const backup = useBackup();
const database = useDatabase();
const vuetifyLocale = useLocale();
const runtimeConfig = useRuntimeConfig();

// initialize
if (import.meta.client) {
  app.initialize();
  auth.initialize();
  backup.initialize();
  database.initialize();
}

// lifecycle
watch(
  () => i18n.locale.value,
  (value) => {
    dayjs.locale(value);
    vuetifyLocale.current.value = value;
  }
);

onMounted(() => {
  dayjs.locale(i18n.locale.value);
  vuetifyLocale.current.value = i18n.locale.value;
});

// seo meta
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} | ${i18n.t('meta.title')}`
      : i18n.t('meta.title');
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: `${runtimeConfig.public.SITE_URL}/favicon.png`
    },
    ...(i18nHead.value.link || []).map((e) => {
      return {
        ...e,
        href: `${runtimeConfig.public.SITE_URL}${e.href || '/'}`
      };
    })
  ],
  meta: [
    ...(i18nHead.value.meta || []),
    {
      name: 'keywords',
      content:
        'wutheringwaves, wutheringwaves.app, wuthering, wuthering waves, kuro, pity tracker, wuwa tracker, pity counter, wuthering waves character, wuthering waves guide, wuthering waves tier list, wuthering waves trophy, wuthering waves item'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {}
  ],
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang
  }
});
useSeoMeta({
  ogSiteName: 'WutheringWaves.app',
  ogImage: `${runtimeConfig.public.SITE_URL}/cover.webp`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ogImageType: 'image/webp' as any,
  ogType: 'website',
  description: i18n.t('meta.description'),
  ogDescription: i18n.t('meta.description')
});

// lifecycle
onMounted(() => {
  dayjs.tz.setDefault(runtimeConfig.public.DAYJS_TIMEZONE);
});

onNuxtReady(() => {
  console.log('onNuxtReady');
  window.postMessage('onNuxtReady');
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
