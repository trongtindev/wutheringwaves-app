<script setup lang="ts">
import { useDisplay } from 'vuetify';

// define
const model = defineModel<boolean>();
const props = defineProps<{
  location?: 'right' | 'left';
}>();

// uses
const display = useDisplay();

// states
const height = ref(0);
const bottomSheet = ref(display.smAndDown);

// changes
watch(
  () => display.smAndDown.value,
  (value) => {
    bottomSheet.value = value;
  },
);

// lifecycle
onMounted(() => {
  height.value = window.innerHeight * 0.75;
});
</script>

<template>
  <v-bottom-sheet v-if="bottomSheet" v-model="model">
    <slot :height="height" />
  </v-bottom-sheet>

  <v-navigation-drawer
    v-else
    v-model="model"
    :temporary="true"
    :width="360"
    :location="props.location || 'right'"
  >
    <slot :height="height" />
  </v-navigation-drawer>
</template>
