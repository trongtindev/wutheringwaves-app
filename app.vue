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
const account = useAccount();
const backup = useBackup();
const database = useDatabase();
const firebase = useFirebase();
// const resources = useResources();
const vuetifyLocale = useLocale();
const runtimeConfig = useRuntimeConfig();

// lifecycle
if (import.meta.client) {
  app.initialize();
  auth.initialize();
  account.initialize();
  backup.initialize();
  database.initialize();
  firebase.initialize();
  // resources.initialize();
}

// lifecycle
if (import.meta.client) {
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
}

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
    ...(i18nHead.value.link || [])
  ],
  meta: [...(i18nHead.value.meta || [])],
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang
  }
});

useSeoMeta({
  ogSiteName: 'WutheringWaves.app',
  ogImage: `${runtimeConfig.public.SITE_URL}/cover.webp`,
  ogType: 'website',
  description: i18n.t('meta.description'),
  ogDescription: i18n.t('meta.description')
});

// lifecycle
onMounted(() => {
  dayjs.tz.setDefault(runtimeConfig.public.DAYJS_TIMEZONE);
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
