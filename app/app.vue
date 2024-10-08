<script setup lang="ts">
// uses
const i18n = useI18n();
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
  identifierAttribute: 'default',
});

const { SITE_URL, SITE_NAME } = useRuntimeConfig().public;

// seo meta
useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${SITE_NAME}` : i18n.t('meta.title');
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
    {
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
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
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
