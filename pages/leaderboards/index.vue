<script setup lang="ts">
// uses
const i18n = useI18n();

// seo meta
const title = i18n.t('meta.leaderboards.title');
const description = i18n.t('meta.leaderboards.description');

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
          to: 'leaderboards',
          title: i18n.t('leaderboards.title')
        }
      ]"
    />

    <coming-soon :title="i18n.t('leaderboards.title')" />
  </div>
</template>
