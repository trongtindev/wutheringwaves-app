<script setup lang="ts">
import './prototypes/array.ts';
import dayjs from 'dayjs';
import { useLocale } from 'vuetify';

// uses
const i18n = useI18n();
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
  identifierAttribute: 'default',
});
// const rtl = useRtl();
const vuetifyLocale = useLocale();
const { SITE_URL } = useRuntimeConfig().public;

// functions
const initialize = () => {
  initializeLocalization();
};
const initializeLocalization = () => {
  dayjs.locale(i18n.locale.value);
  vuetifyLocale.current.value = i18n.locale.value;

  // const isRtl =
  //   i18n.locales.value.findIndex((e) => {
  //     return e.code === i18n.locale.value && e.rtl;
  //   }) >= 0;
  // rtl.isRtl.value = isRtl;
};

watch(() => i18n.locale.value, initializeLocalization);

// lifecycle
onNuxtReady(initialize);

// seo meta
useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} | Wuthering Waves`
      : i18n.t('meta.title');
  },
  link: [
    {
      rel: 'icon',
      href: `${SITE_URL}/favicon.ico`,
    },
    {
      rel: 'apple-touch-icon',
      href: `${SITE_URL}/icon-192.png`,
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      href: `${SITE_URL}/guides/rss`,
    },
    ...(i18nHead.value.link || []),
  ],
  meta: [
    ...(i18nHead.value.meta || []),
    {
      name: 'keywords',
      content:
        'wutheringwaves, wutheringwaves.app, wuthering, wuthering waves, kuro, pity tracker, wuwa tracker, pity counter, wuthering waves character, wuthering waves guide, wuthering waves tier list, wuthering waves trophy, wuthering waves item',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'application-name',
      content: 'WutheringWaves.app',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'WutheringWaves.app',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
  ],
  style: [
    {
      id: 'preload-css',
      innerHTML:
        '@media screen and (min-width: 1264px) { main { padding-left: 256px !important; } }',
    },
  ],
});
useSeoMeta({
  ogSiteName: 'WutheringWaves.app',
  ogImage: `${SITE_URL}/cover.webp`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ogImageType: 'image/webp' as any,
  ogType: 'website',
  description: i18n.t('meta.description'),
  ogDescription: i18n.t('meta.description'),
});

onNuxtReady(() => {
  const preloadCSS = document.querySelector('#preload-css');
  if (preloadCSS) preloadCSS.remove();
  window.postMessage('onNuxtReady');
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
