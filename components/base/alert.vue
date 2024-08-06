<script setup lang="ts">
const props = defineProps<{
  id?: string;
  title?: string;
  text?: string;
  closable?: boolean;
  class?: string;
  color?: string;
}>();

// states
const enabled = props.id ? useLocalStorage(`${props.id}`, true) : ref(true);

// events
const onPressed = () => {
  if (!props.id) {
    return;
  }
  enabled.value = false;
};
</script>

<template>
  <client-only>
    <v-alert
      v-model="enabled"
      class="pa-2 mb-2"
      :class="{ 'cursor-pointer': typeof props.id !== 'undefined' }"
      :color="props.color"
      @click="onPressed"
    >
      <template #title>
        <div
          v-if="title"
          class="text-center w-100 text-body-1"
        >
          {{ title }}
        </div>
      </template>

      <template #text>
        <div
          v-if="text"
          class="text-center text-subtitle-2"
        >
          {{ text }}
        </div>
      </template>
    </v-alert>
  </client-only>
</template>
