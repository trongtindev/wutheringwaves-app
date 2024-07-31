<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js';

const props = defineProps<{
  title: string;
}>();

// events
</script>

<template>
  <v-card>
    <v-card-title>
      {{ props.title }}
    </v-card-title>

    <v-card-text class="text-center">
      <v-alert :text="$t('common.comingSoon')" />
    </v-card-text>
  </v-card>
</template>
