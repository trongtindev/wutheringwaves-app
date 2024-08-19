<script setup lang="ts">
// uses
const { t } = useI18n();

// head meta
const title = t('meta.calculator.simulation.title');
const description = t('meta.calculator.simulation.description');

useAppBar().setTitle(t('calculator.simulation.title'));
useHead({ title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div></div>
</template>
