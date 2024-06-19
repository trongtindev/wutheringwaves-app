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
          to: 'guide',
          title: i18n.t('guide.title')
        }
      ]"
    />

    <coming-soon :title="i18n.t('guide.title')" />
  </div>
</template>
