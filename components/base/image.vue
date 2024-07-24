<script setup lang="ts">
const props = defineProps<{
  src?: string;
  aspectRatio?: number;
  cover?: boolean;
}>();
</script>

<template>
  <v-img
    :src="props.src"
    :aspect-ratio="props.aspectRatio"
    :cover="props.cover"
  >
    <template #placeholder>
      <div class="h-100 w-100 d-flex align-center justify-center">
        <v-progress-circular :indeterminate="true" />
      </div>
    </template>
  </v-img>
</template>
