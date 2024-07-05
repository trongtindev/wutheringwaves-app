<script setup lang="ts">
// uses
const i18n = useI18n();

// seo meta
const title = i18n.t('meta.donation.title');
const description = i18n.t('meta.donation.description');

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
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/donation',
          title: i18n.t('donation.title')
        }
      ]"
    />

    <coming-soon :title="i18n.t('donation.title')" />
  </div>
</template>
