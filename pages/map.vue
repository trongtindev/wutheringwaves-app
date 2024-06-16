<script setup lang="ts">
// uses
const i18n = useI18n();
const sidebar = useSidebar();

// states
const lastSidebar = ref();

// lifecycle
onMounted(() => {
  if (sidebar.open) {
    lastSidebar.value = sidebar.open;
    sidebar.open = false;
  }
});

onUnmounted(() => {
  if (lastSidebar.value) {
    sidebar.open = lastSidebar.value;
  }
});

// meta
const title = i18n.t('map.title');
const description = i18n.t('meta.map.description');

useHead({ title });
useSeoMeta({
  ogTitle: title,
  description: description,
  ogDescription: description
});
</script>

<template>
  <div>
    <!-- breadcrumbs -->
    <breadcrumbs
      :items="[
        {
          to: '/map',
          title: i18n.t('map.title')
        }
      ]"
    />

    <coming-soon :title="i18n.t('map.title')" />
  </div>
</template>
