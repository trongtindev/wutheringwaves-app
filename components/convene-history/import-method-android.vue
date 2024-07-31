<script setup lang="ts">
import { mdiImport } from '@mdi/js';

const emits = defineEmits<{
  (e: 'on-import', url: string): Promise<void>;
}>();
</script>

<template>
  <div>
    <v-card-text>
      <v-alert type="error" :title="$t('Disclaimer')" class="mb-2" />

      {{ $t('Coming soon!') }}
    </v-card-text>
  </div>
</template>
