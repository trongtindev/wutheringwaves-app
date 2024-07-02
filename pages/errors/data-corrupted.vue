<script setup lang="ts">
// uses
const i18n = useI18n();

// seo meta
const title = i18n.t('meta.errors.database.corrupted.title');

useHead({
  title,
  meta: [
    {
      name: 'robots',
      content: 'noindex'
    }
  ]
});
</script>

<template></template>
