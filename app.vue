<script setup lang="ts">
import dayjs from 'dayjs';
import { useLocale } from 'vuetify';

// uses
const i18n = useI18n();
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
  identifierAttribute: 'default'
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
onMounted(initialize);

// seo meta
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} | Wuthering Waves`
      : i18n.t('meta.title');
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: `${SITE_URL}/favicon.png`
    },
    // {
    //   rel: 'alternate',
    //   type: 'application/rss+xml',
    //   href: `${SITE_URL}/guides/rss`
    // },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      href: `${SITE_URL}/characters/rss`
    },
    ...(i18nHead.value.link || []).map((e) => {
      return {
        ...e,
        href: `${SITE_URL}${e.href || '/'}`
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
    }
  ],
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang
  }
});
useSeoMeta({
  ogSiteName: 'WutheringWaves.app',
  ogImage: `${SITE_URL}/cover.webp`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ogImageType: 'image/webp' as any,
  ogType: 'website',
  description: i18n.t('meta.description'),
  ogDescription: i18n.t('meta.description')
});

onNuxtReady(() => window.postMessage('onNuxtReady'));
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
