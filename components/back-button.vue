<script setup lang="ts">
import { mdiArrowLeft } from '@mdi/js';

const props = defineProps<{
  to: string;
}>();

// uses
const localePath = useLocalePath();
</script>

<template>
  <v-btn :to="localePath(props.to)" variant="outlined">
    <v-icon :icon="mdiArrowLeft" />
    <span class="ml-1 hidden-sm-and-down">
      {{ $t('common.back') }}
    </span>
  </v-btn>
</template>
