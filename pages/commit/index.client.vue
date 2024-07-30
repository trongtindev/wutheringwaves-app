<script setup lang="ts">
// uses
const i18n = useI18n();
const route = useRoute();

// head meta
useApp().title = i18n.t('commit.title');
</script>

<template>
  <div>
    <commit-character v-if="route.query.type == 'character'" />
  </div>
</template>
