<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js';

const props = defineProps<{
  path?: string;
  color?: string;
}>();

// uses
const app = useApp();

// events
const onPressedContribute = () => {
  window.open(`${app.githubRepo}${props.path || ''}`);
};
</script>

<template>
  <v-btn
    :text="$t('common.editThisPage')"
    :append-icon="mdiOpenInNew"
    :color="props.color || 'primary'"
    variant="text"
    size="small"
    @click="onPressedContribute"
  />
</template>
