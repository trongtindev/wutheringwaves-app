<script setup lang="ts">
// uses
const i18n = useI18n();
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/todo-list',
          title: i18n.t('todoList.title')
        },
        {
          to: '/todo-list/create',
          title: i18n.t('common.create')
        }
      ]"
    />

    <coming-soon :title="i18n.t('todoList.create.title')" />
  </div>
</template>
