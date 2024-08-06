<script setup lang="ts">
// uses
const { t } = useI18n();
const sidebar = useSidebar();

// head meta
const title = t('meta.calculator.title');
const description = t('meta.calculator.description');

useAppBar().setTitle(t('calculator.title'));
useHead({ title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });

// lifecycle
onNuxtReady(() => {
  if (sidebar.open) sidebar.open = false;
});
</script>

<template>
  <div>
    <calculator-builder />

    <roles-required :roles="['Owner', 'Moderator']" type="any" />
  </div>
</template>
