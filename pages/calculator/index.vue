<script setup lang="ts">
import { useDisplay } from 'vuetify';

// uses
const { t } = useI18n();
const sidebar = useSidebar();
const display = useDisplay();

// head meta
const title = t('meta.calculator.title');
const description = t('meta.calculator.description');

useAppBar().setTitle(t('calculator.title'));
useHead({ title });
useSeoMeta({ ogTitle: title, description, ogDescription: description });
</script>

<template>
  <div>
    <calculator-builder />

    <roles-required :roles="['Owner', 'Moderator']" type="any" />
  </div>
</template>
