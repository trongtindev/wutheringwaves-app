<script setup lang="ts">
// uses
const i18n = useI18n();

// seo meta
const title = i18n.t('donation.title');
const description = i18n.t('donation.description');

useHead({ title });

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
