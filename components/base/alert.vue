<script setup lang="ts">
const props = defineProps<{
  id?: string;
  title?: string;
  text?: string;
  closable?: boolean;
}>();

// states
const enabled = props.id ? useLocalStorage(`${props.id}`, true) : ref(true);
</script>

<template>
  <v-alert v-model="enabled" class="pa-1" :closable="closable">
    <template #title>
      <div v-if="title" class="text-center w-100 text-body-1">
        {{ title }}
      </div>
    </template>

    <template #text>
      <div v-if="text" class="text-center text-subtitle-2">
        {{ text }}
      </div>
    </template>
  </v-alert>
</template>
