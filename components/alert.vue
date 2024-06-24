<script setup lang="ts">
const props = defineProps<{
  id: string;
  text: string;
  title?: string;
}>();

// states
const enabled = useLocalStorage(`alert.${props.id}`, true);
</script>

<template>
  <v-alert
    v-model="enabled"
    :title="props.title"
    :text="props.text"
    :closable="true"
  />
</template>
