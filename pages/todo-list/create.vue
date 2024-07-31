<script setup lang="ts">
// uses
const i18n = useI18n();
const route = useRoute();

// seo meta
const title = i18n.t('meta.todoList.title');
const description = i18n.t('meta.todoList.description');

useHead({
  meta:
    Object.keys(route.query).length > 0
      ? [
          {
            name: 'robots',
            content: 'noindex',
          },
        ]
      : [],
});

useSeoMeta({
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/todo-list',
          title: i18n.t('todoList.title'),
        },
        {
          to: '/todo-list/create',
          title: i18n.t('common.create'),
        },
      ]"
    />

    <coming-soon :title="i18n.t('todoList.create.title')" />
  </div>
</template>
