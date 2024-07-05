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
    :text="$t('common.contribute')"
    :append-icon="mdiOpenInNew"
    variant="outlined"
    :color="props.color || 'primary'"
    @click="onPressedContribute"
  />
</template>
