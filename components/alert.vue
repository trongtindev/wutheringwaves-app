<script setup lang="ts">
const props = defineProps<{
  id: string;
  text: string;
  color?: string;
  title?: string;
}>();

// states
const enabled = useLocalStorage(`alert.${props.id}`, true);
</script>

<template>
  <client-only>
    <v-alert
      v-model="enabled"
      class="mb-2"
      :color="props.color || 'info'"
      :title="props.title"
      :text="props.text"
      :closable="true"
    />
  </client-only>
</template>
