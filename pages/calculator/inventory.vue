<script setup lang="ts">
// uses
const { t } = useI18n();
const sidebar = useSidebar();

// head meta
const title = t('meta.calculator.inventory.title');
const description = t('meta.calculator.inventory.description');

useAppBar().setTitle(t('calculator.inventory.title'));
useHead({ title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });

// lifecycle
onNuxtReady(() => {
  if (sidebar.open) sidebar.open = false;
});
</script>

<template>
  <div>
    <calculator-drawer />

    <!-- page -->
    <base-alert :text="$t('calculator.inventory.introduce')" />
  </div>
</template>
