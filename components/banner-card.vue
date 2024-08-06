<script setup lang="ts">
import type { IBanner } from '~/interfaces/banner';

const props = defineProps<{
  item: IBanner;
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: 'onClick');
}>();
</script>

<template>
  <v-card
    :disabled="disabled"
    @click="() => emits('onClick')"
  >
    <v-img
      class="align-end"
      :src="item.thumbnail ? item.thumbnail : undefined"
      :aspect-ratio="16 / 9"
      :cover="true"
    >
      <template #placeholder> placeholder </template>

      <v-card-title>
        {{ item.name }}
      </v-card-title>
    </v-img>
  </v-card>
</template>
