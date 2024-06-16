<script setup lang="ts">
// uses
const i18n = useI18n();

// seo meta
const title = i18n.t('meta.teams.title');
const description = i18n.t('meta.teams.title');

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
          to: '/teams',
          title: i18n.t('teams.title')
        }
      ]"
    />

    <coming-soon :title="i18n.t('teams.title')" />
  </div>
</template>
