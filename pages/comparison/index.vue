<script setup lang="ts">
// uses
const i18n = useI18n();

// seo meta
const title = i18n.t('meta.comparison.title');
const description = i18n.t('meta.comparison.description');

useHead({
  title,
  meta: [
    {
      name: 'robots',
      content: 'noindex'
    }
  ]
});

useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description
});
</script>

<template>
  <coming-soon :title="i18n.t('comparison.title')" />
</template>
