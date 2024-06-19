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
      <v-row>
        <v-col class="d-flex align-center">
          {{ props.title }}
        </v-col>

        <v-col class="d-flex align-center justify-end">
          <contribute-button />
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider />

    <v-card-text class="text-center">
      <v-alert :text="$t('common.comingSoon')" />
    </v-card-text>
  </v-card>
</template>
