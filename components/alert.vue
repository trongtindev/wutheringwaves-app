<script setup lang="ts">
const props = defineProps<{
  id: string;
  text: string;
  color?: string;
  title?: string;
}>();

// states
const isIgnored = useCookie<boolean>(`alert.${props.id}`);
</script>

<template>
  <client-only>
    <template #fallback></template>
    <v-alert
      v-if="!isIgnored"
      v-model="isIgnored"
      class="mb-2"
      :color="props.color || 'info'"
      :title="props.title"
      :text="props.text"
      :closable="true"
    />
  </client-only>
</template>
