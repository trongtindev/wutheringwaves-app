<script setup lang="ts">
// uses
const i18n = useI18n();

// seo meta
const title = i18n.t('meta.guide.title');
const description = i18n.t('meta.guide.description');

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
          to: 'guides',
          title: i18n.t('guides.title')
        }
      ]"
    />

    <coming-soon :title="i18n.t('guides.title')" />
  </div>
</template>
