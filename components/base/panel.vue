<script setup lang="ts">
import { useDisplay } from 'vuetify';

// define
const model = defineModel<boolean>();

// uses
const display = useDisplay();

// states
const bottomSheet = ref(display.smAndDown);

// changes
watch(
  () => display.smAndDown.value,
  (value) => {
    bottomSheet.value = value;
  }
);
</script>

<template>
  <v-bottom-sheet v-if="bottomSheet" v-model="model">
    <slot />
  </v-bottom-sheet>

  <v-navigation-drawer
    v-else
    v-model="model"
    :temporary="true"
    :width="360"
    location="right"
  >
    <slot />
  </v-navigation-drawer>
</template>
