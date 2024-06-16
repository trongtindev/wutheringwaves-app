<script setup lang="ts">
// uses
const i18n = useI18n();
const localePath = useLocalePath();

// seo meta
const title = i18n.t('todoList.title');
const description = i18n.t('meta.todoList.description');

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
          to: '/todo-list',
          title: i18n.t('todoList.title')
        }
      ]"
    />

    <coming-soon :title="i18n.t('todoList.title')" />
  </div>
</template>
